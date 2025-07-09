
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Message ChatGPT..." }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-700 bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 bg-gray-800 border border-gray-600 rounded-xl p-3 focus-within:border-gray-500 transition-colors">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-1 flex-shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 min-h-[24px] max-h-32 bg-transparent border-0 resize-none text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              rows={1}
            />
            
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              size="sm"
              className="bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 p-2 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          ChatGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};
