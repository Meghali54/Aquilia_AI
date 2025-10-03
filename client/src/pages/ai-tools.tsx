import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Brain, Upload, Dna, Eye, FileImage, Microscope, Sparkles, Waves, RotateCcw, ZoomIn, ZoomOut, Ruler, Camera, Download, Play, Pause } from 'lucide-react';

interface SpeciesPrediction {
  species: string;
  commonName: string;
  confidence: number;
  alternates: Array<{
    species: string;
    commonName: string;
    confidence: number;
  }>;
}

interface DNAMatch {
  species: string;
  commonName: string;
  similarity: number;
}

interface OtolithAnalysis {
  measurements: {
    length: number;
    width: number;
    thickness: number;
    volume: number;
    perimeter: number;
    area: number;
  };
  ageAnalysis: {
    estimatedAge: number;
    growthRings: number;
    confidence: number;
  };
  morphology: {
    shape: string;
    surface: string;
    opacity: number;
    symmetry: number;
  };
  species: {
    prediction: string;
    commonName: string;
    confidence: number;
    alternates: Array<{
      species: string;
      commonName: string;
      confidence: number;
    }>;
  };
  features: {
    nucleus: { x: number; y: number; size: number };
    sulcus: { type: string; depth: number };
    increments: Array<{ ring: number; width: number; season: string }>;
  };
}

