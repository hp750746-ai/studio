'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { StickyNote, PlusCircle, Trash2 } from 'lucide-react';
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

const noteSchema = z.object({
  doctorName: z.string().min(3, { message: "Doctor name is required." }),
  date: z.string().min(1, { message: 'Date is required.'}),
  note: z.string().min(10, { message: "Note must be at least 10 characters." }),
});

type DoctorNote = z.infer<typeof noteSchema> & { id: string };

export default function NotesPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [notes, setNotes] = useState<DoctorNote[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      doctorName: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      note: '',
    }
  });

  const handleAddNote = (values: z.infer<typeof noteSchema>) => {
    const newNote: DoctorNote = {
      id: new Date().toISOString(),
      ...values,
    };
    setNotes(prev => [...prev, newNote]);
    toast({
      title: 'Note Added',
      description: `A new note from ${values.doctorName} has been saved.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    toast({
      title: 'Note Removed',
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
          <StickyNote /> Doctor Notes
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Review notes from your consultations.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your Doctor Notes</CardTitle>
                <CardDescription>
                  {notes.length > 0 ? `You have ${notes.length} note(s).` : 'You have no notes yet.'}
                </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                 <DialogHeader>
                  <DialogTitle>Add Doctor Note</DialogTitle>
                  <DialogDescription>
                    Enter the details from your consultation.
                  </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddNote)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="doctorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Doctor's Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Dr. Ramesh Sharma" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Consultation</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Note</FormLabel>
                            <FormControl><Textarea rows={5} placeholder="e.g., Patient reported mild chest pain..." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <DialogFooter>
                      <Button type="submit">Save Note</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className='text-center text-muted-foreground py-12'>
              <p>Notes from your doctor consultations will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map(note => (
                <Card key={note.id} className="bg-muted/30">
                  <CardHeader className="flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Dr. {note.doctorName}</CardTitle>
                      <CardDescription>Date: {format(new Date(note.date), 'PPP')}</CardDescription>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)}>
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{note.note}</p>
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
