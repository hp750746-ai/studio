'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Users, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const memberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  relationship: z.string().min(2, { message: "Relationship is required." }),
  age: z.coerce.number().min(0, { message: "Age must be a positive number." }),
});

type FamilyMember = z.infer<typeof memberSchema> & { id: string };

export default function FamilyPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const familyQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `userProfiles/${user.uid}/familyMembers`);
  }, [user, firestore]);

  const { data: members, isLoading: areMembersLoading } = useCollection<FamilyMember>(familyQuery);

  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      relationship: '',
      age: 0,
    }
  });

  const handleAddMember = async (values: z.infer<typeof memberSchema>) => {
    if (!user || !firestore) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, `userProfiles/${user.uid}/familyMembers`), {
        ...values,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Member Added',
        description: `${values.name} has been added to your family members.`,
      });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add family member.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!user || !firestore) return;
    try {
      await deleteDoc(doc(firestore, `userProfiles/${user.uid}/familyMembers`, id));
      toast({
        title: 'Member Removed',
        variant: 'destructive'
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove member.",
      });
    }
  }

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12">
        <Skeleton className="h-10 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-12" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
          <CardContent><Skeleton className="h-24 w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
          <Users /> Family Members
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage health profiles for your family members.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your Family Members</CardTitle>
                <CardDescription>
                  {members && members.length > 0 ? `You have ${members.length} family member(s).` : 'You have not added any family members yet.'}
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Family Member</DialogTitle>
                  <DialogDescription>
                    Enter the details of your new family member. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddMember)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="relationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl><Input placeholder="e.g., Spouse, Child" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 34" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Member
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            {areMembersLoading ? (
                <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
            ) : !members || members.length === 0 ? (
                <div className='text-center text-muted-foreground py-12'>
                    <p>Added family members will appear here.</p>
                </div>
            ) : (
                <ul className="divide-y">
                    {members.map(member => (
                        <li key={member.id} className="flex justify-between items-center py-4">
                            <div>
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.relationship}, {member.age} years old</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
