const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const r = require('rethinkdb');
const path = require('path');

// Load environment variables
require('dotenv').config();

const PROTO_PATH = path.join(__dirname, 'home.proto');

// Load proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const homeProto = grpc.loadPackageDefinition(packageDefinition).home;

// RethinkDB connection config
const DB_CONFIG = {
  host: process.env.RETHINKDB_HOST || '207.180.247.153',
  port: parseInt(process.env.RETHINKDB_PORT) || 28015,
  db: process.env.RETHINKDB_DB || 'telehealth_db_db',
  authKey: process.env.RETHINKDB_AUTH_KEY || ''
};

let dbConn = null;

// Connect to RethinkDB
async function connectDB() {
  if (dbConn && dbConn.open) {
    return dbConn;
  }
  
  try {
    dbConn = await r.connect(DB_CONFIG);
    console.log('✅ Connected to RethinkDB for home stats');
    return dbConn;
  } catch (error) {
    console.error('❌ Failed to connect to RethinkDB:', error);
    throw error;
  }
}

/**
 * Get platform-wide statistics for homepage
 * Calculates real-time metrics from database tables
 */
async function GetHomeStats(call, callback) {
  console.log('📊 GetHomeStats called');
  
  try {
    const conn = await connectDB();
    
    // Run parallel queries for better performance
    const [
      servicesCount,
      doctorsCount,
      specialtiesResult,
      appointmentsCount,
      patientsCount,
      servicesWithRatings,
      completedAppointments
    ] = await Promise.all([
      // Total services
      r.table('services').count().run(conn),
      
      // Total doctors
      r.table('users').filter({ role: 'doctor' }).count().run(conn),
      
      // Total specialties (distinct count)
      r.table('users')
        .filter({ role: 'doctor' })
        .pluck('specialty')
        .distinct()
        .count()
        .run(conn),
      
      // Total appointments
      r.table('appointments').count().run(conn),
      
      // Total patients
      r.table('users').filter({ role: 'patient' }).count().run(conn),
      
      // Services with ratings for average calculation
      r.table('services')
        .filter(r.row.hasFields('rating'))
        .pluck('rating', 'bookingCount')
        .coerceTo('array')
        .run(conn),
      
      // Completed appointments for satisfaction calculation
      r.table('appointments')
        .filter({ status: 'completed' })
        .count()
        .run(conn)
    ]);
    
    // Calculate average rating (weighted by booking count)
    let avgRating = 4.8; // Default
    if (servicesWithRatings && servicesWithRatings.length > 0) {
      const totalWeightedRating = servicesWithRatings.reduce(
        (sum, svc) => {
          const rating = typeof svc.rating === 'number' && !isNaN(svc.rating) ? svc.rating : 0;
          const bookingCount = typeof svc.bookingCount === 'number' && !isNaN(svc.bookingCount) ? svc.bookingCount : 1;
          return sum + (rating * bookingCount);
        },
        0
      );
      const totalBookings = servicesWithRatings.reduce(
        (sum, svc) => {
          const bookingCount = typeof svc.bookingCount === 'number' && !isNaN(svc.bookingCount) ? svc.bookingCount : 1;
          return sum + bookingCount;
        },
        0
      );
      avgRating = totalBookings > 0 ? totalWeightedRating / totalBookings : 4.8;
      // Ensure avgRating is a valid number
      if (typeof avgRating !== 'number' || isNaN(avgRating)) {
        avgRating = 4.8;
      }
    }
    
    // Calculate satisfaction rate
    // Algorithm: (completed appointments / total appointments) * 100
    // Add boost for high-rated services
    let satisfactionRate = 85.0; // Default baseline
    if (appointmentsCount > 0) {
      const baseRate = (completedAppointments / appointmentsCount) * 100;
      // Boost satisfaction if average rating is high
      const ratingBoost = avgRating >= 4.5 ? (avgRating - 4.0) * 10 : 0;
      satisfactionRate = Math.min(99, baseRate + ratingBoost);
    }
    
    // Calculate average wait time (mock intelligent estimation)
    // Based on doctor availability and appointment load
    const doctorsPerAppointment = appointmentsCount > 0 
      ? appointmentsCount / Math.max(doctorsCount, 1) 
      : 0;
    
    // More doctors = less wait time (inverse relationship)
    // Algorithm: base_wait * (appointments_per_doctor / optimal_ratio)^0.5
    const optimalRatio = 50; // Optimal appointments per doctor
    const baseWaitTime = 15; // Minimum wait time in minutes
    const avgWaitTime = doctorsPerAppointment > 0
      ? baseWaitTime * Math.sqrt(Math.max(doctorsPerAppointment / optimalRatio, 0.5))
      : baseWaitTime;
    
    const stats = {
      total_services: servicesCount,
      total_doctors: doctorsCount,
      total_specialties: specialtiesResult,
      avg_rating: parseFloat(avgRating.toFixed(1)),
      satisfaction_rate: parseFloat(satisfactionRate.toFixed(1)),
      total_appointments: appointmentsCount,
      total_patients: patientsCount,
      avg_wait_time_minutes: parseFloat(avgWaitTime.toFixed(1))
    };
    
    console.log('📊 Home stats calculated:', stats);
    callback(null, stats);
    
  } catch (error) {
    console.error('❌ Error in GetHomeStats:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to get home stats: ' + error.message
    });
  }
}

