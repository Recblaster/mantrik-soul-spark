
import { Card } from "@/components/ui/card";
import { Brain, Library, Users } from "lucide-react";

interface Personality {
  id: string;
  name: string;
  description: string;
  icon: any;
}

const personalities: Personality[] = [
  { 
    id: 'jarvis', 
    name: 'Jarvis', 
    description: 'Smart, analytical, and efficient', 
    icon: Brain,
  },
  { 
    id: 'calm-guru', 
    name: 'Calm Guru', 
    description: 'Peaceful, mindful, and wise', 
    icon: Library,
  },
  { 
    id: 'vegeta', 
    name: 'Vegeta', 
    description: 'Fierce, motivating, and powerful', 
    icon: Users,
  }
];

interface WelcomeScreenProps {
  onPersonalitySelect: (personalityId: string) => void;
}

export const WelcomeScreen = ({ onPersonalitySelect }: WelcomeScreenProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
      {/* Main heading */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-white mb-4">
          How can I help you today?
        </h1>
      </div>

      {/* Personality cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
        {personalities.map((personality) => {
          const IconComponent = personality.icon;
          return (
            <Card 
              key={personality.id}
              onClick={() => onPersonalitySelect(personality.id)}
              className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 cursor-pointer p-6 text-center group"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-gray-700 rounded-full group-hover:bg-gray-600 transition-colors">
                  <IconComponent className="h-6 w-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">{personality.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{personality.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
