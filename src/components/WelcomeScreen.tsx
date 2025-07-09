
import { Card } from "@/components/ui/card";
import { Brain, Sparkles, Zap } from "lucide-react";

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
    description: 'Smart, analytical, and efficient assistant', 
    icon: Brain,
  },
  { 
    id: 'calm-guru', 
    name: 'Calm Guru', 
    description: 'Peaceful, mindful, and wise guidance', 
    icon: Sparkles,
  },
  { 
    id: 'vegeta', 
    name: 'Vegeta', 
    description: 'Fierce, motivating, and powerful energy', 
    icon: Zap,
  }
];

interface WelcomeScreenProps {
  onPersonalitySelect: (personalityId: string) => void;
}

export const WelcomeScreen = ({ onPersonalitySelect }: WelcomeScreenProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      {/* Main heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">
          How can I help you today?
        </h1>
        <p className="text-gray-600 text-lg">
          Choose an AI personality to get started
        </p>
      </div>

      {/* Personality cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {personalities.map((personality) => {
          const IconComponent = personality.icon;
          return (
            <Card 
              key={personality.id}
              onClick={() => onPersonalitySelect(personality.id)}
              className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer p-6 text-center group"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                  <IconComponent className="h-8 w-8 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{personality.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{personality.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Example prompts */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {[
          "Help me write a professional email",
          "Explain quantum physics simply",
          "Create a workout plan",
          "Review my code"
        ].map((prompt, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => {/* Could auto-fill input */}}
          >
            {prompt}
          </div>
        ))}
      </div>
    </div>
  );
};
