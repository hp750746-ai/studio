'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Package, User as UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { CartItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser } from '@/firebase';

const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
});

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const itemsFromStorage: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]' );
    if (itemsFromStorage.length === 0) {
      router.push('/cart');
    }
    setCartItems(itemsFromStorage);
  }, [router]);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
    }
  });

  useEffect(() => {
    if(user) {
        form.setValue('name', user.displayName || '');
    }
}, [user, form]);

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
    console.log('Order placed with values:', values);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cart-updated'));
    toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. You will receive a confirmation shortly."
    });
    router.push('/checkout/success');
  };

  if (!isClient || isUserLoading) {
      return null;
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
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter your full delivery address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><CreditCard /> Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className='text-muted-foreground'>This is a demo. Only Cash on Delivery is available.</p>
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
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total Amount</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Place Order</Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
      </Form>
    </div>
  );
}
