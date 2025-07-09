
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/components/Profile';
import { LogoutConfirmation } from '@/components/LogoutConfirmation';
import { ChatInterface } from '@/components/ChatInterface';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatHeader } from '@/components/ChatHeader';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ChatInput } from '@/components/ChatInput';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const personalities: Record<string, { name: string }> = {
    jarvis: { name: 'Jarvis' },
    'calm-guru': { name: 'Calm Guru' },
    vegeta: { name: 'Vegeta' }
  };

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

  const handleSendMessage = async (message: string) => {
    if (!selectedPersonality) {
      // Auto-select first personality if none selected
      await handlePersonalitySelect('jarvis');
    }
    // The actual message sending will be handled by ChatInterface
  };

  const selectedPersonalityData = selectedPersonality ? personalities[selectedPersonality] : null;

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
          <ChatSidebar
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            currentSessionId={currentSessionId}
          />
          
          {/* User section at bottom */}
          <div className="p-3 border-t border-gray-700 space-y-2">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
              <Profile />
            </div>
            <LogoutConfirmation onConfirm={handleSignOut} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          showSidebar={showSidebar}
          personalityName={selectedPersonalityData?.name}
        />

        {/* Chat area */}
        {selectedPersonality && currentSessionId ? (
          <ChatInterface
            sessionId={currentSessionId}
            personality={selectedPersonality}
            personalityName={selectedPersonalityData?.name || selectedPersonality}
            onBack={handleNewSession}
          />
        ) : (
          <>
            <WelcomeScreen onPersonalitySelect={handlePersonalitySelect} />
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholder="Message ChatGPT..."
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
