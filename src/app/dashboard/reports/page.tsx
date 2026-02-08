'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Beaker, Upload, Trash2 } from 'lucide-react';
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
import { format } from 'date-fns';

const reportSchema = z.object({
  testName: z.string().min(3, { message: "Test name is required." }),
  labName: z.string().min(3, { message: "Lab name is required." }),
  date: z.string().min(1, { message: 'Date is required.'}),
});

type TestReport = z.infer<typeof reportSchema> & { id: string };

export default function ReportsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [reports, setReports] = useState<TestReport[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      testName: '',
      labName: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  const handleAddReport = (values: z.infer<typeof reportSchema>) => {
    const newReport: TestReport = {
      id: new Date().toISOString(),
      ...values,
    };
    setReports(prev => [...prev, newReport]);
    toast({
      title: 'Report Added',
      description: `Your ${values.testName} report has been saved.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(p => p.id !== id));
    toast({
      title: 'Report Removed',
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
          <Beaker /> Test Reports
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Access and manage your lab test reports.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your Reports</CardTitle>
                <CardDescription>
                   {reports.length > 0 ? `You have ${reports.length} report(s).` : 'You have no reports uploaded yet.'}
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                 <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                 <DialogHeader>
                  <DialogTitle>Add Test Report</DialogTitle>
                  <DialogDescription>
                    Enter the details from your test report.
                  </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddReport)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="testName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Test Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Complete Blood Count" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="labName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lab Name</FormLabel>
                            <FormControl><Input placeholder="e.g., City Diagnostics" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Report</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <DialogFooter>
                      <Button type="submit">Save Report</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className='text-center text-muted-foreground py-12'>
                <p>Your uploaded test reports will appear here.</p>
            </div>
          ) : (
             <ul className="divide-y">
              {reports.map(report => (
                <li key={report.id} className="flex justify-between items-center py-4">
                  <div>
                      <p className="font-semibold">{report.testName}</p>
                      <p className="text-sm text-muted-foreground">{report.labName} - {format(new Date(report.date), 'PPP')}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteReport(report.id)}>
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