/**
 * Get popular service names for service chips
 * Uses booking count and rating to determine popularity
 */
async function GetPopularServiceNames(call, callback) {
  const limit = call.request.limit || 6;
  console.log(`🔥 GetPopularServiceNames called (limit: ${limit})`);
  
  try {
    const conn = await connectDB();
    
    // Get services ordered by popularity
    // Algorithm: Sort by (bookingCount * 0.7 + rating * 100 * 0.3)
    const cursor = await r.table('services')
      .filter(r.row.hasFields('name', 'bookingCount'))
      .orderBy(
        r.desc(
          r.row('bookingCount').mul(0.7).add(
            r.row('rating').default(4.5).mul(100).mul(0.3)
          )
        )
      )
      .limit(limit)
      .pluck('name')
      .run(conn);
    
    const services = await cursor.toArray();
    const serviceNames = services.map(s => s.name);
    
    console.log(`🔥 Popular services: ${serviceNames.join(', ')}`);
    
    callback(null, { service_names: serviceNames });
    
  } catch (error) {
    console.error('❌ Error in GetPopularServiceNames:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to get popular service names: ' + error.message
    });
  }
}

/**
 * Get feature prices based on service categories
 * Maps HomePage features to actual service pricing
 */
async function GetFeaturePrices(call, callback) {
  const countryCode = call.request.country_code || 'US';
  console.log(`💰 GetFeaturePrices called (country: ${countryCode})`);
  
  try {
    const conn = await connectDB();
    
    // Feature mappings to service categories
    const featureMapping = {
      'Video Consultations': { category: 'consultation', isOnline: true },
      'Prescription Refills': { serviceName: 'Prescription Refill' },
      'Mental Health': { category: 'therapy' },
      'Same-Day Visits': { category: 'consultation', urgent: true }
    };
    
    const features = [];
    
    // Get prices for each feature
    for (const [featureName, criteria] of Object.entries(featureMapping)) {
      let query = r.table('services');
      
      // Apply filters based on criteria
      if (criteria.serviceName) {
        query = query.filter({ name: criteria.serviceName });
      } else if (criteria.category) {
        query = query.filter({ category: criteria.category });
        if (criteria.isOnline) {
          query = query.filter({ is_online: true });
        }
      }
      
      // Get services with pricing
      const cursor = await query
        .filter(r.row.hasFields('pricing_by_country'))
        .limit(10)
        .run(conn);
      
      const services = await cursor.toArray();
      
      // Find minimum price for the country
      let minPrice = null;
      let currency = 'USD';
      
      for (const service of services) {
        if (service.pricing_by_country && Array.isArray(service.pricing_by_country)) {
          const pricing = service.pricing_by_country.find(
            p => p.country_code === countryCode
          );
          
          if (pricing && pricing.price) {
            if (minPrice === null || pricing.price < minPrice) {
              minPrice = pricing.price;
              currency = pricing.currency || 'USD';
            }
          }
        }
        
        // Fallback to base price if no country-specific pricing
        if (minPrice === null && service.price) {
          minPrice = service.price;
        }
      }
      
      // Default prices if no data found
      if (minPrice === null) {
        const defaults = {
          'Video Consultations': 34,
          'Prescription Refills': 37,
          'Mental Health': 47,
          'Same-Day Visits': 50
        };
        minPrice = defaults[featureName] || 50;
      }
      
      // Format price string
      const currencySymbols = {
        'USD': '$',
        'GBP': '£',
        'NGN': '₦',
        'ZAR': 'R'
      };
      
      const symbol = currencySymbols[currency] || '$';
      const priceString = `From ${symbol}${Math.round(minPrice)}`;
      
      features.push({
        feature_name: featureName,
        price: priceString,
        min_price: minPrice,
        currency: currency
      });
    }
    
    console.log('💰 Feature prices calculated:', features);
    
    callback(null, { features });
    
  } catch (error) {
    console.error('❌ Error in GetFeaturePrices:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to get feature prices: ' + error.message
    });
  }
}

// Start the gRPC server
async function main() {
  const server = new grpc.Server();
  
  server.addService(homeProto.HomeService.service, {
    GetHomeStats,
    GetPopularServiceNames,
    GetFeaturePrices
  });
  
  const PORT = process.env.HOME_PORT || '50060';
  const HOST = '0.0.0.0';
  
  server.bindAsync(
    `${HOST}:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error('❌ Failed to bind home server:', error);
        return;
      }
      console.log(`🚀 Home gRPC server running on ${HOST}:${port}`);
      server.start();
    }
  );
  
  // Connect to database on startup
  await connectDB();
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down home server...');
  if (dbConn && dbConn.open) {
    await dbConn.close();
  }
  process.exit(0);
});

main().catch(console.error);
