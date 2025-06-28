
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Brain, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SnapSolve = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('gemini-ai', {
          body: {
            prompt: "Analyze this image and provide a detailed explanation. If it's a math problem, solve it step by step. If it's a science diagram, explain what it shows. If it's text, summarize and explain the key concepts.",
            image: base64
          }
        });

        if (error) throw error;

        setAnalysis(data.response);
        
        // Save to learning sessions
        await supabase.from('learning_sessions').insert({
          user_id: user?.id,
          session_type: 'snap_solve',
          content: { analysis: data.response, image_name: selectedImage.name }
        });

        toast({
          title: "Analysis Complete!",
          description: "Your image has been analyzed successfully."
        });
      };
      reader.readAsDataURL(selectedImage);
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
          <h1 className="text-3xl font-bold text-white">Snap & Solve</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Upload Image
              </CardTitle>
              <CardDescription className="text-purple-200">
                Upload an image of a math problem, science diagram, or any learning material
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-purple-300" />
                    <p className="text-purple-200">Click to upload an image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors"
                >
                  Choose Image
                </label>
              </div>
              
              <Button
                onClick={analyzeImage}
                disabled={!selectedImage || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription className="text-purple-200">
                Detailed explanation and solution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm">{analysis}</div>
                </div>
              ) : (
                <div className="text-center text-purple-300 py-8">
                  Upload an image and click "Analyze" to get started
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SnapSolve;
