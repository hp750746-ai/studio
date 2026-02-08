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
  LogOut,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { CartItem } from '@/lib/types';
import { useUser, useAuth } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


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
  const [cartCount, setCartCount] = useState(0);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    const updateCartCount = () => {
      const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    updateCartCount();

    window.addEventListener('cart-updated', updateCartCount);

    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    });

    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
       window.removeEventListener('storage', (e) => {
        if (e.key === 'cart') {
            updateCartCount();
        }
      });
    };
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };
  
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
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                 <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 text-xs justify-center p-0 rounded-full">
                   {cartCount}
                 </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          {isUserLoading ? (
            <User className="h-5 w-5 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard"><User className="mr-2 h-4 w-4" />Dashboard</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile"><User className="mr-2 h-4 w-4" />My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
          )}


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
                     <Button variant="outline" className="w-full relative" asChild>
                        <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            My Cart
                            {cartCount > 0 && (
                                <Badge variant="destructive" className="absolute top-1.5 right-1.5 h-4 w-4 justify-center p-0 text-xs rounded-full">{cartCount}</Badge>
                            )}
                        </Link>
                     </Button>
                     {user ? (
                        <Button className="w-full" asChild>
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                <User className="mr-2 h-5 w-5" />
                                Dashboard
                            </Link>
                        </Button>
                     ) : (
                        <Button className="w-full" asChild>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <User className="mr-2 h-5 w-5" />
                                Login
                            </Link>
                        </Button>
                     )}
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
