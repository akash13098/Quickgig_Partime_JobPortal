import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Briefcase, Home, MessageSquare, Search, User, Menu, X, ArrowLeftRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { currentUser, logout, switchRole, getUnreadNotificationCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = currentUser ? getUnreadNotificationCount(currentUser.id) : 0;

  const navItems = currentUser?.role === 'employer'
    ? [
        { label: 'Dashboard', to: '/employer/dashboard', icon: Briefcase },
        { label: 'Post Job', to: '/employer/post-job', icon: Briefcase },
        { label: 'Applicants', to: '/employer/applicants', icon: User },
        { label: 'Chat', to: '/chat', icon: MessageSquare },
      ]
    : [
        { label: 'Find Jobs', to: '/jobs', icon: Search },
        { label: 'Dashboard', to: '/dashboard', icon: Home },
        { label: 'Applications', to: '/applications', icon: Briefcase },
        { label: 'Chat', to: '/chat', icon: MessageSquare },
      ];

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-foreground">Quick<span className="text-primary">Gig</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {currentUser && navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <button
                onClick={switchRole}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                title="Switch role"
              >
                <ArrowLeftRight className="w-3 h-3" />
                {currentUser.role === 'seeker' ? 'Employer' : 'Seeker'}
              </button>

              <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] p-0 border-2 border-background">
                    {unreadCount}
                  </Badge>
                )}
              </Link>

              <Link to="/profile" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-foreground">{currentUser.name.split(' ')[0]}</span>
              </Link>

              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }} className="hidden md:flex text-muted-foreground">
                Logout
              </Button>

              <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-foreground">
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate('/register')} className="gradient-primary text-primary-foreground border-0">
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && currentUser && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t bg-card overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => { switchRole(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground w-full"
              >
                <ArrowLeftRight className="w-4 h-4" />
                Switch to {currentUser.role === 'seeker' ? 'Employer' : 'Seeker'}
              </button>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground">
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button onClick={() => { logout(); navigate('/'); setMobileOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive w-full">
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
