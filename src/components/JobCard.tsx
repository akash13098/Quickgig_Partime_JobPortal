import { Link } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/data/seedData';
import { motion } from 'framer-motion';

interface JobCardProps {
  job: Job;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const payLabel = job.payType === 'hour' ? '/hr' : job.payType === 'day' ? '/day' : '/shift';
  const timeAgo = getTimeAgo(job.postedAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/jobs/${job.id}`}
        className="block bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
          </div>
          {job.urgent && (
            <Badge className="bg-urgent/10 text-urgent border-urgent/20 flex items-center gap-1 shrink-0">
              <Zap className="w-3 h-3" />
              Urgent
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5" />
            <span className="font-semibold text-foreground">₹{job.pay}</span>{payLabel}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {job.shiftTime}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            <Badge variant="secondary" className="text-xs">{job.shift}</Badge>
            <Badge variant="secondary" className="text-xs">{job.category}</Badge>
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
      </Link>
    </motion.div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}
