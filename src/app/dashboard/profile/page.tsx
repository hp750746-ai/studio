'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
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
            <div className="mb-12">
                <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3"><UserCircle /> My Profile</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    View and manage your profile information.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className='space-y-2'>
                             <Skeleton className="h-6 w-48" />
                             <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
        <div className="mb-12">
            <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3"><UserCircle /> My Profile</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                View and manage your profile information.
            </p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.photoURL ?? ''} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-semibold">{user.displayName || 'Anonymous User'}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" defaultValue={user.displayName || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email || ''} readOnly disabled />
          </div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
