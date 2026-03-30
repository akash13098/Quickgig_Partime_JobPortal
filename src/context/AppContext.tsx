import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User, Job, Application, Chat, Message, Notification, Rating,
  seedUsers, seedJobs, seedApplications, seedChats, seedMessages, seedNotifications, seedRatings,
} from '@/data/seedData';

interface AppState {
  users: User[];
  jobs: Job[];
  applications: Application[];
  chats: Chat[];
  messages: Message[];
  notifications: Notification[];
  ratings: Rating[];
  currentUser: User | null;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => User | null;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'rating' | 'totalRatings' | 'avatar'>) => User;
  switchRole: () => void;
  addJob: (job: Omit<Job, 'id' | 'postedAt' | 'status'>) => Job;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  applyToJob: (jobId: string, note?: string) => Application;
  updateApplication: (id: string, status: 'accepted' | 'rejected') => void;
  sendMessage: (chatId: string, text: string) => Message;
  getOrCreateChat: (participantId: string, jobId: string) => Chat;
  addNotification: (userId: string, text: string, type: Notification['type'], link?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addRating: (toUserId: string, jobId: string, score: number, comment: string) => void;
  getJobById: (id: string) => Job | undefined;
  getUserById: (id: string) => User | undefined;
  getApplicationsForJob: (jobId: string) => Application[];
  getApplicationsForUser: (userId: string) => Application[];
  getChatsForUser: (userId: string) => Chat[];
  getMessagesForChat: (chatId: string) => Message[];
  getNotificationsForUser: (userId: string) => Notification[];
  getUnreadNotificationCount: (userId: string) => number;
  updateProfile: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadState<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`quickgig_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

function saveState(key: string, value: unknown) {
  localStorage.setItem(`quickgig_${key}`, JSON.stringify(value));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => loadState('users', seedUsers));
  const [jobs, setJobs] = useState<Job[]>(() => loadState('jobs', seedJobs));
  const [applications, setApplications] = useState<Application[]>(() => loadState('applications', seedApplications));
  const [chats, setChats] = useState<Chat[]>(() => loadState('chats', seedChats));
  const [messages, setMessages] = useState<Message[]>(() => loadState('messages', seedMessages));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadState('notifications', seedNotifications));
  const [ratings, setRatings] = useState<Rating[]>(() => loadState('ratings', seedRatings));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState('currentUser', null));

  useEffect(() => { saveState('users', users); }, [users]);
  useEffect(() => { saveState('jobs', jobs); }, [jobs]);
  useEffect(() => { saveState('applications', applications); }, [applications]);
  useEffect(() => { saveState('chats', chats); }, [chats]);
  useEffect(() => { saveState('messages', messages); }, [messages]);
  useEffect(() => { saveState('notifications', notifications); }, [notifications]);
  useEffect(() => { saveState('ratings', ratings); }, [ratings]);
  useEffect(() => { saveState('currentUser', currentUser); }, [currentUser]);

  const login = useCallback((email: string, password: string): User | null => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) setCurrentUser(user);
    return user || null;
  }, [users]);

  const logout = useCallback(() => setCurrentUser(null), []);

  const register = useCallback((data: Omit<User, 'id' | 'rating' | 'totalRatings' | 'avatar'>): User => {
    const user: User = { ...data, id: `user-${Date.now()}`, rating: 0, totalRatings: 0, avatar: '' };
    setUsers(prev => [...prev, user]);
    setCurrentUser(user);
    return user;
  }, []);

  const switchRole = useCallback(() => {
    if (!currentUser) return;
    const newRole = currentUser.role === 'seeker' ? 'employer' : 'seeker';
    const updated = { ...currentUser, role: newRole as 'seeker' | 'employer' };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  }, [currentUser]);

  const addJob = useCallback((data: Omit<Job, 'id' | 'postedAt' | 'status'>): Job => {
    const job: Job = { ...data, id: `job-${Date.now()}`, postedAt: new Date().toISOString(), status: 'active' };
    setJobs(prev => [job, ...prev]);
    return job;
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  }, []);

  const addNotification = useCallback((userId: string, text: string, type: Notification['type'], link?: string) => {
    const notif: Notification = { id: `notif-${Date.now()}-${Math.random()}`, userId, text, read: false, timestamp: new Date().toISOString(), type, link };
    setNotifications(prev => [notif, ...prev]);
  }, []);

  const applyToJob = useCallback((jobId: string, note?: string): Application => {
    if (!currentUser) throw new Error('Must be logged in');
    const app: Application = { id: `app-${Date.now()}`, jobId, seekerId: currentUser.id, status: 'applied', appliedAt: new Date().toISOString(), note };
    setApplications(prev => [...prev, app]);
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      addNotification(job.employerId, `${currentUser.name} applied for "${job.title}"`, 'application', `/employer/applicants`);
    }
    return app;
  }, [currentUser, jobs, addNotification]);

  const updateApplication = useCallback((id: string, status: 'accepted' | 'rejected') => {
    setApplications(prev => prev.map(a => {
      if (a.id !== id) return a;
      const job = jobs.find(j => j.id === a.jobId);
      const jobTitle = job?.title || 'a job';
      addNotification(a.seekerId, `Your application for "${jobTitle}" was ${status}!`, status, '/applications');
      return { ...a, status };
    }));
  }, [jobs, addNotification]);

  const getOrCreateChat = useCallback((participantId: string, jobId: string): Chat => {
    if (!currentUser) throw new Error('Must be logged in');
    const existing = chats.find(c => c.participants.includes(currentUser.id) && c.participants.includes(participantId) && c.jobId === jobId);
    if (existing) return existing;
    const chat: Chat = { id: `chat-${Date.now()}`, participants: [currentUser.id, participantId], jobId };
    setChats(prev => [...prev, chat]);
    return chat;
  }, [currentUser, chats]);

  const sendMessage = useCallback((chatId: string, text: string): Message => {
    if (!currentUser) throw new Error('Must be logged in');
    const msg: Message = { id: `msg-${Date.now()}-${Math.random()}`, chatId, senderId: currentUser.id, text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, msg]);
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, lastMessage: text, lastMessageAt: msg.timestamp } : c));
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      const recipientId = chat.participants.find(p => p !== currentUser.id);
      if (recipientId) addNotification(recipientId, `New message from ${currentUser.name}`, 'message', '/chat');
    }
    return msg;
  }, [currentUser, chats, addNotification]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
  }, [currentUser]);

  const addRating = useCallback((toUserId: string, jobId: string, score: number, comment: string) => {
    if (!currentUser) return;
    const rating: Rating = { id: `rating-${Date.now()}`, fromUserId: currentUser.id, toUserId, jobId, score, comment, createdAt: new Date().toISOString() };
    setRatings(prev => [...prev, rating]);
    setUsers(prev => prev.map(u => {
      if (u.id !== toUserId) return u;
      const newTotal = u.totalRatings + 1;
      const newRating = ((u.rating * u.totalRatings) + score) / newTotal;
      return { ...u, rating: Math.round(newRating * 10) / 10, totalRatings: newTotal };
    }));
  }, [currentUser]);

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  }, [currentUser]);

  const getJobById = useCallback((id: string) => jobs.find(j => j.id === id), [jobs]);
  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);
  const getApplicationsForJob = useCallback((jobId: string) => applications.filter(a => a.jobId === jobId), [applications]);
  const getApplicationsForUser = useCallback((userId: string) => applications.filter(a => a.seekerId === userId), [applications]);
  const getChatsForUser = useCallback((userId: string) => chats.filter(c => c.participants.includes(userId)).sort((a, b) => (b.lastMessageAt || '').localeCompare(a.lastMessageAt || '')), [chats]);
  const getMessagesForChat = useCallback((chatId: string) => messages.filter(m => m.chatId === chatId).sort((a, b) => a.timestamp.localeCompare(b.timestamp)), [messages]);
  const getNotificationsForUser = useCallback((userId: string) => notifications.filter(n => n.userId === userId), [notifications]);
  const getUnreadNotificationCount = useCallback((userId: string) => notifications.filter(n => n.userId === userId && !n.read).length, [notifications]);

  return (
    <AppContext.Provider value={{
      users, jobs, applications, chats, messages, notifications, ratings, currentUser,
      login, logout, register, switchRole, addJob, updateJob, deleteJob,
      applyToJob, updateApplication, sendMessage, getOrCreateChat,
      addNotification, markNotificationRead, markAllNotificationsRead,
      addRating, getJobById, getUserById, getApplicationsForJob, getApplicationsForUser,
      getChatsForUser, getMessagesForChat, getNotificationsForUser, getUnreadNotificationCount,
      updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
