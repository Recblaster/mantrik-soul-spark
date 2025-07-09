
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Menu, Sparkles, Zap, Leaf, MessageCircle, Plus, Star } from "lucide-react";
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
  gradient: string;
  tagline: string;
  icon: any;
  accent: string;
}

const personalities: Personality[] = [
  { 
    id: 'jarvis', 
    name: 'Jarvis', 
    description: 'Smart, analytical, and efficient', 
    color: 'from-blue-400 to-cyan-400',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    tagline: 'Your superintelligent AI assistant',
    icon: Brain,
    accent: 'border-blue-400/30 hover:border-blue-400/60'
  },
  { 
    id: 'calm-guru', 
    name: 'Calm Guru', 
    description: 'Peaceful, mindful, and wise', 
    color: 'from-emerald-400 to-green-400',
    gradient: 'bg-gradient-to-br from-emerald-500/20 to-green-500/20',
    tagline: 'Find inner peace and guidance',
    icon: Leaf,
    accent: 'border-emerald-400/30 hover:border-emerald-400/60'
  },
  { 
    id: 'vegeta', 
    name: 'Vegeta', 
    description: 'Fierce, motivating, and powerful', 
    color: 'from-orange-400 to-red-400',
    gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
    tagline: 'Push your limits and become stronger',
    icon: Zap,
    accent: 'border-orange-400/30 hover:border-orange-400/60'
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
          <div className="text-white/70 text-lg">Loading...</div>
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
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Menu className="h-4 w-4 mr-2" />
                Sessions
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedPersonalityData.color} flex items-center justify-center shadow-lg`}>
                  <selectedPersonalityData.icon className="h-4 w-4 text-white" />
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

  // Main Chatbot Interface View
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-slate-900/30 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Mantrik AI</span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(true)}
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Sessions
          </Button>
          <SessionHistory />
          <Profile />
          <LogoutConfirmation onConfirm={handleSignOut} />
        </div>
      </div>

      {/* Left Sidebar Icons */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-10">
        <Button variant="ghost" size="sm" className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/10 hover:bg-slate-700/50">
          <Sparkles className="h-4 w-4 text-gray-400" />
        </Button>
        <Button variant="ghost" size="sm" className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/10 hover:bg-slate-700/50">
          <MessageCircle className="h-4 w-4 text-gray-400" />
        </Button>
        <Button variant="ghost" size="sm" className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/10 hover:bg-slate-700/50">
          <Star className="h-4 w-4 text-gray-400" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        {/* Glowing Star Icon */}
        <div className="relative mb-8">
          <div className="w-16 h-16 flex items-center justify-center">
            <Star className="h-12 w-12 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          </div>
          <div className="absolute inset-0 animate-ping">
            <Star className="h-12 w-12 text-blue-400/30" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-4">
          <p className="text-gray-400 text-sm mb-2">Welcome to Mantrik AI</p>
          <h1 className="text-4xl font-bold text-white mb-8">How can I help?</h1>
        </div>

        {/* Personality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mb-12">
          {personalities.map((personality) => {
            const IconComponent = personality.icon;
            return (
              <Card 
                key={personality.id}
                className="group relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20 cursor-pointer rounded-2xl p-6"
                onClick={() => handlePersonalitySelect(personality.id)}
              >
                {/* Card Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${personality.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {personality.tagline}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {personality.description}
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${personality.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Dropdown and Input Area */}
        <div className="w-full max-w-2xl space-y-4">
          {/* Model Selector */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2">
              <Brain className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">AI Model</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>

          {/* Input Field */}
          <div className="relative">
            <div className="flex items-center bg-slate-800/50 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors">
              <input 
                type="text" 
                placeholder="What do you want to see..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              />
              <Button 
                size="sm" 
                className="ml-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
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
