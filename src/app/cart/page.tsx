'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Medicine } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type CartItem = Medicine & { quantity: number };

export default function CartPage() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  const updateCartInStateAndStorage = (newCart: CartItem[]) => {
    setCartItems(newCart);
    const itemsToStore = newCart.map(({ quantity, ...item }) => item);
    localStorage.setItem('cart', JSON.stringify(itemsToStore));
    window.dispatchEvent(new Event('cart-updated'));
  };

  useEffect(() => {
    setIsClient(true);
    const itemsFromStorage: Medicine[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemsWithQuantity = itemsFromStorage.map((item) => {
        const existingItem = cartItems.find(ci => ci.id === item.id);
        return existingItem ? existingItem : {...item, quantity: 1}
    });
    setCartItems(itemsWithQuantity);

    const handleStorageChange = (e: Event) => {
        const items: Medicine[] = JSON.parse(localStorage.getItem('cart') || '[]');
         const itemsWithQuantity = items.map((item) => ({...item, quantity: 1}));
         setCartItems(itemsWithQuantity);
    }
    window.addEventListener('cart-updated', handleStorageChange);
    return () => window.removeEventListener('cart-updated', handleStorageChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleRemoveItem = (itemId: string) => {
    const newCart = cartItems.filter((item) => item.id !== itemId);
    updateCartInStateAndStorage(newCart);
    toast({
        title: "Item Removed",
        description: "The item has been removed from your cart."
    })
  };
  
  const handleQuantityChange = (itemId: string, amount: number) => {
      const newCart = cartItems.map(item => 
        item.id === itemId 
        ? {...item, quantity: Math.max(1, item.quantity + amount)} 
        : item
      );
      setCartItems(newCart);
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
        const discountedPrice = item.discount ? item.price - (item.price * item.discount) / 100 : item.price;
        return total + (discountedPrice * item.quantity);
    }, 0);
  }

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  if (!isClient) {
      return null;
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <ShoppingCart className="mx-auto h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold font-headline mt-4 text-primary">
          Your Shopping Cart
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Review your items and proceed to checkout.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center bg-card p-12 rounded-lg">
            <p className="text-xl text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild>
                <Link href="/store">Continue Shopping</Link>
            </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                       <ul className="divide-y">
                           {cartItems.map(item => {
                               const image = PlaceHolderImages.find(img => img.id === item.image);
                               const discountedPrice = item.discount ? item.price - (item.price * item.discount) / 100 : item.price;
                               return (
                                <li key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4">
                                    <div className="relative h-24 w-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                        {image && <Image src={image.imageUrl} alt={item.name} fill className="object-contain p-1" />}
                                    </div>
                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">{item.category}</p>
                                        <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-1">
                                            <p className="font-bold text-foreground">₹{discountedPrice.toFixed(2)}</p>
                                            {item.discount && (
                                                <p className="text-sm text-muted-foreground line-through">₹{item.price.toFixed(2)}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 my-2 sm:my-0">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, -1)}>-</Button>
                                        <span className="w-10 text-center">{item.quantity}</span>
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, 1)}>+</Button>
                                    </div>
                                    <div className='flex-shrink-0'>
                                        <p className="font-bold w-20 text-center">₹{(discountedPrice * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                            <Trash2 className="h-5 w-5 text-destructive"/>
                                            <span className="sr-only">Remove item</span>
                                        </Button>
                                    </div>
                                </li>
                               )
                           })}
                       </ul>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 sticky top-24">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total Amount</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => toast({title: "This is a demo and checkout is not implemented."})}>Proceed to Checkout</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
