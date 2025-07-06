
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MessageCircle, Send, Settings, Brain, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { Profile } from '@/components/Profile';
import { LogoutConfirmation } from '@/components/LogoutConfirmation';
import { ChatInterface } from '@/components/ChatInterface';
import { SessionSidebar } from '@/components/SessionSidebar';

interface Personality {
  id: string;
  name: string;
  description: string;
  color: string;
}

const personalities: Personality[] = [
  { id: 'jarvis', name: 'Jarvis', description: 'Smart, quick, and practical', color: 'bg-blue-500' },
  { id: 'calm-guru', name: 'Calm Guru', description: 'Peaceful, mindful, and wise', color: 'bg-green-500' },
  { id: 'vegeta', name: 'Vegeta', description: 'Fierce, motivating, and no-nonsense', color: 'bg-red-500' },
  { id: 'sage', name: 'Sage', description: 'Wise, contemplative, and understanding', color: 'bg-purple-500' }
];

const Index = () => {
  const [selectedPersonality, setSelectedPersonality] = useState('jarvis');
  const [message, setMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSessions, setShowSessions] = useState(false);
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth state:', { user: !!user, loading });
    if (!loading && !user) {
      console.log('No user found, redirecting to landing page');
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleStartSession = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          personality_used: selectedPersonality,
          message_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentSessionId(data.id);
      toast({
        title: "Session Started",
        description: `Your mentoring session with ${personalities.find(p => p.id === selectedPersonality)?.name} has begun!`,
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    if (currentSessionId) {
      try {
        await supabase
          .from('sessions')
          .update({ 
            ended_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', currentSessionId);
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
    
    await signOut();
    navigate('/');
  };

  const handleSessionSelect = (sessionId: string, personality: string) => {
    setSelectedPersonality(personality);
    setCurrentSessionId(sessionId);
    setShowSessions(false);
  };

  const handleBackToHome = () => {
    setCurrentSessionId(null);
    setMessage('');
  };

  const handleNewSession = () => {
    setCurrentSessionId(null);
    setShowSessions(false);
    setMessage('');
  };

  const handlePersonalityChange = (personalityId: string) => {
    setSelectedPersonality(personalityId);
    toast({
      title: "Personality Changed",
      description: `Switched to ${personalities.find(p => p.id === personalityId)?.name}`,
    });
  };

  // If we're in a chat session, show the chat interface
  if (currentSessionId) {
    const selectedPersonalityObj = personalities.find(p => p.id === selectedPersonality);
    return (
      <ChatInterface
        sessionId={currentSessionId}
        personality={selectedPersonality}
        personalityName={selectedPersonalityObj?.name || selectedPersonality}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Session Sidebar */}
      {showSessions && (
        <SessionSidebar
          onSessionSelect={handleSessionSelect}
          onClose={() => setShowSessions(false)}
          onNewSession={handleNewSession}
          currentSessionId={currentSessionId}
        />
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center p-6 relative z-10">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-gray-300" />
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Mantrik
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSessions(true)}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <Menu className="h-5 w-5 mr-2" />
            Sessions
          </Button>
          <Profile />
          <LogoutConfirmation onConfirm={handleSignOut} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 relative z-10">
        {/* Central Orb */}
        <div className="relative mb-12">
          <div className="w-48 h-48 rounded-full bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 p-1 animate-pulse shadow-2xl">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-gray-500 to-gray-400 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 transform translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm"></div>
            </div>
          </div>
        </div>

        {/* Chat Input with Presets Button */}
        <div className="relative w-full max-w-2xl">
          {/* Presets Button */}
          <div className="absolute -top-16 left-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="bottom" 
                className="mt-2 bg-gray-800 border-gray-600 backdrop-blur-md"
              >
                {personalities.map((personality) => (
                  <DropdownMenuItem
                    key={personality.id}
                    onClick={() => handlePersonalityChange(personality.id)}
                    className={`cursor-pointer ${
                      selectedPersonality === personality.id 
                        ? 'bg-gray-700' 
                        : ''
                    } text-white hover:bg-gray-700`}
                  >
                    <div className={`w-3 h-3 rounded-full ${personality.color} mr-3`}></div>
                    <div>
                      <div className="font-medium">{personality.name}</div>
                      <div className="text-sm text-gray-300">
                        {personality.description}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Chat Input */}
          <Card className="bg-gray-800/40 border-gray-600 backdrop-blur-md shadow-2xl">
            <div className="flex items-center p-4">
              <Input
                placeholder="How are you feeling?"
                className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleStartSession()}
              />
              <Button
                onClick={handleStartSession}
                className="ml-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        <p className="text-sm mt-6 text-center max-w-md text-gray-300">
          Start a conversation with your AI mentor. Share your thoughts, feelings, or ask for guidance.
        </p>
      </div>
    </div>
  );
};

export default Index;
