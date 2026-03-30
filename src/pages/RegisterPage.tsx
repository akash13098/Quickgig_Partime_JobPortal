import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', location: '', role: 'seeker' as 'seeker' | 'employer' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = register({ ...form, skills: [], availability: [], bio: '' });
    navigate(user.role === 'employer' ? '/employer/dashboard' : '/dashboard');
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground mt-1">Join QuickGig and start earning</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 space-y-4">
            <div className="flex gap-2">
              {(['seeker', 'employer'] as const).map(r => (
                <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${form.role === r ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {r === 'seeker' ? 'Job Seeker' : 'Employer'}
                </button>
              ))}
            </div>
            <div>
              <Label>Full Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g., Indiranagar, Bangalore" className="mt-1" />
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">Create Account</Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
