
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Menu, User, History, MessageCircle, Sparkles } from "lucide-react";
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
  tagline: string;
  power: string;
}

const personalities: Personality[] = [
  { 
    id: 'jarvis', 
    name: 'Jarvis', 
    description: 'AI Assistant Extraordinaire', 
    color: 'from-cyan-400 via-blue-500 to-purple-600',
    emoji: '🤖',
    tagline: 'Precision & Intelligence',
    power: '⚡ Super Computing'
  },
  { 
    id: 'calm-guru', 
    name: 'Calm Guru', 
    description: 'Zen Master & Guide', 
    color: 'from-emerald-400 via-teal-500 to-green-600',
    emoji: '🧘',
    tagline: 'Peace & Wisdom',
    power: '🌸 Inner Balance'
  },
  { 
    id: 'vegeta', 
    name: 'Vegeta', 
    description: 'Saiyan Prince Motivator', 
    color: 'from-orange-400 via-red-500 to-pink-600',
    emoji: '⚡',
    tagline: 'Power & Pride',
    power: '💥 Elite Strength'
  }
];

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('Auth state:', { user: !!user, loading });
    if (!loading && !user) {
      console.log('No user found, redirecting to landing page');
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-black animate-gradient-xy"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-white/80 mt-4 text-lg font-medium">Loading your AI experience...</p>
        </div>
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
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-black text-white flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
          
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl relative z-10">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Menu className="h-5 w-5 mr-2" />
                Sessions
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedPersonalityData.color} flex items-center justify-center text-white text-xl shadow-2xl animate-pulse`}>
                  {selectedPersonalityData.emoji}
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    {selectedPersonalityData.name}
                  </h1>
                  <p className="text-white/60 text-sm">{selectedPersonalityData.tagline}</p>
                </div>
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

  // Main Selection View - The Masterpiece
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-orange-400/30 via-transparent to-black/50 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_70%)] animate-spin-slow"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-8 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-black bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">
            MANTRIK AI
          </div>
          <Sparkles className="h-8 w-8 text-orange-300 animate-pulse" />
        </div>
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(true)}
            className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Sessions
          </Button>
          <SessionHistory />
          <Profile />
          <LogoutConfirmation onConfirm={handleSignOut} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-8 py-16">
        {/* Central Orb - The Crown Jewel */}
        <div className="relative mb-20">
          <div className="w-80 h-80 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 animate-pulse shadow-[0_0_100px_rgba(255,165,0,0.5)] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-500 to-black/50 flex items-center justify-center">
              <Brain className="h-24 w-24 text-white drop-shadow-2xl animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-spin-slow"></div>
          </div>
          
          {/* Orbiting Elements */}
          <div className="absolute inset-0 animate-spin-slow">
            {personalities.map((personality, index) => (
              <div
                key={personality.id}
                className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center text-2xl shadow-2xl"
                style={{
                  top: `${50 + 45 * Math.cos((index * 120 - 90) * Math.PI / 180)}%`,
                  left: `${50 + 45 * Math.sin((index * 120 - 90) * Math.PI / 180)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {personality.emoji}
              </div>
            ))}
          </div>
          
          {/* Pulse Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping"></div>
          <div className="absolute -inset-8 rounded-full border border-orange-300/30 animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -inset-16 rounded-full border border-red-300/20 animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Greeting */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent leading-tight">
            Choose Your Destiny
          </h1>
          <p className="text-white/80 text-2xl font-light max-w-2xl mx-auto leading-relaxed">
            Select your AI mentor and embark on an extraordinary journey of knowledge and transformation
          </p>
        </div>

        {/* Personality Cards - The Epic Trinity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl w-full mb-16">
          {personalities.map((personality, index) => (
            <Card 
              key={personality.id}
              className="group relative p-8 text-center hover:scale-105 transition-all duration-500 cursor-pointer bg-black/20 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_0_50px_rgba(255,165,0,0.3)] overflow-hidden"
              onClick={() => handlePersonalitySelect(personality.id)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${personality.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500 shadow-2xl relative`}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="relative z-10">{personality.emoji}</span>
              </div>
              
              <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-orange-200 transition-colors duration-300">
                {personality.name}
              </h3>
              
              <p className="text-white/70 text-lg mb-4 font-medium">
                {personality.description}
              </p>
              
              <div className="text-orange-300 text-sm font-semibold mb-2">
                {personality.tagline}
              </div>
              
              <div className="text-white/60 text-sm">
                {personality.power}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Card>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="text-center space-y-6">
          <p className="text-white/60 text-lg mb-6">
            ✨ Your conversations are encrypted and automatically saved
          </p>
          <div className="flex items-center justify-center space-x-12 text-white/40">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-glow-green"></div>
              <span className="font-medium">Quantum Secure</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-glow-blue"></div>
              <span className="font-medium">AI Powered</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-glow-purple"></div>
              <span className="font-medium">Ultra Personalized</span>
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

      {/* Custom Styles */}
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-gradient-xy { animation: gradient-xy 15s ease infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .shadow-glow-green { box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
        .shadow-glow-blue { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
        .shadow-glow-purple { box-shadow: 0 0 20px rgba(147, 51, 234, 0.5); }
      `}</style>
    </div>
  );
};

export default Index;
