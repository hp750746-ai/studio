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
