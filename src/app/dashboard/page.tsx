'use client';

import { FileText, Beaker, Users, StickyNote, PlusCircle, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


export const metadata = {
  title: 'My Dashboard | HealthLinke',
  description: 'Manage your health records, prescriptions, test reports, and more.',
};

const dashboardItems = [
    { title: 'My Prescriptions', icon: FileText, description: 'View and upload your prescriptions.', href: '/dashboard/prescriptions' },
    { title: 'Test Reports', icon: Beaker, description: 'Access all your lab test reports.', href: '/dashboard/reports' },
    { title: 'Family Members', icon: Users, description: 'Manage health profiles for your family.', href: '/dashboard/family' },
    { title: 'Doctor Notes', icon: StickyNote, description: 'Review notes from your consultations.', href: '/dashboard/notes' },
    { title: 'My Profile', icon: UserCircle, description: 'Update your personal information.', href: '/dashboard/profile' },
    { title: 'Add New Record', icon: PlusCircle, description: 'Upload a new health document.', href: '/order-medicines' },
];

export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
        router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return (
            <div className="container mx-auto py-12">
                <Skeleton className="h-10 w-1/2 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                               <Skeleton className="h-6 w-2/3" />
                               <Skeleton className="h-6 w-6 rounded-sm" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary">
          Welcome to your Dashboard
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Here you can manage all your health-related information in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => {
            const Icon = item.icon;
            return (
                <Link href={item.href} key={item.title}>
                    <Card className="h-full hover:bg-primary/5 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium text-primary">{item.title}</CardTitle>
                            <Icon className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                </Link>
            )
        })}
      </div>
    </div>
  );
}
