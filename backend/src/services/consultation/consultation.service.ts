// @ts-nocheck
import * as grpc from '@grpc/grpc-js';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';
import { db } from '../../config/database';
import logger from '../../utils/logger';

interface CreateConsultationRequest {
  patientId: string;
  doctorId: string;
  appointmentId: string;
  type: string;
}

interface JoinConsultationRequest {
  consultationId: string;
  userId: string;
}

interface EndConsultationRequest {
  consultationId: string;
  userId: string;
  notes: string;
  prescriptions: string[];
}

interface GetConsultationHistoryRequest {
  userId: string;
  limit: number;
  offset: number;
}

interface SendMessageRequest {
  consultationId: string;
  senderId: string;
  content: string;
  type: string;
}

interface GetMessagesRequest {
  consultationId: string;
  userId: string;
}

export class ConsultationService {
  static async createConsultation(
    call: grpc.ServerUnaryCall<CreateConsultationRequest, any>,
    callback: grpc.sendUnaryData<any>
  ): Promise<void> {
    try {
      const { patientId, doctorId, appointmentId, type } = call.request;

      const consultationId = uuidv4();
      const consultation = {
        id: consultationId,
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_id: appointmentId,
        type: type.toUpperCase(),
        status: 'CREATED',
        created_at: new Date(),
        started_at: null,
        ended_at: null,
        notes: '',
        participants: [patientId, doctorId]
      };

      await db.getConnection()
        .table('consultations')
        .insert(consultation)
        .run();

      logger.info(`Consultation created: ${consultationId}`);

      callback(null, {
        success: true,
        consultationId,
        message: 'Consultation created successfully'
      });

    } catch (error) {
      logger.error('Create consultation error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  static async joinConsultation(
    call: grpc.ServerUnaryCall<JoinConsultationRequest, any>,
    callback: grpc.sendUnaryData<any>
  ): Promise<void> {
    try {
      const { consultationId, userId } = call.request;

      // Get consultation
      const consultation = await db.getConnection()
        .table('consultations')
        .get(consultationId)
        .run()
        .catch(() => null);

      if (!consultation) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Consultation not found'
        });
      }

      // Check if user is authorized
      if (!consultation.participants.includes(userId)) {
        return callback({
          code: grpc.status.PERMISSION_DENIED,
          message: 'Not authorized to join this consultation'
        });
      }

      // Update consultation status
      await db.getConnection()
        .table('consultations')
        .get(consultationId)
        .update({
          status: 'ACTIVE',
          started_at: new Date()
        })
        .run();

      // Get participants info
      const participants = await db.getConnection()
        .table('users')
        .getAll(...consultation.participants)
        .pluck('id', 'first_name', 'last_name', 'role')
        .run();

      const formattedParticipants = participants.map((p: any) => ({
        userId: p.id,
        name: `${p.first_name} ${p.last_name}`,
        role: p.role,
        isOnline: true
      }));

      const sessionToken = uuidv4(); // In production, generate proper session token

      callback(null, {
        success: true,
        sessionToken,
        participants: formattedParticipants
      });

    } catch (error) {
      logger.error('Join consultation error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  static async endConsultation(
    call: grpc.ServerUnaryCall<EndConsultationRequest, any>,
    callback: grpc.sendUnaryData<any>
  ): Promise<void> {
    try {
      const { consultationId, userId, notes, prescriptions } = call.request;

      // Get consultation
      const consultation = await db.getConnection()
        .table('consultations')
        .get(consultationId)
        .run()
        .catch(() => null);

      if (!consultation) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Consultation not found'
        });
      }

      // Check if user is the doctor
      if (consultation.doctor_id !== userId) {
        return callback({
          code: grpc.status.PERMISSION_DENIED,
          message: 'Only the doctor can end the consultation'
        });
      }

      // Update consultation
      await db.getConnection()
        .table('consultations')
        .get(consultationId)
        .update({
          status: 'COMPLETED',
          ended_at: new Date(),
          notes
        })
        .run();

      // Create prescriptions if provided
      if (prescriptions && prescriptions.length > 0) {
        const prescriptionRecords = prescriptions.map((prescription: string) => ({
          id: uuidv4(),
          patient_id: consultation.patient_id,
          doctor_id: consultation.doctor_id,
          consultation_id: consultationId,
          prescription: prescription,
          created_at: new Date()
        }));

        await db.getConnection()
          .table('prescriptions')
          .insert(prescriptionRecords)
          .run();
      }

