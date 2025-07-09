
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Menu, Sparkles, Zap, Leaf, MessageCircle, Plus } from "lucide-react";
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
    gradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
    tagline: 'Your superintelligent AI assistant',
    icon: Brain,
    accent: 'border-blue-400/30 hover:border-blue-400/60'
  },
  { 
    id: 'calm-guru', 
    name: 'Calm Guru', 
    description: 'Peaceful, mindful, and wise', 
    color: 'from-emerald-400 to-green-400',
    gradient: 'bg-gradient-to-br from-emerald-500/10 to-green-500/10',
    tagline: 'Find inner peace and guidance',
    icon: Leaf,
    accent: 'border-emerald-400/30 hover:border-emerald-400/60'
  },
  { 
    id: 'vegeta', 
    name: 'Vegeta', 
    description: 'Fierce, motivating, and powerful', 
    color: 'from-orange-400 to-red-400',
    gradient: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-xl">
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

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Top Navigation */}
      <div className="relative z-10 flex justify-between items-center p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="h-8 w-8 text-blue-400" />
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Mantrik AI
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(true)}
            className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Sessions
          </Button>
          <SessionHistory />
          <Profile />
          <LogoutConfirmation onConfirm={handleSignOut} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-88px)] px-6 py-12">
        {/* Central Orb/Logo Area */}
        <div className="text-center mb-16 max-w-4xl">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 p-1 animate-pulse">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <Brain className="h-16 w-16 text-blue-400" />
              </div>
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 animate-ping"></div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            Choose Your AI Mentor
          </h1>
          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            Select the perfect AI personality to guide your journey. Each mentor brings unique wisdom and perspective.
          </p>
        </div>

        {/* Personality Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mb-12">
          {personalities.map((personality, index) => {
            const IconComponent = personality.icon;
            return (
              <Card 
                key={personality.id}
                className={`group relative overflow-hidden bg-black/40 backdrop-blur-xl border ${personality.accent} transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 cursor-pointer ${personality.gradient} rounded-2xl`}
                onClick={() => handlePersonalitySelect(personality.id)}
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${personality.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                
                <div className="relative z-10 p-8 text-center">
                  {/* Icon with glow */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${personality.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 relative`}>
                    <IconComponent className="h-10 w-10 text-white" />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${personality.color} opacity-50 blur-md group-hover:blur-lg transition-all duration-300`}></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors duration-300">
                    {personality.name}
                  </h3>
                  <p className={`text-transparent bg-clip-text bg-gradient-to-r ${personality.color} mb-4 text-lg font-medium`}>
                    {personality.tagline}
                  </p>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    {personality.description}
                  </p>
                  
                  {/* CTA Button */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${personality.color} hover:opacity-90 hover:scale-105 text-white font-semibold py-3 text-base shadow-lg transition-all duration-300 border-0 rounded-xl`}
                  >
                    Start Conversation
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${personality.color}`}></div>
                </div>
                <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-30 transition-opacity duration-300">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${personality.color}`}></div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4 flex items-center justify-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Your conversations are automatically saved and accessible through Session History</span>
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span>Personalized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="fixed bottom-8 right-8">
        <Button
          onClick={() => setShowSidebar(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>

      <style>
        {`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `}
      </style>
    </div>
  );
};

export default Index;
