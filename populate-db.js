const r = require('rethinkdb');

const doctors = [
  {
    doctorId: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Family Medicine',
    rating: 4.8,
    experience: 12,
    location: { city: 'New York', state: 'NY', country: 'USA' },
    availability: 'Available Today',
    price: 75,
    imageUrl: '/api/placeholder/120/120',
    bio: 'Experienced family medicine physician with over 12 years of practice.',
    languages: ['English', 'Spanish'],
    education: 'MD from NYU School of Medicine',
    certifications: ['Board Certified Family Medicine'],
    isOnline: true
  },
  {
    doctorId: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Internal Medicine',
    rating: 4.9,
    experience: 15,
    location: { city: 'Los Angeles', state: 'CA', country: 'USA' },
    availability: 'Available Tomorrow',
    price: 85,
    imageUrl: '/api/placeholder/120/120',
    bio: 'Specialist in internal medicine with focus on preventive care.',
    languages: ['English', 'Mandarin'],
    education: 'MD from UCLA Medical School',
    certifications: ['Board Certified Internal Medicine'],
    isOnline: false
  },
  {
    doctorId: '3',
    name: 'Dr. Emily Davis',
    specialty: 'Dermatology',
    rating: 4.7,
    experience: 10,
    location: { city: 'Chicago', state: 'IL', country: 'USA' },
    availability: 'Available Today',
    price: 95,
    imageUrl: '/api/placeholder/120/120',
    bio: 'Dermatologist specializing in skin conditions and cosmetic procedures.',
    languages: ['English'],
    education: 'MD from University of Chicago',
    certifications: ['Board Certified Dermatology'],
    isOnline: true
  },
  {
    doctorId: '4',
    name: 'Dr. Lisa Chen',
    specialty: 'Pediatrics',
    rating: 4.9,
    experience: 14,
    location: { city: 'Boston', state: 'MA', country: 'USA' },
    availability: 'Available Today',
    price: 80,
    imageUrl: '/api/placeholder/120/120',
    bio: 'Pediatrician dedicated to children\'s health and development.',
    languages: ['English', 'Mandarin'],
    education: 'MD from Harvard Medical School',
    certifications: ['Board Certified Pediatrics'],
    isOnline: true
  },
  {
    doctorId: '5',
    name: 'Dr. Robert Martinez',
    specialty: 'Cardiology',
    rating: 4.8,
    experience: 18,
    location: { city: 'Miami', state: 'FL', country: 'USA' },
    availability: 'Available Tomorrow',
    price: 120,
    imageUrl: '/api/placeholder/120/120',
    bio: 'Cardiologist with expertise in heart disease prevention and treatment.',
    languages: ['English', 'Spanish'],
    education: 'MD from University of Miami',
    certifications: ['Board Certified Cardiology'],
    isOnline: false
  },
  {
    doctorId: '6',
    name: 'Dr. Jennifer Wong',
    specialty: 'Dermatology',
    rating: 4.7,
    experience: 11,
    location: { city: 'Seattle', state: 'WA', country: 'USA' },
    availability: 'Available Today',
    price: 100,
    imageUrl: '/api/placeholder/120/120',
    bio: 'Dermatologist focusing on medical and cosmetic dermatology.',
    languages: ['English', 'Cantonese'],
    education: 'MD from University of Washington',
    certifications: ['Board Certified Dermatology'],
    isOnline: true
  },
  {
    doctorId: '7',
    name: 'Dr. David Thompson',
    specialty: 'Orthopedics',
    rating: 4.6,
    experience: 16,
    location: { city: 'Denver', state: 'CO', country: 'USA' },
    availability: 'Available in 2 days',
    price: 110,
    imageUrl: '/api/placeholder/120/120',
    bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement.',
    languages: ['English'],
    education: 'MD from University of Colorado',
    certifications: ['Board Certified Orthopedic Surgery'],
    isOnline: false
  },
  {
    doctorId: '8',
    name: 'Dr. Maria Rodriguez',
    specialty: 'Gynecology',
    rating: 4.9,
    experience: 13,
    location: { city: 'Austin', state: 'TX', country: 'USA' },
    availability: 'Available Today',
    price: 95,
    imageUrl: '/api/placeholder/120/120',
    bio: 'Gynecologist providing comprehensive women\'s health care.',
    languages: ['English', 'Spanish'],
    education: 'MD from UT Southwestern',
    certifications: ['Board Certified Gynecology'],
    isOnline: true
  },
  {
    doctorId: '9',
    name: 'Dr. James Wilson',
    specialty: 'Neurology',
    rating: 4.8,
    experience: 17,
    location: { city: 'Portland', state: 'OR', country: 'USA' },
    availability: 'Available Tomorrow',
    price: 130,
    imageUrl: '/api/placeholder/120/120',
    bio: 'Neurologist specializing in neurological disorders and treatments.',
    languages: ['English'],
    education: 'MD from Oregon Health & Science University',
    certifications: ['Board Certified Neurology'],
    isOnline: false
  },
  {
    doctorId: '10',
    name: 'Dr. Sarah Kim',
    specialty: 'Psychiatry',
    rating: 4.7,
    experience: 12,
    location: { city: 'San Diego', state: 'CA', country: 'USA' },
    availability: 'Available Today',
    price: 90,
    imageUrl: '/api/placeholder/120/120',
    bio: 'Psychiatrist helping patients with mental health and wellness.',
    languages: ['English', 'Korean'],
    education: 'MD from UC San Diego',
    certifications: ['Board Certified Psychiatry'],
    isOnline: true
  }
];

async function populateRemoteDatabase() {
  let connection = null;

  try {
    console.log('Connecting to remote RethinkDB...');
    connection = await r.connect({
      host: '207.180.247.153',
      port: 28015,
      db: 'telehealth_db'
    });

    console.log('Checking if doctors table exists...');
    const tables = await r.db('telehealth_db').tableList().run(connection);

    if (!tables.includes('doctors')) {
      console.log('Creating doctors table...');
      await r.db('telehealth_db').tableCreate('doctors').run(connection);
    }

    console.log('Clearing existing doctors...');
    await r.db('telehealth_db').table('doctors').delete().run(connection);

    console.log('Adding doctors...');
    for (const doctor of doctors) {
      await r.db('telehealth_db').table('doctors').insert(doctor).run(connection);
      console.log(`Added: ${doctor.name}`);
    }

    const count = await r.db('telehealth_db').table('doctors').count().run(connection);
    console.log(`\n✅ Database populated! ${count} doctors added.`);

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    if (connection) {
      connection.close();
    }
  }
}

populateRemoteDatabase();