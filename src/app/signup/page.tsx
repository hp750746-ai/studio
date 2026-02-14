'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, UserPlus } from 'lucide-react';
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
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignUp, initiateGoogleSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { GoogleIcon } from '@/components/icons/google';

const signupSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  });

const signupImage = PlaceHolderImages.find(p => p.id === 'signup-hero');

export default function SignupPage() {
    const auth = useAuth();
    const { user } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const onSubmit = (values: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true);

        const onSuccess = () => {
            toast({
                title: 'Account created!',
                description: "We're redirecting you to your dashboard.",
            });
        };

        const onError = (error: FirebaseError) => {
            let description = "An unexpected error occurred. Please try again.";
            if (error.code === 'auth/email-already-in-use') {
                description = "This email is already in use. Please try another one or log in.";
            }
            toast({
                variant: "destructive",
                title: 'Sign-up Failed',
                description: description,
            });
            setIsSubmitting(false);
        };

        initiateEmailSignUp(auth, values.email, values.password, values.fullName, onSuccess, onError);
    };

    const handleGoogleSignIn = () => {
      setIsGoogleSubmitting(true);
      
      const onSuccess = () => {
          toast({
              title: 'Account created!',
              description: "We're redirecting you to your dashboard.",
          });
      };

      const onError = (error: FirebaseError) => {
          toast({
              variant: "destructive",
              title: 'Sign-up Failed',
              description: error.message || "An unexpected error occurred with Google Sign-In.",
          });
          setIsGoogleSubmitting(false);
      };
      
      initiateGoogleSignIn(auth, onSuccess, onError);
  };

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-8rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto w-[350px] lg:w-[400px]">
            <CardHeader className="text-center">
                <UserPlus className="h-12 w-12 mx-auto text-primary"/>
                <CardTitle className="text-3xl font-bold font-headline text-primary">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="full-name">Full name</Label>
                                <FormControl><Input id="full-name" placeholder="Max Robinson" {...field} suppressHydrationWarning /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="email">Email</Label>
                                <FormControl><Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...field}
                                    suppressHydrationWarning
                                /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="password">Password</Label>
                                <FormControl><Input id="password" type="password" {...field} suppressHydrationWarning /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting || isGoogleSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create an account
                    </Button>
                </form>
            </Form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                  </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting || isGoogleSubmitting}>
              {isGoogleSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="mr-2 h-5 w-5" />
              )}
              Google
            </Button>
            <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                Login
                </Link>
            </div>
            </CardContent>
        </Card>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {signupImage && (
            <Image
              src={signupImage.imageUrl}
              alt="Person starting a new health journey"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              data-ai-hint={signupImage.imageHint}
            />
        )}
      </div>
    </div>
  );
}

    