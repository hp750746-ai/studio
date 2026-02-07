import type { Doctor, Medicine, LabTest, WellnessArticle } from './types';

export const doctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Ramesh Sharma',
    specialty: 'Cardiologist',
    experience: 15,
    fees: 800,
    rating: 4.8,
    consultationTypes: ['video', 'chat'],
    image: 'doctor-1',
  },
  {
    id: 'doc2',
    name: 'Dr. Priya Gupta',
    specialty: 'Dermatologist',
    experience: 8,
    fees: 600,
    rating: 4.9,
    consultationTypes: ['video', 'audio', 'chat'],
    image: 'doctor-2',
  },
  {
    id: 'doc3',
    name: 'Dr. Ankit Verma',
    specialty: 'General Physician',
    experience: 20,
    fees: 500,
    rating: 4.7,
    consultationTypes: ['audio', 'chat'],
    image: 'doctor-3',
  },
  {
    id: 'doc4',
    name: 'Dr. Sneha Desai',
    specialty: 'Pediatrician',
    experience: 12,
    fees: 700,
    rating: 4.9,
    consultationTypes: ['video', 'chat'],
    image: 'doctor-4',
  },
  {
    id: 'doc5',
    name: 'Dr. Alisha Khan',
    specialty: 'Gynecologist',
    experience: 10,
    fees: 750,
    rating: 4.8,
    consultationTypes: ['video', 'audio', 'chat'],
    image: 'doctor-5',
  },
];

