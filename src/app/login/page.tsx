'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LockKeyhole, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth, useUser, initiateEmailSignIn, initiateGoogleSignIn } from '@/firebase';
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
import { GoogleIcon } from '@/components/icons/google';


const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const loginImage = PlaceHolderImages.find(p => p.id === 'login-hero');

export default function LoginPage() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);


  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    
    const onSuccess = () => {
      toast({
        title: 'Logged in successfully!',
        description: 'You will be redirected shortly.',
      });
      setIsSubmitting(false);
    };

    const onError = (error: FirebaseError) => {
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/invalid-credential') {
          description = "Invalid email or password. Please check your credentials and try again.";
      }
      toast({
          variant: "destructive",
          title: 'Login Failed',
          description: description,
      });
      setIsSubmitting(false);
    };
    
    initiateEmailSignIn(auth, values.email, values.password, onSuccess, onError);
  };

  const handleGoogleSignIn = () => {
    setIsGoogleSubmitting(true);
    
    const onSuccess = () => {
      toast({
        title: 'Logged in successfully!',
        description: 'You will be redirected shortly.',
      });
      setIsGoogleSubmitting(false);
    };

    const onError = (error: FirebaseError) => {
      toast({
          variant: "destructive",
          title: 'Login Failed',
          description: error.message || "An unexpected error occurred with Google Sign-In.",
      });
      setIsGoogleSubmitting(false);
    };
    
    initiateGoogleSignIn(auth, onSuccess, onError);
  };

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-8rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <LockKeyhole className="h-12 w-12 mx-auto text-primary"/>
            <h1 className="text-3xl font-bold font-headline text-primary">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">Email</Label>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="ml-auto inline-block text-sm underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <FormControl>
                            <Input id="password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting || isGoogleSubmitting} suppressHydrationWarning>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
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
            </CardContent>
          </Card>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {loginImage && (
            <Image
              src={loginImage.imageUrl}
              alt="Login hero image"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              data-ai-hint={loginImage.imageHint}
            />
        )}
      </div>
    </div>
  );
}
