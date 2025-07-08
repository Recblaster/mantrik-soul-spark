
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Menu } from "lucide-react";
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
  tagline: string;
}

const personalities: Personality[] = [
  { 
    id: 'jarvis', 
    name: 'Jarvis', 
    description: 'Smart, quick, and practical', 
    color: 'bg-blue-500',
    tagline: 'Your superintelligent AI assistant'
  },
  { 
    id: 'calm-guru', 
    name: 'Calm Guru', 
    description: 'Peaceful, mindful, and wise', 
    color: 'bg-green-500',
    tagline: 'Find inner peace and guidance'
  },
  { 
    id: 'vegeta', 
    name: 'Vegeta', 
    description: 'Fierce, motivating, and no-nonsense', 
    color: 'bg-red-500',
    tagline: 'Push your limits and become stronger'
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-white text-xl">Loading...</div>
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
      // Create new session
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

  // If a personality is selected, show the chat interface
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
          {/* Header with session controls */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <Menu className="h-4 w-4 mr-2" />
                Sessions
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedPersonalityData.color.replace('bg-', 'from-').replace('-500', '-400')} to-${selectedPersonalityData.color.replace('bg-', '').replace('-500', '-600')}`}></div>
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

  // Show personality selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-green-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center p-6 relative z-10">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-purple-400" />
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Mantrik
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <SessionHistory />
          <Profile />
          <LogoutConfirmation onConfirm={handleSignOut} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your AI Mentor
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl leading-relaxed">
            Select the personality that resonates with your current needs and start your journey of growth and guidance.
          </p>
        </div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
          {personalities.map((personality, index) => (
            <Card 
              key={personality.id}
              className="group bg-gray-800/40 border-gray-600 backdrop-blur-md shadow-2xl p-8 text-center hover:scale-105 hover:bg-gray-700/50 transition-all duration-500 cursor-pointer relative overflow-hidden"
              onClick={() => handlePersonalitySelect(personality.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${personality.color.replace('bg-', 'from-').replace('-500', '-500/20')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`w-24 h-24 rounded-full ${personality.color} mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}>
                  <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm group-hover:bg-white/40 transition-colors duration-300"></div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors duration-300">{personality.name}</h3>
                <p className="text-gray-300 mb-4 text-lg font-medium">{personality.tagline}</p>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">{personality.description}</p>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${personality.color.replace('bg-', 'from-').replace('-500', '-400')} to-${personality.color.replace('bg-', '').replace('-500', '-600')} hover:opacity-90 hover:scale-105 text-white font-semibold py-4 text-lg shadow-lg transition-all duration-300`}
                >
                  Start Conversation
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Your conversations are saved and can be accessed anytime through Session History
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
