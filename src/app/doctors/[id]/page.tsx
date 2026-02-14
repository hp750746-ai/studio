'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { doctors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Phone, MessageSquare, Video, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const consultationIcons = {
  chat: MessageSquare,
  audio: Phone,
  video: Video,
};

// Generate some dummy time slots
const today = new Date();
const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];


export default function DoctorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const doctor = doctors.find(d => d.id === params.id);

    if (!doctor) {
        notFound();
    }
    
    const image = PlaceHolderImages.find(img => img.id === doctor.image);

    const handleBooking = () => {
        if (!selectedDate || !selectedTime) {
            toast({
                variant: 'destructive',
                title: 'Booking Failed',
                description: 'Please select a date and time slot.',
            });
            return;
        }

        toast({
            title: 'Booking Confirmed!',
            description: `Your appointment with ${doctor.name} is booked for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
        });
    }

    return (
        <div className="container mx-auto py-12">
             <div className="mb-8">
                <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Doctors
                </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                <div className="md:col-span-1">
                    <Card className="overflow-hidden sticky top-24">
                        <div className="relative aspect-square w-full">
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
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline text-primary">{doctor.name}</CardTitle>
                            <CardDescription>{doctor.specialty}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span>{doctor.rating}</span>
                                </Badge>
                                <span>|</span>
                                <span>{doctor.experience} years experience</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {doctor.consultationTypes.map((type) => {
                                    const Icon = consultationIcons[type];
                                    return <Icon key={type} className="h-5 w-5 text-accent" title={`Supports ${type} call`} />;
                                })}
                            </div>
                            <div className="flex items-baseline gap-2 pt-2">
                                <p className="text-2xl font-bold text-foreground">INR {doctor.fees}</p>
                                <p className="text-sm text-muted-foreground">per consultation</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarIcon /> Select a Time Slot</CardTitle>
                            <CardDescription>Choose an available date and time to book your appointment.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row gap-8">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => date < today || date > new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)}
                                className="rounded-md border self-start"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold mb-4 text-center md:text-left">
                                    Available Slots for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'}) : '...'}
                                </h3>
                                {selectedDate ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {timeSlots.map(time => (
                                            <Button 
                                                key={time} 
                                                variant={selectedTime === time ? "default" : "outline"}
                                                onClick={() => setSelectedTime(time)}
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center">Please select a date first.</p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                             <Button size="lg" className="w-full" onClick={handleBooking} disabled={!selectedDate || !selectedTime}>
                                Book Appointment
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
