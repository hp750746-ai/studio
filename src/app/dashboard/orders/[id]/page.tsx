'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Package, ArrowLeft, Home, Calendar, Hash, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import type { Order, OrderItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function OrderDetailsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const params = useParams();
  const orderId = params.id as string;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const orderRef = useMemoFirebase(() => {
    if (!user || !firestore || !orderId) return null;
    return doc(firestore, `userProfiles/${user.uid}/orders`, orderId);
  }, [user, firestore, orderId]);

  const { data: order, isLoading: isOrderLoading } = useDoc<Order>(orderRef);
  
  const itemsQuery = useMemoFirebase(() => {
    if(!orderRef) return null;
    return collection(firestore, orderRef.path, 'orderItems');
  }, [orderRef]);

  const { data: orderItems, isLoading: areItemsLoading } = useCollection<OrderItem>(itemsQuery);

  if (isUserLoading || isOrderLoading || !user) {
      return (
          <div className="container mx-auto py-12">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                   <Skeleton className="h-48 w-full" />
                   <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-56 w-full" />
                </div>
            </div>
        </div>
      );
  }

  if (!order && !isOrderLoading) {
      return (
          <div className="container mx-auto py-24 text-center">
              <h1 className="text-2xl font-bold">Order not found</h1>
              <p className="text-muted-foreground">The order you are looking for does not exist or you do not have permission to view it.</p>
              <Button asChild variant="link" className="mt-4">
                  <Link href="/dashboard/orders">Back to My Orders</Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="container mx-auto py-12">
        <div className="mb-8">
            <Button variant="ghost" asChild>
                <Link href="/dashboard/orders" className="flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to My Orders
                </Link>
            </Button>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                        {order && <CardDescription>Order ID: {order.id}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                        {areItemsLoading ? (
                             <div className="space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ) : orderItems && orderItems.length > 0 ? (
                           <ul className="divide-y">
                               {orderItems.map(item => {
                                   const image = PlaceHolderImages.find(img => img.id === item.image);
                                   return (
                                     <li key={item.id} className="flex items-center gap-4 py-4">
                                        <div className="relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                            {image && <Image src={image.imageUrl} alt={item.name} fill className="object-contain p-1" />}
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">INR {(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                     </li>
                                   )
                               })}
                           </ul>
                        ) : (
                            <p className="text-muted-foreground">No items found in this order.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            {order && (
                <div className="lg:col-span-1 sticky top-24">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-start gap-3">
                                <Truck className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-semibold">Status</p>
                                    <Badge variant={order.status === 'Placed' ? 'default' : 'secondary'}>{order.status}</Badge>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <Home className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-semibold">Delivery Address</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{order.deliveryAddress}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-semibold">Order Date</p>
                                    <p className="text-sm text-muted-foreground">{order.orderDate ? format(new Date(order.orderDate.seconds * 1000), 'PPp') : 'Date pending...'}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between text-muted-foreground">
                                <div className="flex items-center gap-2"><Hash className="h-4 w-4" /> Items ({order.itemCount})</div>
                                <span>INR {(order.totalAmount - 50).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <div className="flex items-center gap-2"><Truck className="h-4 w-4" /> Delivery</div>
                                <span>INR 50.00</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <div className="flex items-center gap-2">Total</div>
                                <span>INR {order.totalAmount.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    </div>
  )
}
