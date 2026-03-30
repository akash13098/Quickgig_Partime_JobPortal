import { useState, useRef, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ChatPage() {
  const { currentUser, getChatsForUser, getMessagesForChat, sendMessage, getUserById, getJobById } = useApp();
  const { chatId } = useParams<{ chatId: string }>();
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const chats = currentUser ? getChatsForUser(currentUser.id) : [];
  const activeChat = chatId ? chats.find(c => c.id === chatId) : undefined;
  const messages = activeChat ? getMessagesForChat(activeChat.id) : [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  if (!currentUser) return <Navigate to="/login" />;

  const handleSend = () => {
    if (!text.trim() || !activeChat) return;
    sendMessage(activeChat.id, text.trim());
    setText('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">Messages</h1>

        <div className="flex gap-4 h-[60vh]">
          {/* Chat list */}
          <div className={`${chatId ? 'hidden md:block' : ''} w-full md:w-80 bg-card border rounded-xl overflow-hidden`}>
            <div className="p-3 border-b">
              <p className="text-sm font-medium text-foreground">Conversations</p>
            </div>
            <div className="overflow-y-auto h-[calc(60vh-48px)]">
              {chats.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">No conversations yet</p>
              ) : (
                chats.map(chat => {
                  const otherId = chat.participants.find(p => p !== currentUser.id) || '';
                  const other = getUserById(otherId);
                  const job = getJobById(chat.jobId);
                  const isActive = chat.id === chatId;
                  return (
                    <Link key={chat.id} to={`/chat/${chat.id}`}
                      className={`block p-3 border-b transition-colors ${isActive ? 'bg-primary/5' : 'hover:bg-muted'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                          {other?.name.charAt(0) || '?'}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-medium text-foreground text-sm truncate">{other?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground truncate">{job?.title || ''} · {chat.lastMessage || 'No messages'}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat window */}
          {activeChat ? (
            <div className="flex-1 bg-card border rounded-xl flex flex-col overflow-hidden">
              <div className="p-3 border-b flex items-center gap-3">
                <Link to="/chat" className="md:hidden"><ArrowLeft className="w-5 h-5 text-muted-foreground" /></Link>
                {(() => {
                  const otherId = activeChat.participants.find(p => p !== currentUser.id) || '';
                  const other = getUserById(otherId);
                  const job = getJobById(activeChat.jobId);
                  return (
                    <div>
                      <p className="font-medium text-foreground text-sm">{other?.name}</p>
                      <p className="text-xs text-muted-foreground">{job?.title}</p>
                    </div>
                  );
                })()}
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => {
                  const isMine = msg.senderId === currentUser.id;
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                        isMine ? 'gradient-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'
                      }`}>
                        {msg.text}
                        <div className={`text-[10px] mt-1 ${isMine ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-3 border-t flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!text.trim()} className="gradient-primary text-primary-foreground border-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className={`${chatId ? '' : 'hidden md:flex'} flex-1 bg-card border rounded-xl items-center justify-center`}>
              <p className="text-muted-foreground text-sm">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
