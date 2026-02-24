'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { FileText, Upload, Trash2, Loader2 } from 'lucide-react';
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
import { Textarea } from "@/components/ui/textarea"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const prescriptionSchema = z.object({
  doctorName: z.string().min(3, { message: "Doctor name is required." }),
  date: z.string().min(1, { message: 'Date is required.'}),
  details: z.string().min(10, { message: "Please provide prescription details." }),
});

type Prescription = z.infer<typeof prescriptionSchema> & { id: string };

export default function PrescriptionsPage() {
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

  const prescriptionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `userProfiles/${user.uid}/prescriptions`), orderBy('date', 'desc'));
  }, [user, firestore]);

  const { data: prescriptions, isLoading: arePrescriptionsLoading } = useCollection<Prescription>(prescriptionsQuery);

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      doctorName: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      details: '',
    }
  });

  const handleAddPrescription = async (values: z.infer<typeof prescriptionSchema>) => {
    if (!user || !firestore) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, `userProfiles/${user.uid}/prescriptions`), {
        ...values,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Prescription Added',
        description: `Prescription from ${values.doctorName} saved.`,
      });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to upload prescription." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeletePrescription = async (id: string) => {
    if (!user || !firestore) return;
    try {
      await deleteDoc(doc(firestore, `userProfiles/${user.uid}/prescriptions`, id));
      toast({ title: 'Removed', variant: 'destructive' });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete." });
    }
  }

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12">
        <Skeleton className="h-10 w-1/2 mb-2" /><Skeleton className="h-6 w-3/4 mb-12" />
        <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
          <FileText /> My Prescriptions
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">View and manage prescriptions.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your Prescriptions</CardTitle>
                 <CardDescription>
                  {prescriptions && prescriptions.length > 0 ? `You have ${prescriptions.length} uploaded.` : 'No prescriptions uploaded.'}
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><Upload className="mr-2 h-4 w-4" /> Upload New</Button>
              </DialogTrigger>
              <DialogContent>
                 <DialogHeader>
                  <DialogTitle>Add Prescription</DialogTitle>
                  <DialogDescription>Enter details below.</DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddPrescription)} className="space-y-4">
                     <FormField control={form.control} name="doctorName" render={({ field }) => (
                          <FormItem><FormLabel>Doctor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      <FormField control={form.control} name="date" render={({ field }) => (
                          <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                       <FormField control={form.control} name="details" render={({ field }) => (
                          <FormItem><FormLabel>Details</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
          {arePrescriptionsLoading ? (
            <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>
          ) : !prescriptions || prescriptions.length === 0 ? (
             <div className='text-center text-muted-foreground py-12'><p>Prescriptions will appear here.</p></div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map(p => (
                <Card key={p.id} className="bg-muted/30">
                  <CardHeader className="flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Dr. {p.doctorName}</CardTitle>
                      <CardDescription>Date: {format(new Date(p.date), 'PPP')}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePrescription(p.id)}>
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent><p className="whitespace-pre-wrap">{p.details}</p></CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
