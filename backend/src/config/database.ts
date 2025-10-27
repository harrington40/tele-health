// @ts-nocheck
const r = require('rethinkdb');
import { config } from '../config';

class DatabaseConnection {
  private connection: r.Connection | null = null;

  async connect(): Promise<r.Connection> {
    try {
      this.connection = await r.connect({
        host: config.rethinkdb.host,
        port: config.rethinkdb.port,
        db: config.rethinkdb.db
      });

      console.log('✅ Connected to RethinkDB');
      
      // Initialize database and tables
      await this.initializeDatabase();
      
      return this.connection;
    } catch (error) {
      console.error('❌ Failed to connect to RethinkDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      console.log('🔌 Disconnected from RethinkDB');
    }
  }

  getConnection(): r.Connection {
    if (!this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.connection;
  }

  private async initializeDatabase(): Promise<void> {
    if (!this.connection) return;

    try {
      // Create database if it doesn't exist
      const dbList = await r.dbList().run(this.connection);
      if (!dbList.includes(config.rethinkdb.db)) {
        await r.dbCreate(config.rethinkdb.db).run(this.connection);
        console.log(`📊 Created database: ${config.rethinkdb.db}`);
      }

      // Create tables if they don't exist
      const tables = [
        'users',
        'patients',
        'doctors',
        'appointments',
        'consultations',
        'messages',
        'medical_records',
        'notifications',
        'payments',
        'prescriptions'
      ];

      const tableList = await r.tableList().run(this.connection);

      for (const table of tables) {
        if (!tableList.includes(table)) {
          await r.tableCreate(table).run(this.connection);
          console.log(`📋 Created table: ${table}`);

          // Create indexes based on table type
          await this.createIndexes(table);
        }
      }
    } catch (error) {
      console.error('❌ Error initializing database:', error);
      throw error;
    }
  }

  private async createIndexes(tableName: string): Promise<void> {
    if (!this.connection) return;

    const indexMap: Record<string, string[]> = {
      users: ['email', 'role', 'createdAt'],
      patients: ['userId', 'dateOfBirth'],
      doctors: ['userId', 'specialization', 'isAvailable'],
      appointments: ['patientId', 'doctorId', 'status', 'appointmentDate'],
      consultations: ['patientId', 'doctorId', 'appointmentId', 'status', 'startTime'],
      messages: ['consultationId', 'senderId', 'timestamp'],
      medical_records: ['patientId', 'doctorId', 'createdAt'],
      notifications: ['userId', 'isRead', 'createdAt'],
      payments: ['patientId', 'appointmentId', 'status'],
      prescriptions: ['patientId', 'doctorId', 'consultationId']
    };

    const indexes = indexMap[tableName];
    if (indexes) {
      for (const index of indexes) {
        try {
          await r.table(tableName).indexCreate(index).run(this.connection);
          console.log(`🔍 Created index ${index} on table ${tableName}`);
        } catch (error) {
          // Index might already exist, ignore error
        }
      }

      // Wait for indexes to be ready
      await r.table(tableName).indexWait().run(this.connection);
    }
  }

  // Helper method for real-time queries
  async watchChanges(tableName: string, filter?: any): Promise<r.Cursor> {
    if (!this.connection) {
      throw new Error('Database not connected');
    }

    let query = r.table(tableName).changes();
    
    if (filter) {
      query = query.filter(filter);
    }

    return query.run(this.connection);
  }
}

export const db = new DatabaseConnection();
export default db;