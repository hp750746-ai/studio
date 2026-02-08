'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Pill, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const orderImage = PlaceHolderImages.find(p => p.id === 'order-online');


export default function OrderMedicinesPage() {
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
        router.push('/login');
        }
    }, [user, isUserLoading, router]);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        toast({
            title: "Order Placed!",
            description: "We have received your order and will process it shortly.",
        });
        (event.target as HTMLFormElement).reset();
    };

    if (isUserLoading || !user) {
        return (
            <div className="container mx-auto py-12">
                <div className="w-full lg:grid lg:grid-cols-2 gap-12">
                    <div className="flex items-center justify-center py-12">
                         <div className="mx-auto grid w-full max-w-lg gap-6">
                            <div className="grid gap-2 text-center">
                                <Skeleton className="h-12 w-12 mx-auto"/>
                                <Skeleton className="h-8 w-48 mx-auto mt-2"/>
                                <Skeleton className="h-4 w-64 mx-auto mt-2"/>
                            </div>
                            <Card>
                                <CardContent className="grid gap-4 pt-6">
                                    <div className="grid gap-2">
                                        <Skeleton className="h-4 w-20"/>
                                        <Skeleton className="h-10 w-full"/>
                                    </div>
                                    <div className="grid gap-2">
                                        <Skeleton className="h-4 w-24"/>
                                        <Skeleton className="h-10 w-full"/>
                                    </div>
                                    <div className="grid gap-2">
                                        <Skeleton className="h-4 w-28"/>
                                        <Skeleton className="h-20 w-full"/>
                                    </div>
                                     <div className="grid gap-2">
                                        <Skeleton className="h-4 w-32"/>
                                        <Skeleton className="h-32 w-full"/>
                                    </div>
                                    <Skeleton className="h-10 w-full"/>
                                </CardContent>
                            </Card>
                         </div>
                    </div>
                    <div className="hidden bg-muted lg:block relative rounded-lg overflow-hidden">
                         <Skeleton className="h-full w-full"/>
                    </div>
                </div>
            </div>
        )
    }

  return (
    <div className="container mx-auto py-12">
        <div className="w-full lg:grid lg:grid-cols-2 gap-12">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-full max-w-lg gap-6">
                <div className="grid gap-2 text-center">
                    <Pill className="h-12 w-12 mx-auto text-primary"/>
                    <h1 className="text-3xl font-bold font-headline text-primary">Order Medicines</h1>
                    <p className="text-balance text-muted-foreground">
                        Fill in your details and upload a prescription to place your order.
                    </p>
                </div>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4 pt-6">
                        <div className="grid gap-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" placeholder="John Doe" required defaultValue={user.displayName || ''} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="+91 12345 67890" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Delivery Address</Label>
                            <Textarea id="address" placeholder="Enter your full address" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="prescription">Upload Prescription</Label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="prescription" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">JPG, PNG, or PDF (MAX. 5MB)</p>
                                    </div>
                                    <Input id="prescription" type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">
                            Place Order
                        </Button>
                        </CardContent>
                    </form>
                </Card>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative rounded-lg overflow-hidden">
                {orderImage && (
                    <Image
                    src={orderImage.imageUrl}
                    alt="Fast and easy medicine delivery"
                    fill
                    className="object-cover dark:brightness-[0.2] dark:grayscale"
                    data-ai-hint={orderImage.imageHint}
                    />
                )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h2 className="text-3xl font-bold font-headline">Fast & Easy Delivery</h2>
                    <p className="mt-2 max-w-md">Get your medicines delivered to your doorstep quickly and safely. We ensure quality and timely service for all your healthcare needs.</p>
                 </div>
            </div>
        </div>
    </div>
  );
}
