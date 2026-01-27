require('dotenv').config();
const rethinkdbdash = require('rethinkdbdash');

const r = rethinkdbdash({
  host: process.env.RETHINKDB_HOST || 'rethinkdb.transtechologies.com',
  port: parseInt(process.env.RETHINKDB_PORT) || 28015,
  db: process.env.RETHINKDB_DB || 'telehealth_db_db',
  authKey: process.env.RETHINKDB_AUTH_KEY || ''
});

async function insertSampleDoctor() {
  try {
    // Sample Doctor
    const doctor = {
      user_type: 'doctor',
      email: 'dr.johnson@telehealth.com',
      password_hash: '$2b$10$examplehash', // dummy hash
      first_name: 'Sarah',
      last_name: 'Johnson',
      phone: '+1-555-123-4567',
      date_of_birth: '1985-03-15',
      gender: 'female',
      specialty: 'Cardiology',
      license_number: 'MD12345',
      npi_number: 'NPI1234567890',
      medical_school: 'Harvard Medical School',
      graduation_year: 2010,
      years_of_experience: 15,
      bio: 'Board-certified cardiologist with 15 years of experience in preventive cardiology and heart disease management.',
      consultation_fee: 150.00,
      verification_status: 'verified',
      is_active: true,
      email_verified: true,
      consent_to_terms: true,
      consent_to_privacy: true,
      hipaa_consent: true,
      languages_spoken: ['English', 'Spanish'],
      board_certifications: [
        'American Board of Internal Medicine',
        'American Board of Cardiovascular Disease'
      ],
      average_rating: 4.8,
      total_reviews: 156,
      total_consultations: 500,
      is_accepting_patients: true,
      availability_schedule: {
        monday: [{ start: '09:00', end: '17:00' }],
        tuesday: [{ start: '09:00', end: '17:00' }],
        wednesday: [{ start: '09:00', end: '17:00' }],
        thursday: [{ start: '09:00', end: '17:00' }],
        friday: [{ start: '09:00', end: '12:00' }],
        saturday: [],
        sunday: []
      },
      created_at: r.now(),
      updated_at: r.now()
    };

    const result = await r.table('users').insert(doctor).run();
    console.log('✅ Sample doctor inserted successfully!', result.generated_keys);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

insertSampleDoctor();