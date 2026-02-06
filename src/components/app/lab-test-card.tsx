import Image from 'next/image';
import { Home, Clock } from 'lucide-react';

import type { LabTest } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type LabTestCardProps = {
  test: LabTest;
  className?: string;
};

export default function LabTestCard({ test, className }: LabTestCardProps) {
  const image = PlaceHolderImages.find(img => img.id === test.image);

  return (
    <Card className={cn('flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300', className)}>
      <div className="relative h-48 w-full">
        {image && (
          <Image
            src={image.imageUrl}
            alt={test.name}
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">{test.name}</CardTitle>
        <CardDescription>{test.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Report in {test.reportTime}</span>
          </div>
          {test.homeCollection && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home Collection
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
        <p className="text-xl font-bold text-primary">₹{test.price}</p>
        <Button>Book Now</Button>
      </CardFooter>
    </Card>
  );
}
