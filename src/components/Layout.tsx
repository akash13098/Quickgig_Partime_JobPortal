import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useApp } from '@/context/AppContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={currentUser ? 'pb-20 md:pb-0' : ''}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
