'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Package, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { Order } from '@/lib/types';

export default function OrdersPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const ordersQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/orders`), orderBy('orderDate', 'desc'));
  }, [user, firestore]);

  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12">
        <Skeleton className="h-10 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-12" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
          <Package /> My Orders
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Track your past and current orders.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Order History</CardTitle>
          <CardDescription>
            {areOrdersLoading
              ? 'Loading your orders...'
              : orders && orders.length > 0
              ? `You have placed ${orders.length} order(s).`
              : 'You have not placed any orders yet.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {areOrdersLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : orders && orders.length > 0 ? (
            <ul className="divide-y">
              {orders.map((order) => (
                <li key={order.id} className="py-4">
                  <Link href={`/dashboard/orders/${order.id}`} className="block hover:bg-muted/50 p-4 rounded-lg transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="flex-grow">
                            <p className="text-sm font-semibold text-primary">Order ID: {order.id}</p>
                            <p className="text-sm text-muted-foreground">
                                Placed on: {order.orderDate ? format(new Date(order.orderDate.seconds * 1000), 'PPP') : 'Date pending...'}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="font-bold text-lg">INR {order.totalAmount.toFixed(2)}</span>
                                <Badge variant={order.status === 'Placed' ? 'default' : 'secondary'}>{order.status}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <span>View Details</span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>You have no past orders.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/store">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
