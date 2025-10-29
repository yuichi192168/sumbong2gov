
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/app/logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Login
    </Button>
  );
}

export default function AdminLoginPage() {
  const initialState = { message: '' };
  const [state, dispatch] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Logo className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Enter your password to access the management area.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              
              {state?.message && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}

              <LoginButton />
            </form>
          </CardContent>
          <CardFooter>
            <Button variant="link" size="sm" className="w-full text-muted-foreground" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
