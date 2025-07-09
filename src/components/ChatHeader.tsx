
import { Button } from "@/components/ui/button";
import { Menu, Edit3 } from "lucide-react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  showSidebar: boolean;
  personalityName?: string;
}

export const ChatHeader = ({ onToggleSidebar, showSidebar, personalityName }: ChatHeaderProps) => {
  return (
    <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
      <div className="flex items-center gap-3">
        {!showSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-gray-900 font-semibold text-lg">
          {personalityName ? `Chat with ${personalityName}` : 'ChatGPT'}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
