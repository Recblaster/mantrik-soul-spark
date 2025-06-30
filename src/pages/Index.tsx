
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, MessageCircle, History, User, Send, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedPersonality, setSelectedPersonality] = useState('jarvis');
  const [message, setMessage] = useState('');
  const [isInSession, setIsInSession] = useState(false);
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleStartSession = () => {
    setIsInSession(true);
    toast({
      title: "Session Started",
      description: "Your mentoring session has begun. How are you feeling today?",
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would send to AI
    toast({
      title: "Message Sent",
      description: "Your mentor is thinking...",
    });
    setMessage('');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handlePersonalityChange = (personalityId: string) => {
    setSelectedPersonality(personalityId);
    toast({
      title: "Personality Changed",
      description: `Switched to ${personalities.find(p => p.id === personalityId)?.name}`,
    });
  };

  if (isInSession) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsInSession(false)}
              className={`${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}
            >
              ← Back
            </Button>
            <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Session with {personalities.find(p => p.id === selectedPersonality)?.name}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 pb-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse"></div>
              </div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                How are you feeling today? I'm here to listen and guide you.
              </p>
            </div>
          </div>
        </div>

        {/* Presets Button */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              side="top" 
              className={`mb-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              {personalities.slice(0, 3).map((personality) => (
                <DropdownMenuItem
                  key={personality.id}
                  onClick={() => handlePersonalityChange(personality.id)}
                  className={`cursor-pointer ${
                    selectedPersonality === personality.id 
                      ? 'bg-purple-100 dark:bg-purple-900/30' 
                      : ''
                  } ${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${personality.color} mr-3`}></div>
                  <div>
                    <div className="font-medium">{personality.name}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {personality.description}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Chat Input */}
        <div className={`fixed bottom-0 left-0 right-0 p-4 ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center p-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How are you feeling?"
                className={`flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-purple-500 focus:border-purple-500`}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                className="ml-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Mantrik
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <History className="h-5 w-5 mr-2" />
            Sessions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <User className="h-5 w-5 mr-2" />
            Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        {/* Central Orb */}
        <div className="relative mb-12">
          <div className="w-48 h-48 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 p-1 animate-pulse">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 transform translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm"></div>
            </div>
          </div>
        </div>

        {/* Chat Input with Presets Button */}
        <div className="relative w-full max-w-2xl">
          {/* Presets Button - positioned absolutely above the input */}
          <div className="absolute -top-16 left-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="bottom" 
                className={`mt-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                {personalities.slice(0, 3).map((personality) => (
                  <DropdownMenuItem
                    key={personality.id}
                    onClick={() => handlePersonalityChange(personality.id)}
                    className={`cursor-pointer ${
                      selectedPersonality === personality.id 
                        ? 'bg-purple-100 dark:bg-purple-900/30' 
                        : ''
                    } ${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${personality.color} mr-3`}></div>
                    <div>
                      <div className="font-medium">{personality.name}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {personality.description}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Chat Input */}
          <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm`}>
            <div className="flex items-center p-4">
              <Input
                placeholder="How are you feeling?"
                className={`flex-1 bg-transparent border-none ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'} focus:ring-0 focus:outline-none`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleStartSession()}
              />
              <Button
                onClick={handleStartSession}
                className="ml-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        <p className={`text-sm mt-6 text-center max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Start a conversation with your AI mentor. Share your thoughts, feelings, or ask for guidance.
        </p>
      </div>
    </div>
  );
};

export default Index;
