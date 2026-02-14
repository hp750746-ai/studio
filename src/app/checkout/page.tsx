'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2, Package, User as UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { writeBatch, doc, collection, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { CartItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError, useDoc, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Checkbox } from '@/components/ui/checkbox';

const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  street: z.string().min(5, { message: "Street address must be at least 5 characters." }),
  address2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  pincode: z.string().length(6, { message: "Pincode must be 6 digits." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  saveAddress: z.boolean().default(true).optional(),
});

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  shippingAddress?: {
    name: string;
    street: string;
    address2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }
}

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const qrImage = PlaceHolderImages.find(p => p.id === 'payment-qr');
  const paymentCardsImage = PlaceHolderImages.find(p => p.id === 'payment-cards');

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `userProfiles/${user.uid}`);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    setIsClient(true);
    const itemsFromStorage: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]' );
    if (itemsFromStorage.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Redirecting to store...',
      });
      router.push('/store');
    }
    setCartItems(itemsFromStorage);
  }, [router, toast]);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({
        title: 'Please Login',
        description: 'You need to be logged in to checkout.',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [user, isUserLoading, router, toast]);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      street: '',
      address2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      saveAddress: true,
    }
  });

  useEffect(() => {
    if (userProfile?.shippingAddress) {
      form.reset({ ...form.getValues(), ...userProfile.shippingAddress, saveAddress: true });
    } else if (user?.displayName) {
      form.setValue('name', user.displayName);
    }
  }, [userProfile, user, form]);

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
        const discountedPrice = item.discount ? item.price - (item.price * item.discount) / 100 : item.price;
        return total + (discountedPrice * item.quantity);
    }, 0);
  }

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = (values: z.infer<typeof checkoutSchema>) => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to place an order.",
      });
      return;
    }
     if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "You cannot place an order with an empty cart.",
      });
      return;
    }

    setIsSubmitting(true);

    const batch = writeBatch(firestore);
    const orderRef = doc(collection(firestore, `userProfiles/${user.uid}/orders`));

    cartItems.forEach(item => {
      const discountedPrice = item.discount ? item.price - (item.price * item.discount) / 100 : item.price;
      const orderItemRef = doc(collection(firestore, orderRef.path, 'orderItems'));
      batch.set(orderItemRef, {
        orderId: orderRef.id,
        medicineId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: discountedPrice,
        image: item.image,
        category: item.category,
      });
    });

    const addressParts = [
        values.name,
        values.street,
        values.address2,
        values.landmark,
        `${values.city}, ${values.state} - ${values.pincode}`,
        values.phone
    ];

    const orderData = {
      userAccountId: user.uid,
      orderDate: serverTimestamp(),
      deliveryAddress: addressParts.filter(Boolean).join('\n'),
      totalAmount: total,
      status: 'Placed',
      itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    };

    batch.set(orderRef, orderData);

    if (values.saveAddress) {
        const userRef = doc(firestore, `userProfiles/${user.uid}`);
        const addressData = {
            shippingAddress: {
                name: values.name,
                street: values.street,
                address2: values.address2 || '',
                landmark: values.landmark || '',
                city: values.city,
                state: values.state,
                pincode: values.pincode,
                phone: values.phone,
            }
        };
        batch.set(userRef, addressData, { merge: true });
    }

    batch.commit()
      .then(() => {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
        toast({
            title: "Order Placed Successfully!",
            description: "Thank you for your purchase. You will receive a confirmation shortly."
        });
        router.push('/checkout/success');
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: orderRef.path,
          operation: 'write',
          requestResourceData: orderData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Order Failed",
          description: "There was an error placing your order. Please try again.",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!isClient || isUserLoading || !user || isProfileLoading) {
      return (
        <div className="container mx-auto py-12">
            <div className="text-center mb-12">
                <Skeleton className='h-16 w-16 mx-auto' />
                <Skeleton className="h-10 w-1/2 mt-4 mx-auto" />
                <Skeleton className="h-6 w-3/4 mt-2 mx-auto" />
            </div>
             <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-72 w-full" />
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <Package className="mx-auto h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold font-headline mt-4 text-primary">
          Checkout
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Finalize your order by providing shipping and payment details.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePlaceOrder)} className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className='space-y-8'>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserIcon /> Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <Input placeholder="House no, Street name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="address2"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Address Line 2 (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Apartment, suite, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="landmark"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Landmark (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Near City Hospital" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., Mumbai" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., Maharashtra" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pincode"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pincode</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., 400001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+91 12345 67890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                        control={form.control}
                        name="saveAddress"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-y-0 gap-2 mt-4">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="saveAddress"
                                />
                            </FormControl>
                            <Label htmlFor="saveAddress" className="cursor-pointer">
                                Save this address for future use
                            </Label>
                            </FormItem>
                        )}
                        />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><CreditCard /> Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <Tabs defaultValue="card" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="card">Card</TabsTrigger>
                              <TabsTrigger value="upi">UPI</TabsTrigger>
                              <TabsTrigger value="qr">QR Code</TabsTrigger>
                              <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                          </TabsList>
                          <TabsContent value="card" className="mt-6 space-y-4">
                              <div className="space-y-2">
                                  <Label htmlFor="cardNumber">Card Number</Label>
                                  <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="cardHolder">Card Holder</Label>
                                  <Input id="cardHolder" placeholder="John Doe" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="expiryDate">Expiry Date</Label>
                                      <Input id="expiryDate" placeholder="MM/YY" />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="cvc">CVC</Label>
                                      <Input id="cvc" placeholder="123" />
                                  </div>
                              </div>
                              {paymentCardsImage && <Image src={paymentCardsImage.imageUrl} alt="Credit card providers" width={200} height={40} data-ai-hint={paymentCardsImage.imageHint} />}
                          </TabsContent>
                          <TabsContent value="upi" className="mt-6 space-y-4">
                              <div className="space-y-2">
                                  <Label htmlFor="upiId">UPI ID</Label>
                                  <Input id="upiId" placeholder="yourname@bank" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                  Enter your UPI ID to receive a payment request.
                              </p>
                          </TabsContent>
                          <TabsContent value="qr" className="mt-6 flex flex-col items-center gap-4">
                              {qrImage && <Image src={qrImage.imageUrl} alt="QR Code for payment" width={200} height={200} data-ai-hint={qrImage.imageHint} />}
                              <p className="text-sm text-muted-foreground">Scan this QR code with any UPI app to pay.</p>
                          </TabsContent>
                          <TabsContent value="cod" className="mt-6">
                              <p className='text-muted-foreground'>You can pay in cash to the delivery agent upon receiving your order.</p>
                          </TabsContent>
                      </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="lg:col-span-1 sticky top-24">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>INR {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Delivery Fee</span>
                            <span>INR {deliveryFee.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total Amount</span>
                            <span>INR {total.toFixed(2)}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting || cartItems.length === 0}>
                           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Place Order
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
      </Form>
    </div>
  );
}
