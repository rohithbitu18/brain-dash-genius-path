
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

interface SignInProps {
  onSwitchToSignUp: () => void;
}

const SignIn = ({ onSwitchToSignUp }: SignInProps) => {
  const { signIn, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (!error) {
      // Success handling is done in the auth context
      console.log('Sign in successful');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Card className="w-full backdrop-blur-lg bg-white/10 border-white/20 text-white shadow-2xl">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-white">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full backdrop-blur-lg bg-white/10 border-white/20 text-white shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-purple-200">
          Sign in to continue your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@braindash.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-purple-300 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center">
          <span className="text-purple-200">Don't have an account? </span>
          <button
            onClick={onSwitchToSignUp}
            className="text-purple-300 hover:text-white font-semibold transition-colors"
            disabled={isLoading}
          >
            Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignIn;
