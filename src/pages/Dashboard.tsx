
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Camera, BookOpen, BarChart3, PenTool, LogOut, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: "Snap & Solve",
      description: "Upload images of math problems for instant AI explanations",
      icon: Camera,
      color: "from-blue-500 to-blue-600",
      action: "Launch",
      path: "/snap-solve"
    },
    {
      title: "Smart Notes",
      description: "Transform YouTube videos and text into interactive study guides",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600",
      action: "Launch",
      path: "/smart-notes"
    },
    {
      title: "Writing Lab",
      description: "Get real-time AI feedback on essays and written work",
      icon: PenTool,
      color: "from-orange-500 to-orange-600",
      action: "Launch",
      path: "/writing-lab"
    },
    {
      title: "Progress Analytics",
      description: "Visual dashboards showing your learning progress and insights",
      icon: BarChart3,
      color: "from-indigo-500 to-indigo-600",
      action: "View",
      path: "/progress-analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-purple-300" />
              <h1 className="text-2xl font-bold text-white">Brain Dash</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-purple-200">Welcome, {user?.email}</span>
              <Button
                onClick={signOut}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to Your AI Learning Hub
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            See It. Snap It. Learn It. – The Future of Smarter Studying
          </p>
          <div className="flex items-center justify-center space-x-2 text-yellow-300">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg">Powered by Gemini AI</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  <CardDescription className="text-purple-200">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => navigate(feature.path)}
                    className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-white`}
                  >
                    {feature.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
