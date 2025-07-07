
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/components/Profile';
import { LogoutConfirmation } from '@/components/LogoutConfirmation';

interface Personality {
  id: string;
  name: string;
  description: string;
  color: string;
  route: string;
  tagline: string;
}

const personalities: Personality[] = [
  { 
    id: 'jarvis', 
    name: 'Jarvis', 
    description: 'Smart, quick, and practical', 
    color: 'bg-blue-500',
    route: '/jarvis',
    tagline: 'Your superintelligent AI assistant'
  },
  { 
    id: 'calm-guru', 
    name: 'Calm Guru', 
    description: 'Peaceful, mindful, and wise', 
    color: 'bg-green-500',
    route: '/calm-guru',
    tagline: 'Find inner peace and guidance'
  },
  { 
    id: 'vegeta', 
    name: 'Vegeta', 
    description: 'Fierce, motivating, and no-nonsense', 
    color: 'bg-red-500',
    route: '/vegeta',
    tagline: 'Push your limits and become stronger'
  }
];

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth state:', { user: !!user, loading });
    if (!loading && !user) {
      console.log('No user found, redirecting to landing page');
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleMentorSelect = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center p-6 relative z-10">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-gray-300" />
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Mantrik
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Profile />
          <LogoutConfirmation onConfirm={handleSignOut} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Choose Your AI Mentor
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Select the personality that resonates with you and start your journey of growth and guidance.
          </p>
        </div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {personalities.map((personality) => (
            <Card 
              key={personality.id}
              className="bg-gray-800/40 border-gray-600 backdrop-blur-md shadow-2xl p-8 text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleMentorSelect(personality.route)}
            >
              <div className={`w-20 h-20 rounded-full ${personality.color} mx-auto mb-6 flex items-center justify-center`}>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{personality.name}</h3>
              <p className="text-gray-300 mb-4">{personality.tagline}</p>
              <p className="text-gray-400 text-sm mb-6">{personality.description}</p>
              
              <Button 
                className={`w-full bg-gradient-to-r ${personality.color.replace('bg-', 'from-').replace('-500', '-400')} to-${personality.color.replace('bg-', '').replace('-500', '-600')} hover:opacity-80 text-white font-semibold py-3`}
              >
                Start Session
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
