'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Shield, Lock, User } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await signUp.email({ name, email, password });
      if (error) setError(error.message);
      else router.push('/dashboard');
    } catch (err) {
      setError('Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await signIn.email({ email, password });
      if (error) setError(error.message ?? 'Failed to sign in');
      else router.push('/dashboard');
    } catch (err) {
      setError('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans text-zinc-200">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            <Shield className="w-8 h-8 text-blue-500" />
            <span>GeoTracker <span className="text-blue-500">Pro</span></span>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-200 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Security Access</CardTitle>
            <CardDescription className="text-zinc-400">Initialize tracking protocols</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-800">
                <TabsTrigger value="signin">Login</TabsTrigger>
                <TabsTrigger value="signup">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email Address</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        className="bg-zinc-800 border-zinc-700 pl-10 focus:ring-blue-500"
                        placeholder="agent@geotracker.pro"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Access Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        className="bg-zinc-800 border-zinc-700 pl-10 focus:ring-blue-500"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-400 text-sm bg-red-950/30 p-2 rounded border border-red-900/50">{error}</p>}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white" disabled={loading}>
                    {loading ? 'Authenticating...' : 'Access Terminal'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      className="bg-zinc-800 border-zinc-700 focus:ring-blue-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      className="bg-zinc-800 border-zinc-700 focus:ring-blue-500"
                      placeholder="agent@geotracker.pro"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Secure Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      className="bg-zinc-800 border-zinc-700 focus:ring-blue-500"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm bg-red-950/30 p-2 rounded border border-red-900/50">{error}</p>}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white" disabled={loading}>
                    {loading ? 'Initializing...' : 'Create Credentials'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
