'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/firebase';
import { initiatePasswordReset } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    const onSuccess = () => {
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox for instructions to reset your password.',
      });
      setIsSuccess(true);
      setIsSubmitting(false);
    };

    const onError = (error: FirebaseError) => {
      toast({
        variant: "destructive",
        title: 'Error',
        description: 'Failed to send password reset email. Please check the email and try again.',
      });
      setIsSubmitting(false);
    };

    initiatePasswordReset(auth, values.email, onSuccess, onError);
  };

  return (
    <div className="flex items-center justify-center py-12 min-h-[calc(100vh-8rem)] bg-muted/30">
      <div className="mx-auto grid w-full max-w-md gap-6 px-4">
        <div className="grid gap-2 text-center">
            <Mail className="h-12 w-12 mx-auto text-primary"/>
            <h1 className="text-3xl font-bold font-headline text-primary">Forgot Password</h1>
            <p className="text-balance text-muted-foreground">
              {isSuccess ? 'Check your email for a reset link.' : 'No problem! Enter your email to get a reset link.'}
            </p>
        </div>
        <Card>
            <CardContent className="pt-6">
                {isSuccess ? (
                    <div className="text-center">
                        <p className="text-muted-foreground mb-6">An email has been sent to <span className="font-semibold text-primary">{form.getValues('email')}</span> with instructions to reset your password.</p>
                        <Button asChild>
                            <Link href="/login" className='flex items-center gap-2'>
                                <ArrowLeft /> Back to Login
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...field}
                                    suppressHydrationWarning
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Reset Link
                        </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
        {!isSuccess && (
             <div className="text-center text-sm">
                Remember your password?{' '}
                <Link href="/login" className="underline">
                    Login
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}
