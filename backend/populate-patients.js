const r = require('./services/rethinkdb');

const samplePatients = [
  {
    patientId: "1",
    userId: "patient_1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0101",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    emergencyContact: {
      name: "Jane Smith",
      phone: "+1-555-0102",
      relationship: "Spouse"
    },
    medicalHistory: [
      "Hypertension - diagnosed 2020",
      "Type 2 Diabetes - diagnosed 2018"
    ],
    allergies: ["Penicillin", "Peanuts"],
    allergySeverity: {
      "Penicillin": "severe",
      "Peanuts": "moderate"
    },
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Sarah Johnson",
        startDate: "2020-03-15",
        nextDose: "8:00 AM",
        remaining: 15
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        prescribedBy: "Dr. Sarah Johnson",
        startDate: "2018-07-20",
        nextDose: "6:00 PM",
        remaining: 30
      }
    ],
    healthMetrics: {
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 98.6,
      weight: 165,
      height: 70,
      bmi: 23.7,
      lastUpdated: new Date().toISOString()
    },
    healthScore: 85,
    insuranceInfo: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS-123456",
      groupNumber: "GRP-789"
    },
    bloodType: "A+",
    chronicConditions: ["Hypertension", "Diabetes Type 2"],
    appointmentHistory: [
      {
        id: "1",
        doctor: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        date: "2024-10-15",
        diagnosis: "Hypertension - Well Controlled",
        notes: "Blood pressure improved significantly. Continue current medication regimen.",
        followUp: "3 months",
        notification: "Your follow-up appointment is due in 2 weeks. Please schedule at your earliest convenience."
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    patientId: "2",
    userId: "patient_2",
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    phone: "+1-555-0201",
    dateOfBirth: "1990-03-22",
    gender: "Female",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA"
    },
    emergencyContact: {
      name: "Michael Johnson",
      phone: "+1-555-0202",
      relationship: "Father"
    },
    medicalHistory: [
      "Asthma - diagnosed 2005",
      "Seasonal allergies"
    ],
    allergies: ["Dust mites", "Pollen"],
    allergySeverity: {
      "Dust mites": "moderate",
      "Pollen": "mild"
    },
    medications: [
      {
        name: "Albuterol Inhaler",
        dosage: "90mcg",
        frequency: "As needed",
        prescribedBy: "Dr. Michael Chen",
        startDate: "2005-08-10",
        nextDose: "As needed",
        remaining: 1
      }
    ],
    healthMetrics: {
      heartRate: 68,
      bloodPressure: "115/75",
      temperature: 98.4,
      weight: 145,
      height: 65,
      bmi: 24.1,
      lastUpdated: new Date().toISOString()
    },
    healthScore: 90,
    insuranceInfo: {
      provider: "Aetna",
      policyNumber: "AET-654321",
      groupNumber: "GRP-456"
    },
    bloodType: "O+",
    chronicConditions: ["Asthma"],
    appointmentHistory: [
      {
        id: "2",
        doctor: "Dr. Michael Chen",
        specialty: "General Practice",
        date: "2024-09-28",
        diagnosis: "Annual Physical - All Clear",
        notes: "Excellent overall health. Recommended lifestyle maintained.",
        followUp: "1 year",
        notification: "Time for your annual flu shot. Schedule your vaccination appointment."
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    patientId: "3",
    userId: "patient_3",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1-555-0301",
    dateOfBirth: "1978-11-08",
    gender: "Male",
    address: {
      street: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA"
    },
    emergencyContact: {
      name: "Sarah Brown",
      phone: "+1-555-0302",
      relationship: "Spouse"
    },
    medicalHistory: [
      "High cholesterol - diagnosed 2019",
      "Back pain - chronic"
    ],
    allergies: [],
    allergySeverity: {},
    medications: [
      {
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Emily Davis",
        startDate: "2019-04-12",
        nextDose: "9:00 PM",
        remaining: 20
      }
    ],
    healthMetrics: {
      heartRate: 75,
      bloodPressure: "125/82",
      temperature: 98.7,
      weight: 185,
      height: 72,
      bmi: 25.1,
      lastUpdated: new Date().toISOString()
    },
    healthScore: 78,
    insuranceInfo: {
      provider: "United Healthcare",
      policyNumber: "UHC-987654",
      groupNumber: "GRP-321"
    },
    bloodType: "B+",
    chronicConditions: ["High Cholesterol"],
    appointmentHistory: [
      {
        id: "3",
        doctor: "Dr. Emily Davis",
        specialty: "Dermatology",
        date: "2024-09-10",
        diagnosis: "Minor Skin Condition - Resolved",
        notes: "Treatment successful. No recurrence noted.",
        followUp: "As needed",
        notification: "Your prescription refill is ready for pickup at your preferred pharmacy."
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function populatePatients() {
  try {
    console.log('Creating patients table...');
    
    // Check if table exists
    const tables = await r.tableList().run();
    
    if (!tables.includes('patients')) {
      await r.tableCreate('patients').run();
      console.log('✓ Patients table created');
    } else {
      console.log('✓ Patients table already exists');
    }
    
    // Clear existing data
    await r.table('patients').delete().run();
    console.log('✓ Cleared existing patient data');
    
    // Insert sample patients
    const result = await r.table('patients').insert(samplePatients).run();
    console.log(`✓ Inserted ${result.inserted} patients`);
    
    // Verify
    const patients = await r.table('patients').run();
    console.log(`✓ Total patients in database: ${patients.length}`);
    
    console.log('\nSample patient data:');
    console.log(JSON.stringify(patients[0], null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error populating patients:', err);
    process.exit(1);
  }
}

populatePatients();
