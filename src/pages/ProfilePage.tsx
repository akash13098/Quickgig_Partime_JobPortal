import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { currentUser, updateProfile, switchRole } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', phone: '', location: '', skills: '', availability: '' });
  const [scheduleMonth] = useState(new Date());

  if (!currentUser) return <Navigate to="/login" />;

  const startEdit = () => {
    setForm({
      name: currentUser.name,
      bio: currentUser.bio,
      phone: currentUser.phone,
      location: currentUser.location,
      skills: currentUser.skills.join(', '),
      availability: currentUser.availability.join(', '),
    });
    setEditing(true);
  };

  const saveEdit = () => {
    updateProfile({
      name: form.name,
      bio: form.bio,
      phone: form.phone,
      location: form.location,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      availability: form.availability.split(',').map(s => s.trim()).filter(Boolean),
    });
    setEditing(false);
    toast.success('Profile updated!');
  };

  // Simple calendar
  const daysInMonth = new Date(scheduleMonth.getFullYear(), scheduleMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(scheduleMonth.getFullYear(), scheduleMonth.getMonth(), 1).getDay();
  const confirmedDays = [3, 7, 10, 14, 17, 21, 24, 28]; // mock

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Header */}
          <div className="bg-card border rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground">{currentUser.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="capitalize">{currentUser.role}</Badge>
                  {currentUser.rating > 0 && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-warning fill-warning" /> {currentUser.rating} ({currentUser.totalRatings})
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {currentUser.location || 'Not set'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{currentUser.bio || 'No bio yet'}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {!editing && <Button variant="outline" size="sm" onClick={startEdit}>Edit Profile</Button>}
              <Button variant="outline" size="sm" onClick={switchRole} className="flex items-center gap-1">
                <ArrowLeftRight className="w-3 h-3" />
                Switch to {currentUser.role === 'seeker' ? 'Employer' : 'Seeker'}
              </Button>
            </div>
          </div>

          {/* Edit Form */}
          {editing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border rounded-xl p-6 mb-6 space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1" /></div>
              <div><Label>Bio</Label><Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="mt-1" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="mt-1" /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="mt-1" /></div>
              <div><Label>Skills (comma-separated)</Label><Input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} className="mt-1" /></div>
              <div><Label>Availability (comma-separated)</Label><Input value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))} className="mt-1" /></div>
              <div className="flex gap-2">
                <Button onClick={saveEdit} className="gradient-primary text-primary-foreground border-0">Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </motion.div>
          )}

          {/* Skills & Availability */}
          {currentUser.role === 'seeker' && (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-card border rounded-xl p-5">
                <h2 className="font-semibold text-foreground mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.length > 0 ? currentUser.skills.map(s => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  )) : <p className="text-sm text-muted-foreground">No skills added</p>}
                </div>
              </div>
              <div className="bg-card border rounded-xl p-5">
                <h2 className="font-semibold text-foreground mb-3">Availability</h2>
                <div className="flex flex-wrap gap-2">
                  {currentUser.availability.length > 0 ? currentUser.availability.map(a => (
                    <Badge key={a} className="bg-accent/10 text-accent border-accent/20">{a}</Badge>
                  )) : <p className="text-sm text-muted-foreground">Not set</p>}
                </div>
              </div>
            </div>
          )}

          {/* Shift Scheduler */}
          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Shift Schedule
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              {scheduleMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isConfirmed = confirmedDays.includes(day);
                const isToday = day === new Date().getDate();
                return (
                  <div key={day} className={`py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isConfirmed ? 'gradient-accent text-accent-foreground' : isToday ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                  }`}>
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded gradient-accent" /> Confirmed shifts</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/10" /> Today</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
