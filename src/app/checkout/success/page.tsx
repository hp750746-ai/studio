import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Order Successful | HealthLinke',
};

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto py-24 text-center">
        <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
        <h1 className="text-4xl font-bold font-headline mt-6 text-primary">
            Order Placed Successfully!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Thank you for your purchase. Your order is being processed and you will receive a confirmation email shortly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <Button asChild>
                <Link href="/">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </div>
    </div>
  );
}
