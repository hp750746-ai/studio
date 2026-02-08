'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { FileText, Upload, Trash2 } from 'lucide-react';
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
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      doctorName: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      details: '',
    }
  });

  const handleAddPrescription = (values: z.infer<typeof prescriptionSchema>) => {
    const newPrescription: Prescription = {
      id: new Date().toISOString(),
      ...values,
    };
    setPrescriptions(prev => [...prev, newPrescription]);
    toast({
      title: 'Prescription Added',
      description: `A new prescription from ${values.doctorName} has been saved.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  const handleDeletePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
    toast({
      title: 'Prescription Removed',
      variant: 'destructive'
    });
  }


  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12">
        <Skeleton className="h-10 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-12" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
          <FileText /> My Prescriptions
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          View and manage your uploaded prescriptions.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your Prescriptions</CardTitle>
                 <CardDescription>
                  {prescriptions.length > 0 ? `You have ${prescriptions.length} prescription(s).` : 'You have no prescriptions uploaded yet.'}
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload New
                </Button>
              </DialogTrigger>
              <DialogContent>
                 <DialogHeader>
                  <DialogTitle>Add Prescription</DialogTitle>
                  <DialogDescription>
                    Enter the details from your prescription.
                  </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddPrescription)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="doctorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Doctor's Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Dr. Priya Sharma" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Issue</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prescription Details</FormLabel>
                            <FormControl><Textarea rows={5} placeholder="e.g., Paracetamol 500mg - 1 tablet twice a day" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <DialogFooter>
                      <Button type="submit">Save Prescription</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
          {prescriptions.length === 0 ? (
             <div className='text-center text-muted-foreground py-12'>
                <p>Your uploaded prescriptions will appear here.</p>
            </div>
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
                  <CardContent>
                    <p className="whitespace-pre-wrap">{p.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
