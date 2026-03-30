import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
  const { currentUser, getNotificationsForUser, markNotificationRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return <Navigate to="/login" />;

  const notifs = getNotificationsForUser(currentUser.id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {notifs.some(n => !n.read) && (
            <Button variant="ghost" size="sm" onClick={markAllNotificationsRead} className="text-primary flex items-center gap-1">
              <CheckCheck className="w-4 h-4" /> Mark all read
            </Button>
          )}
        </div>

        {notifs.length === 0 ? (
          <div className="text-center py-16 bg-card border rounded-xl">
            <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifs.map((n, i) => (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => { markNotificationRead(n.id); if (n.link) navigate(n.link); }}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  n.read ? 'bg-card' : 'bg-primary/5 border-primary/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                  <div className="flex-1">
                    <p className={`text-sm ${n.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
