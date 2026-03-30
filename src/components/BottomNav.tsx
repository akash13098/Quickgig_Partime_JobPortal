import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Home, MessageSquare, Search, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function BottomNav() {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) return null;

  const items = currentUser.role === 'employer'
    ? [
        { label: 'Dashboard', to: '/employer/dashboard', icon: Home },
        { label: 'Post', to: '/employer/post-job', icon: Briefcase },
        { label: 'Applicants', to: '/employer/applicants', icon: User },
        { label: 'Chat', to: '/chat', icon: MessageSquare },
        { label: 'Profile', to: '/profile', icon: User },
      ]
    : [
        { label: 'Home', to: '/dashboard', icon: Home },
        { label: 'Jobs', to: '/jobs', icon: Search },
        { label: 'Applied', to: '/applications', icon: Briefcase },
        { label: 'Chat', to: '/chat', icon: MessageSquare },
        { label: 'Profile', to: '/profile', icon: User },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t">
      <div className="flex items-center justify-around h-16">
        {items.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
