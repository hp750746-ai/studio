import Image from 'next/image';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicineCard from '@/components/app/medicine-card';
import { medicines } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Medicine } from '@/lib/types';

export const metadata = {
  title: 'Online Medicine Store | HealthLinke',
  description: 'Buy medicines online from our trusted pharmacy. Tablets, syrups, ayurvedic, and more.',
};

const categories: Medicine['category'][] = ['Tablets', 'Syrup', 'Injection', 'Ayurvedic', 'Baby Care', 'Health Devices', 'Topical', 'Personal Care'];
const prescriptionImage = PlaceHolderImages.find(img => img.id === 'prescription-upload');

export default function StorePage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="mb-12 overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-12">
            <CardHeader className="p-0">
              <CardTitle className="text-3xl font-bold font-headline text-primary">Have a Prescription?</CardTitle>
              <CardDescription className="mt-2 text-lg">
                Upload your prescription and we'll handle the rest. Get your medicines delivered to your doorstep.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-6">
              <Button size="lg" variant="default">
                <Upload className="mr-2 h-5 w-5" />
                Upload Prescription
              </Button>
              <p className="text-sm mt-4 text-muted-foreground">Supports JPG, PNG, and PDF formats.</p>
            </CardContent>
          </div>
          <div className="relative h-64 md:h-full w-full hidden md:block">
            {prescriptionImage && (
              <Image 
                src={prescriptionImage.imageUrl}
                alt={prescriptionImage.description}
                fill
                className="object-cover"
                data-ai-hint={prescriptionImage.imageHint}
              />
            )}
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:flex md:w-auto md:flex-wrap justify-start">
          <TabsTrigger value="all">All Medicines</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {medicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        </TabsContent>
        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {medicines
                .filter((m) => m.category === category)
                .map((medicine) => (
                  <MedicineCard key={medicine.id} medicine={medicine} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
