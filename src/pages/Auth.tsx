
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, displayName);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      } else {
        if (isSignUp) {
          toast({
            title: "Success",
            description: "Account created successfully! Please check your email to confirm your account.",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in.",
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'}`}>
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Mantrik
          </h1>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your AI Mentor & Therapist
          </p>
        </div>

        <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm`}>
          <CardHeader className="space-y-1">
            <CardTitle className={`text-2xl text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isSignUp ? 'Sign up to start your journey' : 'Sign in to continue your sessions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`pr-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className={`text-sm ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'} hover:underline`}
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
