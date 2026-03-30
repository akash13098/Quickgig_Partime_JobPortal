import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) {
      navigate(user.role === 'employer' ? '/employer/dashboard' : '/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-1">Log in to your QuickGig account</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 space-y-4">
            {error && <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</div>}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="arjun@demo.com" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="demo123" required className="mt-1" />
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">Log in</Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
            </p>
          </form>

          <div className="mt-4 p-4 bg-muted rounded-xl">
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => { setEmail('arjun@demo.com'); setPassword('demo123'); }} className="text-left p-2 rounded-lg bg-card hover:bg-primary/5 transition-colors">
                <div className="font-medium text-foreground">Seeker</div>
                <div className="text-muted-foreground">arjun@demo.com</div>
              </button>
              <button onClick={() => { setEmail('rajesh@demo.com'); setPassword('demo123'); }} className="text-left p-2 rounded-lg bg-card hover:bg-primary/5 transition-colors">
                <div className="font-medium text-foreground">Employer</div>
                <div className="text-muted-foreground">rajesh@demo.com</div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
