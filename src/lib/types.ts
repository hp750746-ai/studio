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
  category: 'Tablets' | 'Syrup' | 'Injection' | 'Ayurvedic' | 'Baby Care' | 'Health Devices' | 'Topical' | 'Personal Care';
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

export type CartItem = Medicine & {
  quantity: number;
};

export type Order = {
    id: string;
    userAccountId: string;
    orderDate: {
        seconds: number;
        nanoseconds: number;
    };
    deliveryAddress: string;
    totalAmount: number;
    status: string;
    itemCount: number;
};

export type OrderItem = {
    id: string;
    orderId: string;
    medicineId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    category: string;
};
