import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, MessageSquare, Star, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ApplicantManagerPage() {
  const { currentUser, jobs, getApplicationsForJob, getUserById, updateApplication, getOrCreateChat } = useApp();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'employer') return <Navigate to="/login" />;

  const myJobs = jobs.filter(j => j.employerId === currentUser.id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">Applicant Manager</h1>

        {myJobs.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-xl">
            <p className="text-muted-foreground">No job postings yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myJobs.map(job => {
              const apps = getApplicationsForJob(job.id);
              return (
                <div key={job.id} className="bg-card border rounded-xl p-5">
                  <h2 className="font-semibold text-foreground mb-1">{job.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{apps.length} applicant{apps.length !== 1 ? 's' : ''}</p>

                  {apps.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No applications yet</p>
                  ) : (
                    <div className="space-y-3">
                      {apps.map((app, i) => {
                        const seeker = getUserById(app.seekerId);
                        if (!seeker) return null;
                        const statusConfig = {
                          applied: { label: 'Pending', color: 'text-warning', bg: 'bg-warning/10' },
                          accepted: { label: 'Accepted', color: 'text-accent', bg: 'bg-accent/10' },
                          rejected: { label: 'Rejected', color: 'text-destructive', bg: 'bg-destructive/10' },
                        };
                        const cfg = statusConfig[app.status];

                        return (
                          <motion.div key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                {seeker.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{seeker.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Star className="w-3 h-3" /> {seeker.rating} · {seeker.skills.slice(0, 2).join(', ')}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${cfg.bg} ${cfg.color} border-0 text-xs`}>{cfg.label}</Badge>
                              {app.status === 'applied' && (
                                <>
                                  <Button size="sm" variant="ghost" onClick={() => { updateApplication(app.id, 'accepted'); toast.success('Accepted!'); }}
                                    className="text-accent hover:text-accent"><CheckCircle className="w-4 h-4" /></Button>
                                  <Button size="sm" variant="ghost" onClick={() => { updateApplication(app.id, 'rejected'); toast.info('Rejected'); }}
                                    className="text-destructive hover:text-destructive"><XCircle className="w-4 h-4" /></Button>
                                </>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => {
                                const chat = getOrCreateChat(seeker.id, job.id);
                                navigate(`/chat/${chat.id}`);
                              }}>
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