      logger.info(`Consultation ended: ${consultationId}`);

      callback(null, {
        success: true,
        message: 'Consultation ended successfully'
      });

    } catch (error) {
      logger.error('End consultation error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  static async getConsultationHistory(
    call: grpc.ServerUnaryCall<GetConsultationHistoryRequest, any>,
    callback: grpc.sendUnaryData<any>
  ): Promise<void> {
    try {
      const { userId, limit = 10, offset = 0 } = call.request;

      const consultations = await db.getConnection()
        .table('consultations')
        .filter((row: any) =>
          row('patient_id').eq(userId).or(row('doctor_id').eq(userId))
        )
        .orderBy(db.getConnection().desc('created_at'))
        .skip(offset)
        .limit(limit)
        .run();

      const total = await db.getConnection()
        .table('consultations')
        .filter((row: any) =>
          row('patient_id').eq(userId).or(row('doctor_id').eq(userId))
        )
        .count()
        .run();

      const formattedConsultations = consultations.map((c: any) => ({
        consultationId: c.id,
        patientId: c.patient_id,
        doctorId: c.doctor_id,
        patientName: '', // Would need to join with users table
        doctorName: '', // Would need to join with users table
        startTime: c.started_at,
        endTime: c.ended_at,
        type: c.type,
        status: c.status,
        notes: c.notes
      }));

      callback(null, {
        consultations: formattedConsultations,
        total
      });

    } catch (error) {
      logger.error('Get consultation history error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  static async sendMessage(
    call: grpc.ServerUnaryCall<SendMessageRequest, any>,
    callback: grpc.sendUnaryData<any>
  ): Promise<void> {
    try {
      const { consultationId, senderId, content, type } = call.request;

      // Verify consultation exists and user is participant
      const consultation = await db.getConnection()
        .table('consultations')
        .get(consultationId)
        .run()
        .catch(() => null);

      if (!consultation || !consultation.participants.includes(senderId)) {
        return callback({
          code: grpc.status.PERMISSION_DENIED,
          message: 'Not authorized to send messages in this consultation'
        });
      }

      const messageId = uuidv4();
      const message = {
        id: messageId,
        consultation_id: consultationId,
        sender_id: senderId,
        content,
        type: type.toUpperCase(),
        timestamp: new Date()
      };

      await db.getConnection()
        .table('messages')
        .insert(message)
        .run();

      callback(null, {
        success: true,
        messageId
      });

    } catch (error) {
      logger.error('Send message error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  static getMessages(
    call: grpc.ServerWritableStream<any, any>
  ): void {
    const consultationId = call.request.consultationId;
    const userId = call.request.userId;

    // Verify user is participant
    db.getConnection()
      .table('consultations')
      .get(consultationId)
      .run()
      .then((consultation: any) => {
        if (!consultation || !consultation.participants.includes(userId)) {
          call.emit('error', {
            code: grpc.status.PERMISSION_DENIED,
            message: 'Not authorized to view messages in this consultation'
          });
          return;
        }

        // Stream messages
        db.getConnection()
          .table('messages')
          .filter({ consultation_id: consultationId })
          .orderBy('timestamp')
          .changes()
          .run()
          .then((cursor: any) => {
            cursor.each((err: any, message: any) => {
              if (err) {
                call.emit('error', err);
                return;
              }

              // Get sender info
              db.getConnection()
                .table('users')
                .get(message.new_val.sender_id)
                .pluck('first_name', 'last_name')
                .run()
                .then((sender: any) => {
                  const messageResponse = {
                    messageId: message.new_val.id,
                    senderId: message.new_val.sender_id,
                    senderName: `${sender.first_name} ${sender.last_name}`,
                    content: message.new_val.content,
                    type: message.new_val.type,
                    timestamp: message.new_val.timestamp
                  };

                  call.write(messageResponse);
                })
                .catch((error: any) => {
                  logger.error('Error getting sender info:', error);
                });
            });
          })
          .catch((error: any) => {
            call.emit('error', error);
          });
      })
      .catch((error: any) => {
        call.emit('error', error);
      });
  }
}