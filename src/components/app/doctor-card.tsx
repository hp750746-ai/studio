import Image from 'next/image';
import { Star, Phone, MessageSquare, Video } from 'lucide-react';

import type { Doctor } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type DoctorCardProps = {
  doctor: Doctor;
  className?: string;
};

const consultationIcons = {
  chat: MessageSquare,
  audio: Phone,
  video: Video,
};

export default function DoctorCard({ doctor, className }: DoctorCardProps) {
  const image = PlaceHolderImages.find(img => img.id === doctor.image);

  return (
    <Card className={cn('flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300', className)}>
      <CardHeader className="p-0 relative">
        <div className="aspect-square w-full relative">
          {image && (
            <Image
              src={image.imageUrl}
              alt={`Photo of ${doctor.name}`}
              fill
              className="object-cover"
              data-ai-hint="doctor portrait"
            />
          )}
        </div>
        <Badge className="absolute top-2 right-2 flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
          <span>{doctor.rating}</span>
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-lg font-headline text-primary">{doctor.name}</CardTitle>
        <CardDescription>{doctor.specialty}</CardDescription>
        <p className="text-sm text-muted-foreground mt-2">{doctor.experience} years of experience</p>
        <div className="flex items-center gap-2 mt-4">
          <p className="text-lg font-bold text-foreground">₹{doctor.fees}</p>
          <p className="text-sm text-muted-foreground">per consultation</p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {doctor.consultationTypes.map((type) => {
            const Icon = consultationIcons[type];
            return <Icon key={type} className="h-5 w-5 text-accent" title={`Supports ${type} call`} />;
          })}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="secondary">Book Now</Button>
      </CardFooter>
    </Card>
  );
}
