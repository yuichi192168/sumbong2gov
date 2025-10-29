
import Link from 'next/link';
import { Logo } from './logo';
import { Button } from '../ui/button';
import { logout } from '@/app/actions';
import { LogOut } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/admin" className="flex items-center gap-2 md:gap-3 text-foreground">
          <Logo className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          <h1 className="text-lg md:text-xl font-bold font-headline">Sumbong2Gov Admin</h1>
        </Link>
        <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Back to Home
            </Link>
            <form action={logout}>
                <Button variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </form>
        </div>
      </div>
    </header>
  );
}
