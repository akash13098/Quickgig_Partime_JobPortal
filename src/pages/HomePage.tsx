import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, Users, MapPin, Clock, Shield, Star, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { JobCard } from '@/components/JobCard';
import { Layout } from '@/components/Layout';

export default function HomePage() {
  const { jobs, currentUser } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?q=${encodeURIComponent(searchQuery)}`);
  };

  const urgentJobs = jobs.filter(j => j.urgent && j.status === 'active').slice(0, 3);
  const recentJobs = jobs.filter(j => j.status === 'active').slice(0, 6);

  const stats = [
    { label: 'Active Gigs', value: `${jobs.filter(j => j.status === 'active').length}0+`, icon: Briefcase },
    { label: 'Cities', value: '50+', icon: MapPin },
    { label: 'Happy Workers', value: '10K+', icon: Users },
    { label: 'Avg. Rating', value: '4.6★', icon: Star },
  ];

  const benefits = [
    {
      title: 'For Job Seekers',
      items: ['Instant apply with one tap', 'Get paid daily or weekly', 'Flexible shifts that fit your schedule', 'Build your rating & reputation'],
      icon: Users,
      gradient: 'gradient-primary',
    },
    {
      title: 'For Employers',
      items: ['Post gigs in under 2 minutes', 'Verified & rated workers', 'Real-time applicant tracking', 'Built-in chat for coordination'],
      icon: Briefcase,
      gradient: 'gradient-accent',
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium">
              🇮🇳 India's Elite Part-Time Network
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Find Your Next{' '}
              <span className="text-gradient">Part-Time Gig</span>
              {' '}Today
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with verified employers. Get flexible shifts. Earn on your schedule. Join thousands of workers and businesses on QuickGig.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by role, skill, or location..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-card border-border text-foreground"
                />
              </div>
              <Button type="submit" size="lg" className="gradient-primary text-primary-foreground border-0 h-12 px-8">
                Search Jobs
              </Button>
            </form>

          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Hiring */}
      {urgentJobs.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-urgent" />
              <h2 className="text-xl font-bold text-foreground">Urgent Hiring</h2>
            </div>
            <Link to="/jobs?urgent=true" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {urgentJobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">Why QuickGig?</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-card border rounded-xl p-6"
            >
              <div className={`w-10 h-10 rounded-lg ${b.gradient} flex items-center justify-center mb-4`}>
                <b.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{b.title}</h3>
              <ul className="space-y-2">
                {b.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Recent Opportunities</h2>
          <Link to="/jobs" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            Browse all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentJobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="gradient-primary rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
            Join thousands of gig workers across India. Create your profile and start applying in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => navigate(currentUser ? '/jobs' : '/register')} className="bg-card text-foreground hover:bg-card/90 border-0">
              {currentUser ? 'Find Gigs' : 'Get Started Free'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate(currentUser ? '/employer/post-job' : '/register')} className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Post a Job
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 QuickGig. India's Elite Part-Time Network.</span>
          <div className="flex gap-6">
            <Link to="/jobs" className="hover:text-foreground transition-colors">Jobs</Link>
            <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </Layout>
  );
}