
import { Button } from "@/components/ui/button";
import { Menu, Edit3 } from "lucide-react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  showSidebar: boolean;
  personalityName?: string;
}

export const ChatHeader = ({ onToggleSidebar, showSidebar, personalityName }: ChatHeaderProps) => {
  return (
    <div className="h-12 border-b border-gray-700 flex items-center justify-between px-4 bg-gray-900">
      <div className="flex items-center gap-3">
        {!showSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="text-gray-400 hover:text-white p-1"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-white font-medium">
          {personalityName ? `${personalityName}` : 'ChatGPT'}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white p-1"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
