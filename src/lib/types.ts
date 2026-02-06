export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  fees: number;
  rating: number;
  consultationTypes: ('chat' | 'audio' | 'video')[];
  image: string;
};

export type Medicine = {
  id: string;
  name: string;
  price: number;
  discount?: number;
  category: 'Tablets' | 'Syrup' | 'Injection' | 'Ayurvedic' | 'Baby Care' | 'Health Devices';
  image: string;
  requiresPrescription: boolean;
  tags: string[];
};

export type LabTest = {
  id: string;
  name:string;
  description: string;
  price: number;
  homeCollection: boolean;
  reportTime: string;
  image: string;
}

export type WellnessArticle = {
  id: string;
  title: string;
  category: 'Yoga' | 'Diet Plans' | 'Pregnancy Care' | 'Mental Health' | 'Old Age Care';
  image: string;
  description: string;
};
