import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Zap, Users, ArrowLeft, MessageSquare, Share2, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getJobById, getUserById, currentUser, applyToJob, getApplicationsForUser, getOrCreateChat } = useApp();
  const navigate = useNavigate();

  const job = getJobById(id || '');
  const employer = job ? getUserById(job.employerId) : undefined;
  const alreadyApplied = currentUser ? getApplicationsForUser(currentUser.id).some(a => a.jobId === id) : false;

  if (!job) return <Layout><div className="container mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">Job not found</p></div></Layout>;

  const payLabel = job.payType === 'hour' ? '/hr' : job.payType === 'day' ? '/day' : '/shift';

  const handleApply = () => {
    if (!currentUser) { navigate('/login'); return; }
    applyToJob(job.id);
    toast.success('Application submitted!');
  };

  const handleChat = () => {
    if (!currentUser) { navigate('/login'); return; }
    const chat = getOrCreateChat(job.employerId, job.id);
    navigate(`/chat/${chat.id}`);
  };

  const whatsappMsg = encodeURIComponent(`Hi! I'm interested in the "${job.title}" position at ${job.company} listed on QuickGig. I'd like to apply.`);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-card border rounded-xl p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
                <p className="text-muted-foreground mt-1">{job.company}</p>
              </div>
              {job.urgent && (
                <Badge className="bg-urgent/10 text-urgent border-urgent/20 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Urgent
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: IndianRupee, label: 'Pay', value: `₹${job.pay}${payLabel}` },
                { icon: Clock, label: 'Shift', value: `${job.shift} · ${job.shiftTime}` },
                { icon: MapPin, label: 'Location', value: job.location },
                { icon: Users, label: 'Slots', value: `${job.slots} open` },
              ].map(item => (
                <div key={item.label} className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <item.icon className="w-3.5 h-3.5" /> {item.label}
                  </div>
                  <div className="font-semibold text-sm text-foreground">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="font-semibold text-foreground mb-2">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold text-foreground mb-2">Requirements</h2>
              <ul className="space-y-1.5">
                {job.requirements.map(req => (
                  <li key={req} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {req}
                  </li>
                ))}
              </ul>
            </div>

            {employer && (
              <div className="border-t pt-4 mb-6">
                <h2 className="font-semibold text-foreground mb-2">Posted by</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {employer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{employer.name}</p>
                    <p className="text-xs text-muted-foreground">⭐ {employer.rating} ({employer.totalRatings} reviews)</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {currentUser?.role === 'seeker' && (
                <>
                  <Button
                    onClick={handleApply}
                    disabled={alreadyApplied}
                    className="flex-1 gradient-primary text-primary-foreground border-0"
                  >
                    {alreadyApplied ? '✓ Applied' : 'Apply Now'}
                  </Button>
                  <Button variant="outline" onClick={handleChat} className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Chat with Employer
                  </Button>
                </>
              )}
              <a
                href={`https://wa.me/?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="flex items-center gap-2 w-full">
                  <ExternalLink className="w-4 h-4" /> Apply via WhatsApp
                </Button>
              </a>
              <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
