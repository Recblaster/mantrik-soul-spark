
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

interface ChatInterfaceProps {
  sessionId: string;
  personality: string;
  personalityName: string;
  onBack: () => void;
}

export const ChatInterface = ({ sessionId, personality, personalityName, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [sessionId, user]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('chat-with-mentor', {
        body: {
          message: userMessage,
          personality,
          sessionId,
          userId: user.id
        }
      });

      if (response.error) throw response.error;

      // Refresh messages after sending
      await fetchMessages();
      
      // Update session message count
      await supabase
        .from('sessions')
        .update({ 
          message_count: messages.length + 2, // +2 for user message and AI response
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonalityColor = (personality: string) => {
    switch (personality) {
      case 'jarvis': return 'from-blue-400 to-blue-600';
      case 'calm-guru': return 'from-green-400 to-green-600';
      case 'vegeta': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case 'jarvis': return '🤖';
      case 'calm-guru': return '🧘';
      case 'vegeta': return '⚡';
      default: return '💭';
    }
  };

  const getWelcomeMessage = (personality: string) => {
    switch (personality) {
      case 'jarvis': return "Hello! I'm Jarvis, your superintelligent AI assistant. How can I help you today?";
      case 'calm-guru': return "Welcome, dear friend. I am here to guide you toward inner peace. How may I help you today?";
      case 'vegeta': return "Listen up! I'm Vegeta, and I'm here to push you beyond your limits. What do you need to overcome?";
      default: return "How can I assist you today?";
    }
  };

  if (loadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl">Loading conversation...</div>
      </div>
    );
  }

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${getPersonalityColor(personality)} mb-6 text-3xl`}>
                {getPersonalityIcon(personality)}
              </div>
              <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                {getWelcomeMessage(personality)}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl p-4 ${
                  message.role === 'user' 
                    ? `bg-gradient-to-r ${getPersonalityColor(personality)} text-white shadow-lg` 
                    : 'bg-gray-700/80 text-gray-100 backdrop-blur-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </Card>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-xs sm:max-w-md p-4 bg-gray-700/80 text-gray-100 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 bg-gradient-to-r ${getPersonalityColor(personality)} rounded-full animate-bounce`}></div>
                    <div className={`w-2 h-2 bg-gradient-to-r ${getPersonalityColor(personality)} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                    <div className={`w-2 h-2 bg-gradient-to-r ${getPersonalityColor(personality)} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-300">{personalityName} is thinking...</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${personalityName}...`}
            className="flex-1 bg-gray-700/80 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className={`bg-gradient-to-r ${getPersonalityColor(personality)} hover:opacity-80 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};