export const medicines: Medicine[] = [
  {
    id: 'med1',
    name: 'Paracetamol 500mg',
    price: 30,
    discount: 10,
    category: 'Tablets',
    image: 'medicine-1',
    requiresPrescription: false,
    tags: ['top', 'fever']
  },
  {
    id: 'med2',
    name: 'Cough Syrup ABC',
    price: 120,
    category: 'Syrup',
    image: 'medicine-2',
    requiresPrescription: false,
    tags: ['top', 'cough']
  },
  {
    id: 'med3',
    name: 'Vitamin B12 Inj.',
    price: 250,
    discount: 15,
    category: 'Injection',
    image: 'medicine-3',
    requiresPrescription: true,
    tags: ['vitamin']
  },
  {
    id: 'med4',
    name: 'Ashwagandha Tablets',
    price: 350,
    category: 'Ayurvedic',
    image: 'medicine-4',
    requiresPrescription: false,
    tags: ['top', 'wellness']
  },
  {
    id: 'med5',
    name: 'Baby Diapers (M)',
    price: 499,
    discount: 20,
    category: 'Baby Care',
    image: 'medicine-5',
    requiresPrescription: false,
    tags: ['top']
  },
  {
    id: 'med6',
    name: 'Digital BP Monitor',
    price: 1500,
    category: 'Health Devices',
    image: 'medicine-6',
    requiresPrescription: false,
    tags: ['top', 'diabetes/bp']
  },
    {
    id: 'med7',
    name: 'Cetirizine Tablets',
    price: 50,
    category: 'Tablets',
    image: 'medicine-1',
    requiresPrescription: false,
    tags: ['top', 'allergy']
  },
  {
    id: 'med8',
    name: 'Antacid Syrup',
    price: 90,
    discount: 5,
    category: 'Syrup',
    image: 'medicine-2',
    requiresPrescription: false,
    tags: ['top', 'acidity']
  },
  {
    id: 'med9',
    name: 'Pain Relief Gel',
    price: 150,
    category: 'Topical',
    image: 'medicine-7',
    requiresPrescription: false,
    tags: ['pain relief', 'top']
  },
  {
    id: 'med10',
    name: 'Hand Sanitizer 100ml',
    price: 80,
    discount: 10,
    category: 'Personal Care',
    image: 'medicine-8',
    requiresPrescription: false,
    tags: ['top', 'hygiene']
  },
  {
    id: 'med11',
    name: 'Sunscreen Lotion SPF 50',
    price: 450,
    category: 'Personal Care',
    image: 'medicine-9',
    requiresPrescription: false,
    tags: ['skin care', 'top']
  },
  {
    id: 'med12',
    name: 'Amoxicillin 500mg',
    price: 150,
    category: 'Tablets',
    image: 'medicine-10',
    requiresPrescription: true,
    tags: ['antibiotic']
  },
  {
    id: 'med13',
    name: 'Insulin Pen',
    price: 800,
    category: 'Injection',
    image: 'medicine-11',
    requiresPrescription: true,
    tags: ['diabetes/bp']
  },
  {
    id: 'med14',
    name: 'Sanitary Pads (Pack of 20)',
    price: 200,
    category: 'Personal Care',
    image: 'medicine-12',
    requiresPrescription: false,
    tags: ['hygiene', 'top']
  },
  {
    id: 'med15',
    name: 'Multivitamin Tablets (30 count)',
    price: 400,
    discount: 10,
    category: 'Tablets',
    image: 'medicine-13',
    requiresPrescription: false,
    tags: ['wellness', 'top']
  },
  {
    id: 'med16',
    name: 'A/B Otic',
    price: 250,
    category: 'Topical',
    image: 'medicine-14',
    requiresPrescription: true,
    tags: ['ear care']
  },
  {
    id: 'med17',
    name: 'Abacavir',
    price: 1200,
    category: 'Tablets',
    image: 'medicine-15',
    requiresPrescription: true,
    tags: ['antiviral']
  },
  {
    id: 'med18',
    name: 'Abacavir Oral Solution',
    price: 1500,
    category: 'Syrup',
    image: 'medicine-16',
    requiresPrescription: true,
    tags: ['antiviral']
  },
  {
    id: 'med19',
    name: 'Abaloparatide',
    price: 3500,
    category: 'Injection',
    image: 'medicine-17',
    requiresPrescription: true,
    tags: ['osteoporosis']
  },
  {
    id: 'med20',
    name: 'Abametapir',
    price: 450,
    category: 'Topical',
    image: 'medicine-18',
    requiresPrescription: true,
    tags: ['lice treatment']
  },
  {
    id: 'med21',
    name: 'Abatuss DMX',
    price: 180,
    category: 'Syrup',
    image: 'medicine-19',
    requiresPrescription: false,
    tags: ['cough', 'cold']
  },
  {
    id: 'med22',
    name: 'Abavite',
    price: 300,
    category: 'Tablets',
    image: 'medicine-20',
    requiresPrescription: false,
    tags: ['vitamin']
  },
  {
    id: 'med23',
    name: 'Abbokinase',
    price: 5000,
    category: 'Injection',
    image: 'medicine-21',
    requiresPrescription: true,
    tags: ['thrombolytic']
  },
  {
    id: 'med24',
    name: 'Abciximab',
    price: 6000,
    category: 'Injection',
    image: 'medicine-22',
    requiresPrescription: true,
    tags: ['antiplatelet']
  },
  {
    id: 'med25',
    name: 'Abemaciclib',
    price: 8000,
    category: 'Tablets',
    image: 'medicine-23',
    requiresPrescription: true,
    tags: ['cancer']
  },
  {
    id: 'med26',
    name: 'Abilify',
    price: 900,
    category: 'Tablets',
    image: 'medicine-24',
    requiresPrescription: true,
    tags: ['antipsychotic']
  },
  {
    id: 'med27',
    name: 'Abiraterone',
    price: 7500,
    category: 'Tablets',
    image: 'medicine-25',
    requiresPrescription: true,
    tags: ['cancer']
  },
  {
    id: 'med28',
    name: 'Ablavar',
    price: 4500,
    category: 'Injection',
    image: 'medicine-26',
    requiresPrescription: true,
    tags: ['diagnostic']
  },
  {
    id: 'med29',
    name: 'Abraxane',
    price: 9500,
    category: 'Injection',
    image: 'medicine-27',
    requiresPrescription: true,
    tags: ['cancer']
  },
  {
    id: 'med30',
    name: 'Abreva',
    price: 220,
    category: 'Topical',
    image: 'medicine-28',
    requiresPrescription: false,
    tags: ['cold sore']
  },
  {
    id: 'med31',
    name: 'Abrocitinib',
    price: 1500,
    category: 'Tablets',
    image: 'medicine-29',
    requiresPrescription: true,
    tags: ['dermatology']
  },
  {
    id: 'med32',
    name: 'Absorbine Athletes Foot',
    price: 150,
    category: 'Topical',
    image: 'medicine-30',
    requiresPrescription: false,
    tags: ['antifungal']
  },
  {
    id: 'med33',
    name: 'Absorica',
    price: 2500,
    category: 'Tablets',
    image: 'medicine-31',
    requiresPrescription: true,
    tags: ['acne']
  },
  {
    id: 'med34',
    name: 'Abstral',
    price: 1800,
    category: 'Tablets',
    image: 'medicine-32',
    requiresPrescription: true,
    tags: ['pain relief']
  },
  {
    id: 'med35',
    name: 'Acarbose 50mg',
    price: 550,
    category: 'Tablets',
    image: 'medicine-33',
    requiresPrescription: true,
    tags: ['diabetes/bp']
  },
  {
    id: 'med36',
    name: 'Acetaminophen 500mg',
    price: 45,
    discount: 10,
    category: 'Tablets',
    image: 'medicine-34',
    requiresPrescription: false,
    tags: ['pain relief', 'fever']
  },
  {
    id: 'med37',
    name: 'Acebutolol Hydrochloride 200mg',
    price: 750,
    category: 'Tablets',
    image: 'medicine-35',
    requiresPrescription: true,
    tags: ['diabetes/bp']
  },
  {
    id: 'med38',
    name: 'Acetylcysteine Effervescent Tablets',
    price: 320,
    category: 'Tablets',
    image: 'medicine-36',
    requiresPrescription: false,
    tags: ['respiratory']
  },
  {
    id: 'med39',
    name: 'Acyclovir Cream 5%',
    price: 280,
    category: 'Topical',
    image: 'medicine-37',
    requiresPrescription: true,
    tags: ['antiviral', 'skin care']
  },
  {
    id: 'med40',
    name: 'Actifed Cold and Allergy',
    price: 150,
    category: 'Tablets',
    image: 'medicine-38',
    requiresPrescription: false,
    tags: ['cold', 'allergy']
  },
  {
    id: 'med41',
    name: 'Acular LS Ophthalmic Solution',
    price: 450,
    category: 'Topical',
    image: 'medicine-39',
    requiresPrescription: true,
    tags: ['eye care']
  },
  {
    id: 'med42',
    name: 'Accupril Tablets',
    price: 900,
    category: 'Tablets',
    image: 'medicine-40',
    requiresPrescription: true,
    tags: ['diabetes/bp']
  },
  {
    id: 'med43',
    name: 'Actos (Pioglitazone)',
    price: 1100,
    category: 'Tablets',
    image: 'medicine-41',
    requiresPrescription: true,
    tags: ['diabetes/bp']
  },
  {
    id: 'med44',
    name: 'Acetaminophen & Ibuprofen Dual Action',
    price: 200,
    category: 'Tablets',
    image: 'medicine-42',
    requiresPrescription: false,
    tags: ['pain relief', 'fever']
  },
  {
    id: 'med45',
    name: 'Aciphex (Rabeprazole)',
    price: 650,
    category: 'Tablets',
    image: 'medicine-43',
    requiresPrescription: true,
    tags: ['acidity']
  },
  {
    id: 'med46',
    name: 'A-Caro-25 (Beta-Carotene)',
    price: 350,
    category: 'Tablets',
    image: 'medicine-44',
    requiresPrescription: false,
    tags: ['vitamin', 'wellness']
  },
  {
    id: 'med47',
    name: 'Acacia Gum Powder',
    price: 450,
    category: 'Personal Care',
    image: 'medicine-45',
    requiresPrescription: false,
    tags: ['wellness', 'fiber']
  },
  {
    id: 'med48',
    name: 'Acalabrutinib 100mg Capsules',
    price: 9500,
    category: 'Tablets',
    image: 'medicine-46',
    requiresPrescription: true,
    tags: ['cancer']
  },
  {
    id: 'med49',
    name: 'Acamprosate Delayed Release Tablets',
    price: 2200,
    category: 'Tablets',
    image: 'medicine-47',
    requiresPrescription: true,
    tags: ['addiction']
  },
  {
    id: 'med50',
    name: 'Acanya Gel (Clindamycin/Benzoyl Peroxide)',
    price: 1300,
    category: 'Topical',
    image: 'medicine-48',
    requiresPrescription: true,
    tags: ['acne', 'skin care']
  }
];

