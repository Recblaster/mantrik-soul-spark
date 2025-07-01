
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Brain, Heart, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Mantrik
          </h1>
        </div>
        <Link to="/auth">
          <Button variant="outline" className="border-purple-300 text-purple-200 hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mb-6 relative shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <div className="relative w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your AI <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Mentor</span>
            <br />& <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">Therapist</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience personalized AI conversations that adapt to your emotional needs. 
            Get guidance, support, and wisdom from your digital companion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Try Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-300 text-purple-200 hover:bg-white/10 hover:text-white px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Emotional Support</h3>
              <p className="text-purple-100 leading-relaxed">
                Get compassionate guidance and emotional support tailored to your unique needs and circumstances.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Adaptive Personalities</h3>
              <p className="text-purple-100 leading-relaxed">
                Choose from different AI personalities - from calm and wise to motivating and energetic.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Private & Secure</h3>
              <p className="text-purple-100 leading-relaxed">
                Your conversations are private and secure. Share your thoughts freely in a safe space.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-12">What People Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-2xl">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-300 fill-current" />
                  ))}
                </div>
                <p className="text-purple-100 mb-4 italic">
                  "Mantrik has been like having a wise friend available 24/7. The conversations feel natural and genuinely helpful."
                </p>
                <p className="text-purple-300 font-semibold">- Sarah K.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-2xl">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-300 fill-current" />
                  ))}
                </div>
                <p className="text-purple-100 mb-4 italic">
                  "The different personalities make it feel like I'm talking to different mentors. Each one brings something unique."
                </p>
                <p className="text-pink-300 font-semibold">- Michael R.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-purple-100 mb-8">Join thousands who have found guidance and support with Mantrik</p>
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 py-8 text-center text-purple-200 relative z-10">
        <p>&copy; 2024 Mantrik. Your AI companion for emotional well-being.</p>
      </footer>
    </div>
  );
};

export default Landing;
