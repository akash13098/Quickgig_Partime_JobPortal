import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function PostJobPage() {
  const { currentUser, addJob } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '', company: '', description: '', pay: '', payType: 'day' as 'hour' | 'day' | 'shift',
    shift: 'Morning' as 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Flexible',
    shiftTime: '', location: '', city: '', category: '', urgent: false, requirements: '', slots: '1',
  });

  if (!currentUser) return <Navigate to="/login" />;

  const steps = ['Job Details', 'Pay & Shift', 'Location', 'Review'];

  const handleSubmit = () => {
    addJob({
      ...form,
      employerId: currentUser.id,
      pay: Number(form.pay),
      slots: Number(form.slots),
      requirements: form.requirements.split('\n').filter(Boolean),
    });
    toast.success('Job posted successfully!');
    navigate('/employer/dashboard');
  };

  const canNext = () => {
    if (step === 0) return form.title && form.company && form.description;
    if (step === 1) return form.pay && form.shiftTime;
    if (step === 2) return form.location && form.city && form.category;
    return true;
  };

  const f = (key: keyof typeof form, val: string | boolean) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">Post a Job</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i <= step ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>{i < step ? <Check className="w-4 h-4" /> : i + 1}</div>
              <span className={`text-xs hidden sm:block ${i <= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border rounded-xl p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div><Label>Job Title</Label><Input value={form.title} onChange={e => f('title', e.target.value)} placeholder="e.g., Event Coordinator" className="mt-1" /></div>
              <div><Label>Company Name</Label><Input value={form.company} onChange={e => f('company', e.target.value)} className="mt-1" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => f('description', e.target.value)} rows={4} className="mt-1" /></div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Pay (₹)</Label><Input type="number" value={form.pay} onChange={e => f('pay', e.target.value)} className="mt-1" /></div>
                <div>
                  <Label>Pay Type</Label>
                  <Select value={form.payType} onValueChange={v => f('payType', v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hour">Per Hour</SelectItem>
                      <SelectItem value="day">Per Day</SelectItem>
                      <SelectItem value="shift">Per Shift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Shift</Label>
                  <Select value={form.shift} onValueChange={v => f('shift', v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Shift Time</Label><Input value={form.shiftTime} onChange={e => f('shiftTime', e.target.value)} placeholder="9 AM - 1 PM" className="mt-1" /></div>
              </div>
              <div><Label>Open Slots</Label><Input type="number" value={form.slots} onChange={e => f('slots', e.target.value)} className="mt-1" /></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.urgent} onChange={e => f('urgent', e.target.checked)} className="rounded" />
                <span className="text-sm text-foreground">Mark as Urgent Hiring</span>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div><Label>Location</Label><Input value={form.location} onChange={e => f('location', e.target.value)} placeholder="e.g., Indiranagar, Bangalore" className="mt-1" /></div>
              <div><Label>City</Label><Input value={form.city} onChange={e => f('city', e.target.value)} placeholder="e.g., Bangalore" className="mt-1" /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={e => f('category', e.target.value)} placeholder="e.g., Events, Delivery" className="mt-1" /></div>
              <div><Label>Requirements (one per line)</Label><Textarea value={form.requirements} onChange={e => f('requirements', e.target.value)} rows={3} className="mt-1" placeholder="Good communication&#10;Punctual" /></div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 text-sm">
              <h3 className="font-bold text-foreground text-lg">{form.title}</h3>
              <p className="text-muted-foreground">{form.company}</p>
              <p className="text-muted-foreground">{form.description}</p>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>💰 ₹{form.pay}/{form.payType}</span>
                <span>🕐 {form.shift} · {form.shiftTime}</span>
                <span>📍 {form.location}</span>
                <span>👥 {form.slots} slots</span>
              </div>
              {form.urgent && <p className="text-urgent font-medium">⚡ Urgent Hiring</p>}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="gradient-primary text-primary-foreground border-0 flex items-center gap-1">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gradient-primary text-primary-foreground border-0 flex items-center gap-1">
                <Check className="w-4 h-4" /> Post Job
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
