
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Moon, Sun, MessageCircle, History, User, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (isInSession) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsInSession(false)}
              className="text-purple-400 hover:text-purple-300"
            >
              ← Back
            </Button>
            <h1 className="text-xl font-semibold text-white">Session with {personalities.find(p => p.id === selectedPersonality)?.name}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="text-gray-400 hover:text-white"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 pb-24">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse"></div>
              </div>
              <p className="text-gray-400">How are you feeling today? I'm here to listen and guide you.</p>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
          <div className="max-w-3xl mx-auto">
            <div className="flex space-x-4">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How are you feeling?"
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
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
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Mantrik
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <History className="h-5 w-5 mr-2" />
            Sessions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <User className="h-5 w-5 mr-2" />
            Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="text-gray-400 hover:text-white"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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

        {/* Personality Selection */}
        <div className="mb-8">
          <h3 className="text-center text-lg font-medium text-gray-300 mb-6">Choose Your Mentor</h3>
          <div className="flex justify-center space-x-4">
            {personalities.map((personality) => (
              <div
                key={personality.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedPersonality === personality.id ? 'scale-110' : 'scale-100 hover:scale-105'
                }`}
                onClick={() => setSelectedPersonality(personality.id)}
              >
                <div className={`w-16 h-16 rounded-full ${personality.color} flex items-center justify-center relative ${
                  selectedPersonality === personality.id ? 'ring-4 ring-white/30' : ''
                }`}>
                  <div className="w-8 h-8 rounded-full bg-white/30"></div>
                  {selectedPersonality === personality.id && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-white font-medium">
              {personalities.find(p => p.id === selectedPersonality)?.name}
            </p>
            <p className="text-gray-400 text-sm">
              {personalities.find(p => p.id === selectedPersonality)?.description}
            </p>
          </div>
        </div>

        {/* Chat Input Placeholder */}
        <Card className="w-full max-w-2xl bg-gray-800/50 border-gray-700 backdrop-blur-sm">
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
              className="ml-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <p className="text-gray-400 text-sm mt-6 text-center max-w-md">
          Start a conversation with your AI mentor. Share your thoughts, feelings, or ask for guidance.
        </p>
      </div>
    </div>
  );
};

export default Index;
