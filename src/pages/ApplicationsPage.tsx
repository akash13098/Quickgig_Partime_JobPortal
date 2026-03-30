import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Navigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApplicationsPage() {
  const { currentUser, getApplicationsForUser, getJobById, getUserById } = useApp();

  if (!currentUser) return <Navigate to="/login" />;

  const apps = getApplicationsForUser(currentUser.id);
  const statusConfig = {
    applied: { label: 'Applied', icon: Clock, color: 'text-warning', bg: 'bg-warning/10', step: 1 },
    accepted: { label: 'Accepted', icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/10', step: 2 },
    rejected: { label: 'Rejected', icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', step: 0 },
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Applications</h1>

        {apps.length === 0 ? (
          <div className="text-center py-16 bg-card border rounded-xl">
            <p className="text-muted-foreground mb-2">No applications yet</p>
            <Link to="/jobs" className="text-primary text-sm hover:underline flex items-center justify-center gap-1">
              Browse Jobs <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app, i) => {
              const job = getJobById(app.jobId);
              const employer = job ? getUserById(job.employerId) : undefined;
              const config = statusConfig[app.status];
              if (!job) return null;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Link to={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </Link>
                    <Badge className={`${config.bg} ${config.color} border-0 flex items-center gap-1`}>
                      <config.icon className="w-3 h-3" />
                      {config.label}
                    </Badge>
                  </div>

                  {/* Progress Stepper */}
                  {app.status !== 'rejected' && (
                    <div className="flex items-center gap-2 mb-3">
                      {['Applied', 'Reviewed', 'Accepted'].map((step, si) => (
                        <div key={step} className="flex items-center gap-2 flex-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            si <= config.step ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            {si + 1}
                          </div>
                          <span className={`text-xs ${si <= config.step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{step}</span>
                          {si < 2 && <div className={`flex-1 h-0.5 ${si < config.step ? 'bg-primary' : 'bg-muted'}`} />}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                    {employer && <span>by {employer.name}</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
