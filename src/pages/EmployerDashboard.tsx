import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Navigate, Link } from 'react-router-dom';
import { Briefcase, Users, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function EmployerDashboard() {
  const { currentUser, jobs, getApplicationsForJob } = useApp();

  if (!currentUser || currentUser.role !== 'employer') return <Navigate to="/login" />;

  const myJobs = jobs.filter(j => j.employerId === currentUser.id);
  const totalApps = myJobs.reduce((sum, j) => sum + getApplicationsForJob(j.id).length, 0);
  const activeJobs = myJobs.filter(j => j.status === 'active');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Employer Dashboard</h1>
              <p className="text-muted-foreground">Manage your job postings</p>
            </div>
            <Link to="/employer/post-job">
              <Button className="gradient-primary text-primary-foreground border-0 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Post Job
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Posted', value: myJobs.length, icon: Briefcase },
              { label: 'Active', value: activeJobs.length, icon: TrendingUp },
              { label: 'Applicants', value: totalApps, icon: Users },
            ].map(s => (
              <div key={s.label} className="bg-card border rounded-xl p-4 text-center">
                <s.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-foreground mb-4">Your Job Posts</h2>
          {myJobs.length === 0 ? (
            <div className="text-center py-12 bg-card border rounded-xl">
              <p className="text-muted-foreground mb-3">No jobs posted yet</p>
              <Link to="/employer/post-job"><Button className="gradient-primary text-primary-foreground border-0">Post Your First Job</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myJobs.map((job, i) => {
                const apps = getApplicationsForJob(job.id);
                return (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-card border rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>₹{job.pay}/{job.payType}</span>
                        <span>{job.location}</span>
                        <Badge variant="secondary" className="text-xs">{job.shift}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{apps.length}</div>
                        <div className="text-xs text-muted-foreground">applicants</div>
                      </div>
                      <Link to="/employer/applicants">
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