export const labTests: LabTest[] = [
    {
        id: 'test1',
        name: 'Complete Blood Count (CBC)',
        description: 'Measures different components of your blood.',
        price: 300,
        homeCollection: true,
        reportTime: '24 hours',
        image: 'lab-1'
    },
    {
        id: 'test2',
        name: 'Fasting Blood Sugar',
        description: 'Checks your blood sugar levels to screen for diabetes.',
        price: 150,
        homeCollection: true,
        reportTime: '12 hours',
        image: 'lab-1'
    },
    {
        id: 'test3',
        name: 'Full Body Checkup',
        description: 'A comprehensive package covering major health parameters.',
        price: 1200,
        homeCollection: true,
        reportTime: '48 hours',
        image: 'lab-2'
    },
    {
        id: 'test4',
        name: 'Lipid Profile',
        description: 'Measures cholesterol and triglycerides in your blood.',
        price: 400,
        homeCollection: false,
        reportTime: '24 hours',
        image: 'lab-1'
    }
];

export const wellnessArticles: WellnessArticle[] = [
    {
        id: 'well1',
        title: 'Beginner Yoga Poses',
        category: 'Yoga',
        image: 'wellness-1',
        description: 'Start your yoga journey with these simple and effective poses for flexibility and peace.'
    },
    {
        id: 'well2',
        title: 'Healthy Diet for Weight Loss',
        category: 'Diet Plans',
        image: 'wellness-2',
        description: 'A balanced diet plan that helps you lose weight without compromising on nutrition.'
    },
    {
        id: 'well3',
        title: 'Care During Pregnancy',
        category: 'Pregnancy Care',
        image: 'wellness-3',
        description: 'Essential tips and guidance for a healthy and happy pregnancy journey.'
    },
    {
        id: 'well4',
        title: 'Tips for Managing Stress',
        category: 'Mental Health',
        image: 'wellness-4',
        description: 'Learn effective techniques to manage stress and improve your mental well-being.'
    },
    {
        id: 'well5',
        title: 'Guide to Healthy Aging',
        category: 'Old Age Care',
        image: 'wellness-5',
        description: 'Stay active, healthy, and happy in your golden years with our comprehensive guide.'
    }
];

export const healthTips: string[] = [
    "Drink at least 8 glasses of water a day to stay hydrated.",
    "Get at least 30 minutes of moderate exercise most days of the week.",
    "Eat a balanced diet rich in fruits, vegetables, and whole grains.",
    "Aim for 7-9 hours of quality sleep per night.",
    "Practice mindfulness or meditation to reduce stress."
];
