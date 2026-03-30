import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { JobCard } from '@/components/JobCard';
import { Link, Navigate } from 'react-router-dom';
import { Briefcase, Clock, MapPin, Star, Zap, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SeekerDashboard() {
  const { currentUser, jobs, getApplicationsForUser } = useApp();
  const [workNow, setWorkNow] = useState(false);

  if (!currentUser) return <Navigate to="/login" />;

  const myApps = getApplicationsForUser(currentUser.id);
  const activeJobs = jobs.filter(j => j.status === 'active');

  const nearbyJobs = activeJobs.filter(j =>
    j.location.toLowerCase().includes(currentUser.location.split(',')[0].toLowerCase()) || j.city === 'Remote'
  );

  const workNowJobs = workNow
    ? activeJobs.filter(j => {
        const hour = new Date().getHours();
        if (j.shift === 'Morning' && hour < 12) return true;
        if (j.shift === 'Afternoon' && hour >= 10 && hour < 16) return true;
        if (j.shift === 'Evening' && hour >= 14) return true;
        if (j.shift === 'Night') return true;
        if (j.shift === 'Flexible') return true;
        return false;
      })
    : [];

  const displayJobs = workNow ? workNowJobs : (nearbyJobs.length > 0 ? nearbyJobs : activeJobs);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Welcome */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Hi, {currentUser.name.split(' ')[0]}! 👋</h1>
            <p className="text-muted-foreground">Find your next gig today</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Applied', value: myApps.length, icon: Briefcase, color: 'text-primary' },
              { label: 'Accepted', value: myApps.filter(a => a.status === 'accepted').length, icon: Star, color: 'text-accent' },
              { label: 'Pending', value: myApps.filter(a => a.status === 'applied').length, icon: Clock, color: 'text-warning' },
            ].map(s => (
              <div key={s.label} className="bg-card border rounded-xl p-4 text-center">
                <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                <div className="text-xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Work Now Toggle */}
          <div className="flex items-center justify-between mb-6 bg-card border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Zap className={`w-5 h-5 ${workNow ? 'text-urgent' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-medium text-foreground text-sm">Work Now Mode</p>
                <p className="text-xs text-muted-foreground">Show gigs starting within 4 hours</p>
              </div>
            </div>
            <button
              onClick={() => setWorkNow(!workNow)}
              className={`w-12 h-6 rounded-full transition-colors relative ${workNow ? 'bg-urgent' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${workNow ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Jobs */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              {workNow ? <><Zap className="w-4 h-4 text-urgent" /> Work Now</> :
                nearbyJobs.length > 0 ? <><MapPin className="w-4 h-4 text-primary" /> Near You</> :
                'All Jobs'}
            </h2>
            <Link to="/jobs" className="text-sm text-primary flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {displayJobs.slice(0, 6).map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>

          {displayJobs.length === 0 && (
            <div className="text-center py-12 bg-card border rounded-xl">
              <p className="text-muted-foreground">No matching gigs right now</p>
              <Button variant="link" onClick={() => setWorkNow(false)} className="text-primary">Show all jobs</Button>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
