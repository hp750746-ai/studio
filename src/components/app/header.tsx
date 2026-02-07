'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartPulse,
  User,
  Menu,
  Stethoscope,
  Pill,
  TestTube,
  Bot,
  Sparkles,
  ShoppingCart,
  Upload,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/store', label: 'Medicines', icon: Pill },
  { href: '/order-medicines', label: 'Order', icon: Upload },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/lab-tests', label: 'Lab Tests', icon: TestTube },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { href: '/wellness', label: 'Wellness', icon: Sparkles },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLink = ({
    href,
    label,
    icon: Icon,
    isMobile = false,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    isMobile?: boolean;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => isMobile && setMobileMenuOpen(false)}
        className={cn(
          'flex items-center gap-2 transition-colors duration-200',
          isMobile
            ? 'text-lg font-medium p-4 rounded-md'
            : 'text-sm font-medium',
          isActive
            ? 'text-primary'
            : 'text-foreground/70 hover:text-foreground'
        )}
      >
        <Icon className={cn('h-5 w-5', isMobile && 'h-6 w-6')} />
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline text-primary">
            HealthLinke
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">User Profile</span>
            </Link>
          </Button>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <HeartPulse className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold font-headline text-primary">
                      HealthLinke
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} isMobile />
                  ))}
                  <div className="border-t pt-4 mt-4 flex items-center gap-4">
                     <Button variant="outline" className="w-full" asChild>
                        <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            My Cart
                        </Link>
                     </Button>
                     <Button className="w-full" asChild>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                            <User className="mr-2 h-5 w-5" />
                            Login
                        </Link>
                     </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
