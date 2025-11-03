const r = require('rethinkdb');

const doctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Family Medicine',
    rating: 4.8,
    reviews: 127,
    location: 'New York, NY',
    availability: 'Available Today',
    price: 75,
    image: '/api/placeholder/120/120',
    isOnline: true
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Internal Medicine',
    rating: 4.9,
    reviews: 89,
    location: 'Los Angeles, CA',
    availability: 'Available Tomorrow',
    price: 85,
    image: '/api/placeholder/120/120',
    isOnline: false
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    specialty: 'Dermatology',
    rating: 4.7,
    reviews: 156,
    location: 'Chicago, IL',
    availability: 'Available Today',
    price: 95,
    image: '/api/placeholder/120/120',
    isOnline: true
  },
  {
    id: '4',
    name: 'Dr. Lisa Chen',
    specialty: 'Pediatrics',
    rating: 4.9,
    reviews: 203,
    location: 'Boston, MA',
    availability: 'Available Today',
    price: 80,
    image: '/api/placeholder/120/120',
    isOnline: true
  },
  {
    id: '5',
    name: 'Dr. Robert Martinez',
    specialty: 'Cardiology',
    rating: 4.8,
    reviews: 178,
    location: 'Miami, FL',
    availability: 'Available Tomorrow',
    price: 120,
    image: '/api/placeholder/120/120',
    isOnline: false
  },
  {
    id: '6',
    name: 'Dr. Jennifer Wong',
    specialty: 'Dermatology',
    rating: 4.7,
    reviews: 145,
    location: 'Seattle, WA',
    availability: 'Available Today',
    price: 100,
    image: '/api/placeholder/120/120',
    isOnline: true
  },
  {
    id: '7',
    name: 'Dr. David Thompson',
    specialty: 'Orthopedics',
    rating: 4.6,
    reviews: 167,
    location: 'Denver, CO',
    availability: 'Available in 2 days',
    price: 110,
    image: '/api/placeholder/120/120',
    isOnline: false
  },
  {
    id: '8',
    name: 'Dr. Maria Rodriguez',
    specialty: 'Gynecology',
    rating: 4.9,
    reviews: 189,
    location: 'Austin, TX',
    availability: 'Available Today',
    price: 95,
    image: '/api/placeholder/120/120',
    isOnline: true
  },
  {
    id: '9',
    name: 'Dr. James Wilson',
    specialty: 'Neurology',
    rating: 4.8,
    reviews: 134,
    location: 'Portland, OR',
    availability: 'Available Tomorrow',
    price: 130,
    image: '/api/placeholder/120/120',
    isOnline: false
  },
  {
    id: '10',
    name: 'Dr. Sarah Kim',
    specialty: 'Psychiatry',
    rating: 4.7,
    reviews: 156,
    location: 'San Diego, CA',
    availability: 'Available Today',
    price: 90,
    image: '/api/placeholder/120/120',
    isOnline: true
  }
];

async function setupDatabase() {
  let connection = null;

  try {
    console.log('Connecting to local RethinkDB...');
    connection = await r.connect({ host: 'localhost', port: 28015 });

    console.log('Creating telehealth_db database...');
    await r.dbCreate('telehealth_db').run(connection);

    console.log('Creating doctors table...');
    await r.db('telehealth_db').tableCreate('doctors').run(connection);

    console.log('Adding doctors...');
    for (const doctor of doctors) {
      await r.db('telehealth_db').table('doctors').insert(doctor).run(connection);
      console.log(`Added: ${doctor.name}`);
    }

    const count = await r.db('telehealth_db').table('doctors').count().run(connection);
    console.log(`\n✅ Setup complete! ${count} doctors added to local database.`);

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    if (connection) {
      connection.close();
    }
  }
}

setupDatabase();