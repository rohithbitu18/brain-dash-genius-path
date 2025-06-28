
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { BookOpen, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SmartNotes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [studyGuide, setStudyGuide] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStudyGuide = async () => {
    if (!youtubeUrl && !textContent) {
      toast({
        title: "Input Required",
        description: "Please provide either a YouTube URL or text content.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let prompt = '';
      if (youtubeUrl) {
        prompt = `Create a comprehensive study guide from this YouTube video: ${youtubeUrl}. Include key concepts, main points, and study questions.`;
      } else {
        prompt = `Create a comprehensive study guide from this content: "${textContent}". Break it down into key concepts, main points, summary, and create study questions for better understanding.`;
      }

      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { prompt }
      });

      if (error) throw error;

      setStudyGuide(data.response);
      
      // Save to learning sessions
      await supabase.from('learning_sessions').insert({
        user_id: user?.id,
        session_type: 'smart_notes',
        content: { 
          study_guide: data.response, 
          source_url: youtubeUrl,
          source_text: textContent 
        }
      });

      toast({
        title: "Study Guide Generated!",
        description: "Your smart notes are ready for review."
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Smart Notes</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Create Study Guide
              </CardTitle>
              <CardDescription className="text-purple-200">
                Transform YouTube videos or text into interactive study guides
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  YouTube URL (Optional)
                </label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                />
              </div>
              
              <div className="text-center text-purple-200">OR</div>
              
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Text Content
                </label>
                <Textarea
                  placeholder="Paste your study material here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={8}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                />
              </div>
              
              <Button
                onClick={generateStudyGuide}
                disabled={loading || (!youtubeUrl && !textContent)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {loading ? 'Generating...' : 'Generate Study Guide'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle>Study Guide</CardTitle>
              <CardDescription className="text-purple-200">
                AI-generated interactive study notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studyGuide ? (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm">{studyGuide}</div>
                </div>
              ) : (
                <div className="text-center text-purple-300 py-8">
                  Provide content and click "Generate" to create your study guide
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SmartNotes;
