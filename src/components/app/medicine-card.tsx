'use client';

import Image from 'next/image';

import type { Medicine } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type MedicineCardProps = {
  medicine: Medicine;
  className?: string;
};

export default function MedicineCard({ medicine, className }: MedicineCardProps) {
  const { toast } = useToast();
  const image = PlaceHolderImages.find(img => img.id === medicine.image);
  const discountedPrice = medicine.discount
    ? medicine.price - (medicine.price * medicine.discount) / 100
    : medicine.price;

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart.`,
    });
  };

  return (
    <Card className={cn('flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300', className)}>
      <CardHeader className="p-0 relative">
        <div className="aspect-square w-full relative bg-gray-100">
          {image && (
            <Image
              src={image.imageUrl}
              alt={medicine.name}
              fill
              className="object-contain p-2"
              data-ai-hint="medicine product"
            />
          )}
          {medicine.discount && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              {medicine.discount}% OFF
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow">
        <CardTitle className="text-sm font-medium h-10 leading-tight line-clamp-2">{medicine.name}</CardTitle>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-lg font-bold text-foreground">₹{discountedPrice.toFixed(2)}</p>
          {medicine.discount && (
            <p className="text-sm text-muted-foreground line-through">₹{medicine.price.toFixed(2)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button className="w-full" size="sm" onClick={handleAddToCart}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
