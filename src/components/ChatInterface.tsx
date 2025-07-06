
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
      case 'sage': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  if (loadingMessages) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getPersonalityColor(personality)}`}></div>
            <h1 className="text-xl font-semibold">{personalityName}</h1>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getPersonalityColor(personality)} mb-4`}>
                <div className="w-8 h-8 rounded-full bg-white/20"></div>
              </div>
              <p className="text-gray-300 text-lg">
                Start a conversation with {personalityName}. How can I help you today?
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
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </Card>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-xs sm:max-w-md p-4 bg-gray-700 text-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-gray-500 focus:border-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className={`bg-gradient-to-r ${getPersonalityColor(personality)} hover:opacity-80 text-white`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
