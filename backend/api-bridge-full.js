// api-bridge-full.js
// Minimal Express server for Telehealth API

const express = require('express');
const rethinkdbdash = require('rethinkdbdash');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const r = rethinkdbdash({
  host: '207.180.247.153',
  port: 28015,
  db: 'telehealth_db_db',
  password: 'Cosinesine900**',
});

console.log('DB Config:', {
  host: '207.180.247.153',
  port: 28015,
  db: 'telehealth_db_db',
  authKey: 'Cosinesine900**'
});

r.db('telehealth_db_db').tableList().run().then(tables => {
  console.log('✅ Connected to RethinkDB at 207.180.247.153');
  console.log('Database connected successfully');
  console.log('Available tables:', tables);
}).catch(err => {
  console.error('❌ Failed to connect to RethinkDB:', err);
  // Don't exit - let the server start anyway
  console.log('Continuing without database connection...');
});

app.get('/api/doctors', async (req, res) => {
  console.log('Received request for /api/doctors');
  try {
    const doctors = await r.table('users').filter({ user_type: 'doctor' }).run();
    console.log('Found doctors:', doctors.length);
    
    // Transform doctor data to match frontend expectations
    const transformedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      name: `${doctor.first_name} ${doctor.last_name}`,
      specialty: doctor.specialty,
      rating: doctor.average_rating || 0,
      reviews: doctor.total_reviews || 0,
      price: doctor.consultation_fee || 0,
      location: doctor.address ? `${doctor.address.city}, ${doctor.address.state}` : '',
      availability: 'Available Today', // TODO: Calculate from availability_schedule
      image: `https://via.placeholder.com/150?text=${doctor.first_name[0]}${doctor.last_name[0]}`,
      isOnline: doctor.is_online || false,
      bio: doctor.bio,
      experience: doctor.years_of_experience,
      languages: doctor.languages_spoken || [],
      education: doctor.medical_school ? [doctor.medical_school] : [],
      certifications: doctor.board_certifications || [],
      services: [], // TODO: Add services
      patientReviews: [] // TODO: Add reviews
    }));
    
    res.json(transformedDoctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/patients', async (req, res) => {
  try {
    const patients = await r.table('users').filter({ user_type: 'patient' }).run();
    res.json({ patients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 8083;
const server = app.listen(PORT, () => {
  console.log(`HTTP API server running on port ${PORT}`);
  console.log(`Doctors API: http://localhost:${PORT}/api/doctors`);
  console.log(`Patients API: http://localhost:${PORT}/api/patients`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
