
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Menu, MessageCircle, Plus, Settings, Library, Search, Users, X, Send, Mic, Paperclip } from "lucide-react";
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
    icon: Library,
    accent: 'border-emerald-400/30 hover:border-emerald-400/60'
  },
  { 
    id: 'vegeta', 
    name: 'Vegeta', 
    description: 'Fierce, motivating, and powerful', 
    color: 'from-orange-400 to-red-400',
    gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
    tagline: 'Push your limits and become stronger',
    icon: Users,
    accent: 'border-orange-400/30 hover:border-orange-400/60'
  }
];

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    console.log('Auth state:', { user: !!user, loading });
    if (!loading && !user) {
      console.log('No user found, redirecting to landing page');
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
          <div className="text-gray-300 text-sm">Loading...</div>
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
  };

  const handleNewSession = () => {
    setSelectedPersonality(null);
    setCurrentSessionId(null);
  };

  const handleBackToSelection = () => {
    setSelectedPersonality(null);
    setCurrentSessionId(null);
  };

  const selectedPersonalityData = personalities.find(p => p.id === selectedPersonality);

  // Chat Interface View
  if (selectedPersonality && currentSessionId && selectedPersonalityData) {
    return (
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700">
              <Button
                onClick={handleNewSession}
                className="w-full bg-transparent border border-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New chat
              </Button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-2">
              <SessionSidebar
                onSessionSelect={handleSessionSelect}
                onClose={() => setShowSidebar(false)}
                onNewSession={handleNewSession}
                currentSessionId={currentSessionId}
              />
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-700 space-y-2">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
                <Profile />
              </div>
              <LogoutConfirmation onConfirm={handleSignOut} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-14 border-b border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {!showSidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-lg font-medium">Mantrik AI</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="text-gray-400 hover:text-white"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ChatInterface
            sessionId={currentSessionId}
            personality={selectedPersonality}
            personalityName={selectedPersonalityData.name}
            onBack={handleBackToSelection}
          />
        </div>
      </div>
    );
  }

  // Main Selection View
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700">
            <Button
              onClick={handleNewSession}
              className="w-full bg-transparent border border-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New chat
            </Button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 p-2 space-y-1">
            <div className="text-xs text-gray-400 font-medium px-3 py-2">MENU</div>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-3" />
              New chat
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 text-sm"
            >
              <Search className="h-4 w-4 mr-3" />
              Search chats
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 text-sm"
            >
              <Library className="h-4 w-4 mr-3" />
              Library
            </Button>

            <div className="pt-4">
              <div className="text-xs text-gray-400 font-medium px-3 py-2">CHATS</div>
              <SessionHistory />
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
              <Profile />
            </div>
            <LogoutConfirmation onConfirm={handleSignOut} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {!showSidebar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="text-gray-400 hover:text-white"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <h1 className="text-lg font-medium">Mantrik AI</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-2xl w-full space-y-8">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-2xl font-medium text-white mb-2">What can I help with?</h2>
            </div>

            {/* Personality Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {personalities.map((personality) => {
                const IconComponent = personality.icon;
                return (
                  <Card 
                    key={personality.id}
                    className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer p-4"
                    onClick={() => handlePersonalitySelect(personality.id)}
                  >
                    <div className="text-center space-y-3">
                      <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${personality.color} flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm mb-1">{personality.name}</h3>
                        <p className="text-gray-400 text-xs">{personality.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="relative">
              <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 focus-within:border-gray-500 transition-colors">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask anything"
                      className="w-full bg-transparent text-white placeholder-gray-400 outline-none resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      disabled={!inputMessage.trim()}
                      className="bg-white text-black hover:bg-gray-200 p-1"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
