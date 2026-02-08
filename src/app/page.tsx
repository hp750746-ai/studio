'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Siren,
  Search,
  Stethoscope,
  Pill,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import DoctorCard from '@/components/app/doctor-card';
import MedicineCard from '@/components/app/medicine-card';
import { doctors, medicines, healthTips } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');

export default function Home() {
  const [healthTip, setHealthTip] = useState('');
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setHealthTip(healthTips[Math.floor(Math.random() * healthTips.length)]);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('search');
    toast({
        title: "Search Submitted",
        description: `You searched for: "${query}"`,
    });
};

  return (
    <div className="flex flex-col gap-12 md:gap-16 lg:gap-24 pb-12">
      <section className="relative w-full bg-primary/10">
        <div className="container mx-auto grid lg:grid-cols-2 gap-8 items-center py-12 md:py-24">
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-primary tracking-tight">
              Sehat ka Strong Link <br />- HealthLinke
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl">
              Aapki Sehat Ka Online Doctor. <br/> Medicine + Doctor, Sab Ek Jagah.
            </p>
            <form onSubmit={handleSearch} className="w-full max-w-md flex items-center space-x-2 bg-white p-2 rounded-lg shadow-lg">
              <Input
                type="search"
                name="search"
                placeholder="Search for medicines, doctors, diseases..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button type="submit" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
            </form>
            <div className="flex items-center gap-4 mt-4">
               <Button size="lg" variant="destructive" onClick={() => toast({ title: "Emergency services are not available in this demo."})}>
                  <Siren className="mr-2 h-5 w-5" /> Emergency
                </Button>
              <p className="text-sm text-muted-foreground">
                Nearest Hospital & Call
              </p>
            </div>
          </div>
          <div className="relative h-64 md:h-96 w-full lg:h-[450px] rounded-lg overflow-hidden shadow-2xl">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </div>
      </section>
      
      <section className="container mx-auto">
        <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-primary/30">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-accent rounded-full p-3">
              <Lightbulb className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-primary font-headline">Today’s Health Tip</CardTitle>
              <CardDescription>A small tip to keep you healthy.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isClient && healthTip ? (
              <p className="text-lg text-foreground/90">{healthTip}</p>
            ) : (
              <Skeleton className="h-6 w-3/4" />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Stethoscope className="h-8 w-8" /> Popular Doctors
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/doctors">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {doctors.slice(0, 5).map((doctor, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1 h-full">
                  <DoctorCard doctor={doctor} className="h-full" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      </section>

      <section className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Pill className="h-8 w-8" /> Top Medicines
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/store">
              Shop All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {medicines.filter(m => m.tags.includes('top')).slice(0,8).map((medicine, index) => (
              <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div className="p-1 h-full">
                  <MedicineCard medicine={medicine} className="h-full" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      </section>
    </div>
  );
}
