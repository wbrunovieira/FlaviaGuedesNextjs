'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'securepassword';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      router.push('/adm/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gold">
      <Card className="w-full max-w-md p-6 shadow-md">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">
            Admin Login
          </h2>
          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
