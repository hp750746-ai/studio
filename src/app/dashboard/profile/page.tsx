'use client';

import { useUser, initiateProfileUpdate, useAuth } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
});

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    if (user?.displayName) {
      form.setValue('displayName', user.displayName);
    }
  }, [user, isUserLoading, router, form]);

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    setIsSubmitting(true);
    
    const onSuccess = () => {
      toast({ title: "Profile Updated", description: "Your display name has been changed." });
      setIsSubmitting(false);
    };

    const onError = (error: FirebaseError) => {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
      setIsSubmitting(false);
    };

    initiateProfileUpdate(auth, values.displayName, onSuccess, onError);
  };

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
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                 <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your display name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email || ''} readOnly disabled />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Profile
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
