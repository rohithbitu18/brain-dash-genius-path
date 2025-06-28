
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PenTool, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const WritingLab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [essay, setEssay] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const getFeedback = async () => {
    if (!essay.trim()) {
      toast({
        title: "Essay Required",
        description: "Please write your essay first.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const prompt = `Please provide detailed feedback on this essay. Analyze grammar, structure, clarity, arguments, and provide specific suggestions for improvement:\n\n${essay}`;

      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { prompt }
      });

      if (error) throw error;

      setFeedback(data.response);
      
      // Save to learning sessions
      await supabase.from('learning_sessions').insert({
        user_id: user?.id,
        session_type: 'writing_lab',
        content: { 
          essay: essay,
          feedback: data.response,
          word_count: essay.split(' ').length
        }
      });

      toast({
        title: "Feedback Generated!",
        description: "Your essay has been analyzed with detailed feedback."
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Writing Lab</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Your Essay
              </CardTitle>
              <CardDescription className="text-purple-200">
                Write your essay and get AI-powered feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Start writing your essay here..."
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                rows={20}
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 min-h-[400px]"
              />
              
              <div className="flex justify-between items-center text-sm text-purple-200">
                <span>Words: {essay.split(' ').filter(word => word.length > 0).length}</span>
                <span>Characters: {essay.length}</span>
              </div>
              
              <Button
                onClick={getFeedback}
                disabled={loading || !essay.trim()}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {loading ? 'Analyzing...' : 'Get Feedback'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
              <CardDescription className="text-purple-200">
                Detailed analysis and suggestions for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {feedback ? (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm">{feedback}</div>
                </div>
              ) : (
                <div className="text-center text-purple-300 py-8">
                  Write your essay and click "Get Feedback" for detailed analysis
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WritingLab;
