
import { useState } from 'react';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import { Brain, Sparkles, BookOpen, Camera } from 'lucide-react';

const Index = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white">
          <div className="max-w-md text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="relative">
                <Brain className="w-12 h-12 text-purple-300" />
                <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Brain Dash
              </h1>
            </div>
            
            <h2 className="text-3xl font-semibold mb-4">
              See It. Snap It. Learn It.
            </h2>
            
            <p className="text-xl text-purple-200 mb-8">
              The Future of Smarter Studying
            </p>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <Camera className="w-6 h-6 text-blue-300" />
                <span className="text-lg">Snap & Solve with AI</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-purple-300" />
                <span className="text-lg">Personalized Learning Paths</span>
              </div>
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span className="text-lg">Powered by Gemini AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Brain className="w-10 h-10 text-purple-300" />
                <h1 className="text-3xl font-bold text-white">Brain Dash</h1>
              </div>
              <p className="text-purple-200">AI-Powered Learning Platform</p>
            </div>

            {showSignUp ? (
              <SignUp onSwitchToSignIn={() => setShowSignUp(false)} />
            ) : (
              <SignIn onSwitchToSignUp={() => setShowSignUp(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
