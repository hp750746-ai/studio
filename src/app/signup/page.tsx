import Link from 'next/link';
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

export const metadata = {
  title: 'Sign Up | HealthLinke',
  description: 'Create your HealthLinke account.',
};

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center py-12 min-h-[calc(100vh-8rem)]">
        <Card className="mx-auto max-w-sm">
            <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Sign Up</CardTitle>
            <CardDescription>
                Enter your information to create an account
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="full-name">Full name</Label>
                    <Input id="full-name" placeholder="Max Robinson" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                </div>
                <Button type="submit" className="w-full" asChild>
                    <Link href="/dashboard">Create an account</Link>
                </Button>
            </div>
            <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                Login
                </Link>
            </div>
            </CardContent>
        </Card>
    </div>
  );
}
