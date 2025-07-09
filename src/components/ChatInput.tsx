
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
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 bg-white border border-gray-300 rounded-lg p-3 focus-within:border-gray-400 transition-colors shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 p-1 flex-shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 min-h-[24px] max-h-32 bg-transparent border-0 resize-none text-gray-900 placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              rows={1}
            />
            
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              size="sm"
              className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 p-2 flex-shrink-0 rounded-md"
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
