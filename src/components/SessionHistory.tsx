import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { History, Calendar, Brain, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Session {
  id: string;
  personality_used: string;
  started_at: string;
  ended_at: string | null;
  message_count: number;
}

const personalities: Record<string, { name: string; color: string }> = {
  jarvis: { name: 'Jarvis', color: 'bg-blue-500' },
  'calm-guru': { name: 'Calm Guru', color: 'bg-green-500' },
  vegeta: { name: 'Vegeta', color: 'bg-red-500' },
  sage: { name: 'Sage', color: 'bg-purple-500' }
};

export const SessionHistory = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const fetchSessions = async () => {
    if (!user) return;
    
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSessions();
    }
  }, [open, user]);

  const getSessionDuration = (startedAt: string, endedAt: string | null) => {
    const start = new Date(startedAt);
    const end = endedAt ? new Date(endedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '< 1 min';
    if (diffMins < 60) return `${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-300 hover:text-white hover:bg-white/10"
        >
          <History className="h-5 w-5 mr-2" />
          Sessions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden bg-gradient-to-br from-indigo-950/90 to-purple-950/90 border-purple-500/20 text-white backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <History className="h-6 w-6 text-purple-400" />
            Session History
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto pr-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-purple-300">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sessions yet. Start your first conversation!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <div className={`w-3 h-3 rounded-full ${personalities[session.personality_used]?.color || 'bg-gray-500'}`}></div>
                      {personalities[session.personality_used]?.name || session.personality_used}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200">
                      {session.ended_at ? 'Completed' : 'Active'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm text-purple-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(session.started_at), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>{session.message_count} messages</span>
                    </div>
                  </div>
                  <Separator className="my-3 bg-white/10" />
                  <div className="flex justify-between items-center text-xs text-purple-400">
                    <span>{format(new Date(session.started_at), 'h:mm a')}</span>
                    <span>Duration: {getSessionDuration(session.started_at, session.ended_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};