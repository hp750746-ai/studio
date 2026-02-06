import { Stethoscope, Search } from 'lucide-react';
import { doctors } from '@/lib/data';
import DoctorCard from '@/components/app/doctor-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const metadata = {
  title: 'Consult Doctors Online | HealthLinke',
  description: 'Find and book appointments with verified doctors. Chat, audio, and video consultations available.',
};

const specialties = [...new Set(doctors.map(d => d.specialty))];

export default function DoctorsPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <Stethoscope className="mx-auto h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold font-headline mt-4 text-primary">
          Find Your Doctor
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Consult with top doctors online through chat, audio, or video calls.
        </p>
      </div>

      <div className="mb-8 p-4 bg-card rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search by doctor name or specialty" className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button className="w-full md:w-auto">Search</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