export default function AITools() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dnaSequence, setDnaSequence] = useState('');
  const [predictionResult, setPredictionResult] = useState<SpeciesPrediction | null>(null);
  const [dnaMatches, setDnaMatches] = useState<DNAMatch[] | null>(null);
  const [step, setStep] = useState(1);
  
  // Otolith analysis states
  const [otolithImage, setOtolithImage] = useState<File | null>(null);
  const [otolithAnalysis, setOtolithAnalysis] = useState<OtolithAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [rotation, setRotation] = useState([0]);
  const [zoom, setZoom] = useState([100]);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [measurementMode, setMeasurementMode] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { toast } = useToast();

  const speciesPredictionMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await apiRequest('POST', '/api/ai/species-predict', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setPredictionResult(data.prediction);
      setStep(3);
      toast({
        title: "Analysis complete",
        description: "Species prediction results are ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze image",
        variant: "destructive",
      });
    },
  });

  const dnaMatchMutation = useMutation({
    mutationFn: async (sequence: string) => {
      const response = await apiRequest('POST', '/api/ai/dna-match', { sequence });
      return response.json();
    },
    onSuccess: (data) => {
      setDnaMatches(data.matches);
      toast({
        title: "DNA analysis complete",
        description: "Matching results are ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "DNA analysis failed",
        description: error.message || "Failed to analyze DNA sequence",
        variant: "destructive",
      });
    },
  });

  const otolithAnalysisMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await apiRequest('POST', '/api/ai/otolith-analyze', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setOtolithAnalysis(data.analysis);
      setIsAnalyzing(false);
      toast({
        title: "Otolith Analysis Complete",
        description: `Identified as ${data.analysis.species.commonName} with ${data.analysis.species.confidence.toFixed(1)}% confidence`,
      });
    },
    onError: (error: any) => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze otolith image",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setStep(2);
    }
  };

  const handleSpeciesPrediction = () => {
    if (selectedImage) {
      speciesPredictionMutation.mutate(selectedImage);
    }
  };

  const handleDNAAnalysis = () => {
    if (dnaSequence.trim()) {
      dnaMatchMutation.mutate(dnaSequence);
    } else {
      toast({
        title: "Missing DNA sequence",
        description: "Please enter a DNA sequence to analyze.",
        variant: "destructive",
      });
    }
  };

  const resetSpeciesAnalysis = () => {
    setSelectedImage(null);
    setPredictionResult(null);
    setStep(1);
  };

  const resetDNAAnalysis = () => {
    setDnaSequence('');
    setDnaMatches(null);
  };

  // Otolith analysis functions
  const handleOtolithUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOtolithImage(file);
      loadImageToCanvas(file);
    }
  };

  const loadImageToCanvas = (file: File) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 300;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    
    img.src = URL.createObjectURL(file);
  };

  const analyzeOtolith = async () => {
    if (!otolithImage) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate advanced otolith analysis with multiple stages
    const analysisSteps = [
      { progress: 10, message: "Preprocessing otolith image..." },
      { progress: 25, message: "Detecting otolith boundaries..." },
      { progress: 40, message: "Extracting morphological features..." },
      { progress: 55, message: "Counting growth rings..." },
      { progress: 70, message: "Measuring dimensions..." },
      { progress: 85, message: "Species classification..." },
      { progress: 100, message: "Analysis complete!" }
    ];

    for (const step of analysisSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    // Call the API for real analysis
    otolithAnalysisMutation.mutate(otolithImage);
  };

  const toggleAutoRotation = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  // Auto rotation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRotating) {
      interval = setInterval(() => {
        setRotation(prev => [(prev[0] + 2) % 360]);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Canvas update effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !otolithImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation[0] * Math.PI) / 180);
      ctx.scale(zoom[0] / 100, zoom[0] / 100);
      
      // Apply filters
      ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`;
      
      ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.restore();

      // Draw measurement overlay if in measurement mode
      if (measurementMode && otolithAnalysis) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Draw measurement lines
        ctx.beginPath();
        ctx.moveTo(50, canvas.height / 2);
        ctx.lineTo(canvas.width - 50, canvas.height / 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 50);
        ctx.lineTo(canvas.width / 2, canvas.height - 50);
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#00ff00';
        ctx.font = '12px Arial';
        ctx.fillText(`${otolithAnalysis.measurements.length.toFixed(1)}mm`, canvas.width - 100, canvas.height / 2 - 10);
        ctx.fillText(`${otolithAnalysis.measurements.width.toFixed(1)}mm`, canvas.width / 2 + 10, 40);
      }
    };
    
    img.src = URL.createObjectURL(otolithImage);
  }, [otolithImage, rotation, zoom, brightness, contrast, measurementMode, otolithAnalysis]);

  const breadcrumbs = [
    { label: 'AI Tools' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center space-y-6 py-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                <Brain className="w-12 h-12 text-purple-400" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
                AI Tools
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Advanced AI-powered analysis tools for marine research and species identification
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                <Sparkles className="w-5 h-5 mr-2" />
                Quick Analysis
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl px-6 py-3">
                <Upload className="w-5 h-5 mr-2" />
                Batch Upload
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl px-6 py-3">
                <Eye className="w-5 h-5 mr-2" />
                View Results
              </Button>
            </div>
          </div>

          <Tabs defaultValue="species" className="w-full" data-testid="tabs-ai-tools">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-xl">
            <TabsTrigger 
              value="species" 
              data-testid="tab-species"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/20 data-[state=active]:to-emerald-600/20 data-[state=active]:text-white data-[state=active]:border-blue-500/30 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-lg border border-transparent"
            >
              <Brain className="w-4 h-4 mr-2" />
              Species Prediction
            </TabsTrigger>
            <TabsTrigger 
              value="otolith" 
              data-testid="tab-otolith"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600/20 data-[state=active]:to-yellow-600/20 data-[state=active]:text-white data-[state=active]:border-orange-500/30 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-lg border border-transparent"
            >
              <Microscope className="w-4 h-4 mr-2" />
              Otolith Viewer
            </TabsTrigger>
            <TabsTrigger 
              value="dna" 
              data-testid="tab-dna"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-pink-600/20 data-[state=active]:text-white data-[state=active]:border-purple-500/30 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-lg border border-transparent"
            >
              <Dna className="w-4 h-4 mr-2" />
              DNA Matcher
            </TabsTrigger>
          </TabsList>

            <TabsContent value="species" className="space-y-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    Species Identification
                  </CardTitle>
                  <p className="text-slate-400">
                    Upload an image of a marine species for AI-powered identification
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between">
                    {[1, 2, 3].map((stepNum) => (
                      <div key={stepNum} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {stepNum}
                        </div>
                        <span className={`ml-2 text-sm ${step >= stepNum ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {stepNum === 1 && 'Upload Image'}
                          {stepNum === 2 && 'Analyze'}
                          {stepNum === 3 && 'Results'}
                        </span>
                        {stepNum < 3 && <div className="w-16 h-px bg-border ml-4" />}
                      </div>
                    ))}
                  </div>

                  {step === 1 && (
                    <div className="relative group">
                      {/* Enhanced Dropbox with Glassmorphism */}
                      <div className="bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 hover:border-blue-400/50 rounded-2xl p-12 text-center transition-all duration-300 group-hover:bg-white/10">
                        {/* Animated particles */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                          <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
                          <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse delay-300"></div>
                          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-teal-400/60 rounded-full animate-bounce delay-700"></div>
                        </div>
                        
                        <div className="relative z-10">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FileImage className="w-8 h-8 text-blue-400" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">Upload Species Image</h3>
                          <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Drag and drop or click to select a clear image of the marine species you want to identify
                          </p>
                          
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="species-image-upload"
                            data-testid="input-species-image"
                          />
                          <label 
                            htmlFor="species-image-upload"
                            className="group/btn relative inline-flex items-center gap-3 cursor-pointer overflow-hidden bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 hover:border-blue-400/70 hover:from-blue-500/30 hover:to-purple-500/30 backdrop-blur-xl transition-all duration-300 px-8 py-4 font-semibold hover:scale-105 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 rounded-xl"
                          >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                            
                            {/* Icon Container */}
                            <div className="relative z-10 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover/btn:rotate-12 transition-transform duration-300 shadow-lg">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                            
                            {/* Text Content */}
                            <div className="relative z-10 text-left">
                              <div className="text-white font-bold text-lg">Choose Image</div>
                              <div className="text-blue-200 text-sm font-normal">Upload marine species photo</div>
                            </div>
                            
                            {/* Pulse Ring Effect */}
                            <div className="absolute inset-0 rounded-xl border-2 border-blue-400/0 group-hover/btn:border-blue-400/50 group-hover/btn:animate-pulse transition-all duration-300"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && selectedImage && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                        <FileImage className="w-8 h-8 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{selectedImage.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedImage.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                        <Button variant="outline" onClick={resetSpeciesAnalysis} data-testid="button-change-image">
                          Change Image
                        </Button>
                      </div>

                      {speciesPredictionMutation.isPending && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Analyzing image...</span>
                              <span className="text-sm text-muted-foreground">Processing</span>
                            </div>
                            <Progress value={50} className="w-full" data-testid="progress-species-analysis" />
                            <p className="text-xs text-muted-foreground mt-2">
                              AI model is analyzing the image for species identification
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      <Button 
                        onClick={handleSpeciesPrediction}
                        disabled={speciesPredictionMutation.isPending}
                        className="w-full"
                        data-testid="button-analyze-species"
                      >
                        {speciesPredictionMutation.isPending ? 'Analyzing...' : 'Analyze Species'}
                      </Button>
                    </div>
                  )}

                  {step === 3 && predictionResult && (
                    <div className="space-y-4">
                      <Card className="border-primary">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" />
                            Primary Identification
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <p className="text-2xl font-bold" data-testid="text-predicted-species">
                                {predictionResult.species}
                              </p>
                              <p className="text-lg text-muted-foreground" data-testid="text-common-name">
                                {predictionResult.commonName}
                              </p>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400" data-testid="badge-confidence">
                              {(predictionResult.confidence * 100).toFixed(1)}% Confidence
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {predictionResult.alternates && predictionResult.alternates.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Alternative Matches</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {predictionResult.alternates.map((alt, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg" data-testid={`alt-match-${index}`}>
                                  <div>
                                    <p className="font-medium">{alt.species}</p>
                                    <p className="text-sm text-muted-foreground">{alt.commonName}</p>
                                  </div>
                                  <Badge variant="outline">
                                    {(alt.confidence * 100).toFixed(1)}%
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Button onClick={resetSpeciesAnalysis} className="w-full" data-testid="button-analyze-another">
                        Analyze Another Image
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

            <TabsContent value="otolith" className="space-y-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-orange-400" />
                    AI-Powered Otolith Analysis
                  </CardTitle>
                  <p className="text-slate-400">
                    Upload otolith images for automated age determination, species identification, and morphological analysis
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Upload Section */}
                  {!otolithImage && (
                    <div className="relative group">
                      <div className="bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 hover:border-orange-400/50 rounded-2xl p-12 text-center transition-all duration-300 group-hover:bg-white/10">
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                          <div className="absolute top-4 left-4 w-2 h-2 bg-orange-400/60 rounded-full animate-ping"></div>
                          <div className="absolute top-8 right-8 w-1 h-1 bg-yellow-400/60 rounded-full animate-pulse delay-300"></div>
                          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce delay-700"></div>
                        </div>
                        
                        <div className="relative z-10">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Microscope className="w-8 h-8 text-orange-400" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">Upload Otolith Image</h3>
                          <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Upload a high-resolution otolith image for comprehensive morphological and age analysis
                          </p>
                          
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleOtolithUpload}
                            className="hidden"
                            id="otolith-image-upload"
                            data-testid="input-otolith-image"
                          />
                          <label 
                            htmlFor="otolith-image-upload"
                            className="group/btn relative inline-flex items-center gap-3 cursor-pointer overflow-hidden bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/50 hover:border-orange-400/70 hover:from-orange-500/30 hover:to-yellow-500/30 backdrop-blur-xl transition-all duration-300 px-8 py-4 font-semibold hover:scale-105 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 rounded-xl"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                            
                            <div className="relative z-10 w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center group-hover/btn:rotate-12 transition-transform duration-300 shadow-lg">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                            
                            <div className="relative z-10 text-left">
                              <div className="text-white font-bold text-lg">Choose Otolith Image</div>
                              <div className="text-orange-200 text-sm font-normal">Upload for AI analysis</div>
                            </div>
                            
                            <div className="absolute inset-0 rounded-xl border-2 border-orange-400/0 group-hover/btn:border-orange-400/50 group-hover/btn:animate-pulse transition-all duration-300"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive Viewer */}
                  {otolithImage && (
                    <div className="space-y-6">
                      {/* Canvas Viewer */}
                      <div className="relative bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Interactive Otolith Viewer</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-orange-400 border-orange-400/50">
                              {otolithImage.name}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setOtolithImage(null);
                                setOtolithAnalysis(null);
                              }}
                            >
                              Change Image
                            </Button>
                          </div>
                        </div>

                        <div className="relative bg-black/30 rounded-xl overflow-hidden">
                          <canvas
                            ref={canvasRef}
                            className="w-full h-auto max-h-96 object-contain"
                            style={{ 
                              filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`,
                              transform: `rotate(${rotation[0]}deg) scale(${zoom[0] / 100})`
                            }}
                          />
                          
                          {/* Overlay Controls */}
                          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                            <div className="text-white text-sm font-mono">
                              Rotation: {rotation[0]}° | Zoom: {zoom[0]}%
                            </div>
                          </div>

                          {/* Control Buttons */}
                          <div className="absolute bottom-4 right-4 flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={toggleAutoRotation}
                              className={`${isAutoRotating ? 'bg-orange-500/20 text-orange-400' : ''}`}
                            >
                              {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setMeasurementMode(!measurementMode)}
                              className={`${measurementMode ? 'bg-green-500/20 text-green-400' : ''}`}
                            >
                              <Ruler className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setZoom([zoom[0] + 10])}
                            >
                              <ZoomIn className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setZoom([Math.max(50, zoom[0] - 10)])}
                            >
                              <ZoomOut className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Interactive Controls */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-slate-300">Rotation</Label>
                            <Slider
                              value={rotation}
                              onValueChange={setRotation}
                              max={360}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-slate-300">Zoom</Label>
                            <Slider
                              value={zoom}
                              onValueChange={setZoom}
                              min={50}
                              max={200}
                              step={5}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-slate-300">Brightness</Label>
                            <Slider
                              value={brightness}
                              onValueChange={setBrightness}
                              min={50}
                              max={150}
                              step={5}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-slate-300">Contrast</Label>
                            <Slider
                              value={contrast}
                              onValueChange={setContrast}
                              min={50}
                              max={150}
                              step={5}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Analysis Button */}
                        {!otolithAnalysis && !isAnalyzing && (
                          <div className="text-center mt-6">
                            <Button
                              onClick={analyzeOtolith}
                              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/20"
                            >
                              <Brain className="w-5 h-5 mr-2" />
                              Start AI Analysis
                            </Button>
                          </div>
                        )}

                        {/* Analysis Progress */}
                        {isAnalyzing && (
                          <Card className="mt-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/30">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center animate-spin">
                                  <Brain className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white">AI Analysis in Progress</h4>
                                  <p className="text-sm text-slate-400">Processing otolith morphology and features...</p>
                                </div>
                                <span className="text-lg font-bold text-orange-400">{analysisProgress}%</span>
                              </div>
                              <Progress value={analysisProgress} className="w-full h-3 bg-slate-700/50" />
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Analysis Results */}
                      {otolithAnalysis && !isAnalyzing && (
                        <div className="space-y-6">
                          {/* Main Results */}
                          <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
                            <CardHeader>
                              <CardTitle className="text-2xl font-bold text-orange-400 flex items-center gap-2">
                                <Microscope className="w-6 h-6" />
                                Otolith Analysis Results
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              {/* Species Identification */}
                              <div className="p-4 bg-slate-900/50 rounded-lg">
                                <h4 className="font-bold text-orange-400 mb-3">Species Identification</h4>
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <p className="font-semibold text-white text-lg">{otolithAnalysis.species.prediction}</p>
                                    <p className="text-slate-300">{otolithAnalysis.species.commonName}</p>
                                  </div>
                                  <Badge className="bg-green-500/20 text-green-400 border-green-400/50">
                                    {otolithAnalysis.species.confidence.toFixed(1)}% confidence
                                  </Badge>
                                </div>
                                {otolithAnalysis.species.alternates.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-slate-700">
                                    <p className="text-sm text-slate-400 mb-2">Alternative matches:</p>
                                    {otolithAnalysis.species.alternates.map((alt, idx) => (
                                      <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-slate-300">{alt.commonName}</span>
                                        <span className="text-slate-400">{alt.confidence.toFixed(1)}%</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Age Analysis */}
                              <div className="p-4 bg-slate-900/50 rounded-lg">
                                <h4 className="font-bold text-orange-400 mb-3">Age & Growth Analysis</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{otolithAnalysis.ageAnalysis.estimatedAge.toFixed(1)}</div>
                                    <div className="text-sm text-slate-400">Years</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{otolithAnalysis.ageAnalysis.growthRings}</div>
                                    <div className="text-sm text-slate-400">Growth Rings</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{otolithAnalysis.ageAnalysis.confidence.toFixed(1)}%</div>
                                    <div className="text-sm text-slate-400">Confidence</div>
                                  </div>
                                </div>
                                
                                {/* Growth Ring Details */}
                                <div className="mt-4 pt-4 border-t border-slate-700">
                                  <p className="text-sm text-slate-400 mb-2">Growth increment analysis:</p>
                                  <div className="space-y-1">
                                    {otolithAnalysis.features.increments.map((inc, idx) => (
                                      <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-slate-300">Ring {inc.ring} ({inc.season})</span>
                                        <span className="text-slate-400">{inc.width.toFixed(2)}mm width</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Measurements Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-slate-800/50 border-slate-700/50">
                                  <CardHeader>
                                    <CardTitle className="text-lg text-white">Physical Measurements</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Length:</span>
                                      <span className="font-mono text-white">{otolithAnalysis.measurements.length.toFixed(2)} mm</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Width:</span>
                                      <span className="font-mono text-white">{otolithAnalysis.measurements.width.toFixed(2)} mm</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Thickness:</span>
                                      <span className="font-mono text-white">{otolithAnalysis.measurements.thickness.toFixed(2)} mm</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Volume:</span>
                                      <span className="font-mono text-white">{otolithAnalysis.measurements.volume.toFixed(1)} mm³</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Perimeter:</span>
                                      <span className="font-mono text-white">{otolithAnalysis.measurements.perimeter.toFixed(1)} mm</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Area:</span>
                                      <span className="font-mono text-white">{otolithAnalysis.measurements.area.toFixed(1)} mm²</span>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-slate-800/50 border-slate-700/50">
                                  <CardHeader>
                                    <CardTitle className="text-lg text-white">Morphological Features</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Shape:</span>
                                      <span className="text-white">{otolithAnalysis.morphology.shape}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Surface:</span>
                                      <span className="text-white">{otolithAnalysis.morphology.surface}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Opacity:</span>
                                      <span className="text-white">{otolithAnalysis.morphology.opacity.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Symmetry:</span>
                                      <span className="text-white">{otolithAnalysis.morphology.symmetry.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Sulcus Type:</span>
                                      <span className="text-white capitalize">{otolithAnalysis.features.sulcus.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">Nucleus Position:</span>
                                      <span className="text-white">
                                        ({(otolithAnalysis.features.nucleus.x * 100).toFixed(0)}%, {(otolithAnalysis.features.nucleus.y * 100).toFixed(0)}%)
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-4 pt-4">
                                <Button
                                  onClick={() => {
                                    setOtolithImage(null);
                                    setOtolithAnalysis(null);
                                  }}
                                  className="flex-1"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Analyze Another Otolith
                                </Button>
                                <Button variant="outline" className="flex items-center gap-2">
                                  <Download className="w-4 h-4" />
                                  Export Results
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dna" className="space-y-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Dna className="w-5 h-5 text-purple-400" />
                    DNA Sequence Matcher
                  </CardTitle>
                  <p className="text-slate-400">
                    Input DNA sequences in FASTA format for species identification and phylogenetic analysis
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="dna-sequence" className="text-slate-300">DNA Sequence (FASTA format)</Label>
                    <Textarea
                      id="dna-sequence"
                      value={dnaSequence}
                      onChange={(e) => setDnaSequence(e.target.value)}
                      placeholder=">Sample_Sequence_1&#10;ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG&#10;TCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGA"
                      rows={8}
                      className="font-mono text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-400/50 focus:ring-purple-400/20 rounded-xl mt-2"
                      data-testid="textarea-dna-sequence"
                    />
                  </div>

                  {dnaMatchMutation.isPending && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Analyzing DNA sequence...</span>
                          <span className="text-sm text-muted-foreground">Processing</span>
                        </div>
                        <Progress value={75} className="w-full" data-testid="progress-dna-analysis" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Comparing against marine species database
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleDNAAnalysis}
                      disabled={dnaMatchMutation.isPending || !dnaSequence.trim()}
                      data-testid="button-analyze-dna"
                    >
                      <Dna className="w-4 h-4 mr-2" />
                      {dnaMatchMutation.isPending ? 'Analyzing...' : 'Analyze DNA'}
                    </Button>
                    <Button variant="outline" onClick={resetDNAAnalysis} data-testid="button-clear-dna">
                      Clear
                    </Button>
                  </div>

                  {dnaMatches && dnaMatches.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>DNA Matches</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {dnaMatches.map((match, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`dna-match-${index}`}>
                              <div>
                                <p className="font-medium">{match.species}</p>
                                <p className="text-sm text-muted-foreground">{match.commonName}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={
                                  match.similarity > 95 ? 'bg-green-500/20 text-green-400' :
                                  match.similarity > 90 ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }>
                                  {match.similarity.toFixed(1)}% Match
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
