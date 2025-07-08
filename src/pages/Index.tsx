
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Menu, User, History, MessageCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/components/Profile';
import { LogoutConfirmation } from '@/components/LogoutConfirmation';
import { SessionSidebar } from '@/components/SessionSidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { SessionHistory } from '@/components/SessionHistory';
import { supabase } from "@/integrations/supabase/client";

interface Personality {
  id: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
}

const personalities: Personality[] = [
  { 
    id: 'jarvis', 
    name: 'Analytical', 
    description: 'Smart & efficient', 
    color: 'from-blue-400 to-cyan-400',
    emoji: '🤖'
  },
  { 
    id: 'calm-guru', 
    name: 'Peaceful', 
    description: 'Mindful & wise', 
    color: 'from-green-400 to-emerald-400',
    emoji: '🧘'
  },
  { 
    id: 'vegeta', 
    name: 'Motivating', 
    description: 'Fierce & powerful', 
    color: 'from-red-400 to-orange-400',
    emoji: '⚡'
  }
];

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    console.log('Auth state:', { user: !!user, loading });
    if (!loading && !user) {
      console.log('No user found, redirecting to landing page');
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handlePersonalitySelect = async (personalityId: string) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          personality_used: personalityId,
          message_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      
      setSelectedPersonality(personalityId);
      setCurrentSessionId(data.id);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleSessionSelect = (sessionId: string, personality: string) => {
    setCurrentSessionId(sessionId);
    setSelectedPersonality(personality);
    setShowSidebar(false);
  };

  const handleNewSession = () => {
    setSelectedPersonality(null);
    setCurrentSessionId(null);
    setShowSidebar(false);
  };

  const handleBackToSelection = () => {
    setSelectedPersonality(null);
    setCurrentSessionId(null);
  };

  const selectedPersonalityData = personalities.find(p => p.id === selectedPersonality);

  // Chat Interface View
  if (selectedPersonality && currentSessionId && selectedPersonalityData) {
    return (
      <>
        {showSidebar && (
          <SessionSidebar
            onSessionSelect={handleSessionSelect}
            onClose={() => setShowSidebar(false)}
            onNewSession={handleNewSession}
            currentSessionId={currentSessionId}
          />
        )}
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-4 w-4 mr-2" />
                Sessions
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedPersonalityData.color} flex items-center justify-center text-white text-sm`}>
                  {selectedPersonalityData.emoji}
                </div>
                <h1 className="text-xl font-semibold">{selectedPersonalityData.name}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <SessionHistory />
              <Profile />
              <LogoutConfirmation onConfirm={handleSignOut} />
            </div>
          </div>

          <ChatInterface
            sessionId={currentSessionId}
            personality={selectedPersonality}
            personalityName={selectedPersonalityData.name}
            onBack={handleBackToSelection}
          />
        </div>
      </>
    );
  }

  // Main Selection View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold text-gray-900">
            Mantrik AI
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(true)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Sessions
          </Button>
          <SessionHistory />
          <Profile />
          <LogoutConfirmation onConfirm={handleSignOut} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-88px)] px-6 py-12">
        {/* Central Orb */}
        <div className="relative mb-16">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 animate-pulse shadow-2xl flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 animate-ping opacity-20"></div>
        </div>

        {/* Greeting */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            How are you feeling?
          </h1>
          <p className="text-gray-600 text-lg">
            Choose your AI mentor based on your current mood
          </p>
        </div>

        {/* Mood Selection */}
        <div className="flex items-center justify-center space-x-6 mb-12">
          {personalities.map((personality) => (
            <Button
              key={personality.id}
              onClick={() => handlePersonalitySelect(personality.id)}
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${personality.color} hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border-4 border-white text-2xl`}
            >
              {personality.emoji}
            </Button>
          ))}
        </div>

        {/* Personality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {personalities.map((personality) => (
            <Card 
              key={personality.id}
              className="group p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-300"
              onClick={() => handlePersonalitySelect(personality.id)}
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${personality.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}>
                {personality.emoji}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {personality.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {personality.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-4">
            💬 Your conversations are automatically saved
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Personalized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Sidebar */}
      {showSidebar && (
        <SessionSidebar
          onSessionSelect={handleSessionSelect}
          onClose={() => setShowSidebar(false)}
          onNewSession={handleNewSession}
          currentSessionId={currentSessionId}
        />
      )}
    </div>
  );
};

export default Index;
