import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Shield, Trash2, Users, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const { users, jobs, deleteJob } = useApp();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-8">
          <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <div className="text-2xl font-bold text-foreground">{users.length}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-accent" />
            <div>
              <div className="text-2xl font-bold text-foreground">{jobs.length}</div>
              <div className="text-sm text-muted-foreground">Total Jobs</div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">All Users</h2>
        <div className="bg-card border rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted">
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Rating</th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="p-3 text-foreground font-medium">{u.name}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3"><Badge variant="secondary" className="capitalize">{u.role}</Badge></td>
                    <td className="p-3 text-muted-foreground">{u.rating > 0 ? `⭐ ${u.rating}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">All Jobs</h2>
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="bg-card border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company} · {job.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{job.status}</Badge>
                <Button variant="ghost" size="sm" onClick={() => { deleteJob(job.id); toast.success('Job deleted'); }}
                  className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
