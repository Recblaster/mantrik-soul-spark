
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Edit3, Trash2, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Session {
  id: string;
  personality_used: string;
  started_at: string;
  message_count: number;
}

interface ChatSidebarProps {
  onSessionSelect: (sessionId: string, personality: string) => void;
  onNewSession: () => void;
  currentSessionId?: string;
}

const personalities: Record<string, { name: string }> = {
  jarvis: { name: 'Jarvis' },
  'calm-guru': { name: 'Calm Guru' },
  vegeta: { name: 'Vegeta' }
};

export const ChatSidebar = ({ onSessionSelect, onNewSession, currentSessionId }: ChatSidebarProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { user } = useAuth();

  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const getSessionTitle = (session: Session) => {
    const personality = personalities[session.personality_used]?.name || session.personality_used;
    return `${personality} Chat`;
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewSession}
          className="w-full bg-transparent border border-gray-600 hover:bg-gray-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSessionSelect(session.id, session.personality_used)}
            className={`mx-3 mb-1 p-3 rounded-lg cursor-pointer transition-colors group relative ${
              currentSessionId === session.id 
                ? 'bg-gray-700' 
                : 'hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  {getSessionTitle(session)}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(session.started_at), 'MMM d')}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
