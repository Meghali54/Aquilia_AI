import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Upload, FileText, Dna, Fish, CloudUpload, Waves, Sparkles, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface UploadData {
  name: string;
  type: string;
  location: string;
  description: string;
  files: File[];
}

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState('ocean');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (data: Omit<UploadData, 'files'> & { size: string }) => {
      const response = await apiRequest('POST', '/api/upload', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload successful",
        description: "Your data has been uploaded and is being processed.",
      });
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload data",
        variant: "destructive",
      });
      setUploading(false);
      setUploadProgress(0);
    },
  });

  const handleUpload = (data: UploadData) => {
    setUploading(true);
    setUploadProgress(10);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const totalSize = data.files.reduce((acc, file) => acc + file.size, 0);
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(1);

    uploadMutation.mutate({
      name: data.name,
      type: data.type,
      location: data.location,
      description: data.description,
      size: `${sizeInMB} MB`,
    });
  };

  const FileUploadZone = ({ onDrop, accept }: { onDrop: (files: File[]) => void; accept: string }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { [accept]: [] },
      multiple: true,
    });

    return (
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group overflow-hidden",
          isDragActive 
            ? "border-blue-400 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 backdrop-blur-sm scale-105" 
            : "border-slate-600 hover:border-blue-400/60 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm hover:scale-105"
        )}
        data-testid="dropzone-upload"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-emerald-400/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <input {...getInputProps()} />
        <div className="relative z-10">
          <div className={cn(
            "w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300",
            isDragActive 
              ? "bg-gradient-to-r from-blue-500/30 to-emerald-500/30 border border-blue-400/50 scale-110" 
              : "bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/50 group-hover:scale-110"
          )}>
            <CloudUpload className={cn(
              "w-10 h-10 transition-all duration-300",
              isDragActive ? "text-blue-400 animate-bounce" : "text-slate-400 group-hover:text-blue-400"
            )} />
          </div>
          <p className={cn(
            "text-xl font-semibold mb-3 transition-colors duration-300",
            isDragActive ? "text-blue-400" : "text-white group-hover:text-blue-400"
          )}>
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-slate-400 mb-6">or click to select files</p>
          <Button 
            variant="outline" 
            type="button" 
            className="border-slate-600 hover:border-blue-400 bg-slate-800/50 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-emerald-600/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105" 
            data-testid="button-select-files"
          >
            <Upload className="w-4 h-4" />
            Select Files
          </Button>
        </div>
      </div>
    );
  };

  const UploadForm = ({ type }: { type: string }) => {
    const [formData, setFormData] = useState<UploadData>({
      name: '',
      type,
      location: '',
      description: '',
      files: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.location || formData.files.length === 0) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields and select files to upload.",
          variant: "destructive",
        });
        return;
      }
      handleUpload(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-8">
        <FileUploadZone
          onDrop={(files) => setFormData(prev => ({ ...prev, files }))}
          accept="*/*"
        />

        {formData.files.length > 0 && (
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Selected Files
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors duration-300" data-testid={`file-${index}`}>{file.name}</span>
                    </div>
                    <span className="text-sm text-slate-400 font-medium">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300 font-medium">Dataset Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter dataset name"
              required
              className="bg-slate-800/50 border-slate-600 focus:border-blue-400 text-white placeholder:text-slate-500 backdrop-blur-sm transition-all duration-300"
              data-testid="input-dataset-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-300 font-medium">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Pacific Ocean, California Coast"
              required
              className="bg-slate-800/50 border-slate-600 focus:border-blue-400 text-white placeholder:text-slate-500 backdrop-blur-sm transition-all duration-300"
              data-testid="input-location"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-slate-300 font-medium">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your dataset..."
            rows={4}
            className="bg-slate-800/50 border-slate-600 focus:border-blue-400 text-white placeholder:text-slate-500 backdrop-blur-sm transition-all duration-300 resize-none"
            data-testid="textarea-description"
          />
        </div>

        {uploading && (
          <Card className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 backdrop-blur-sm border-blue-500/30 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400 animate-spin" />
                  <span className="text-lg font-semibold text-blue-400">Uploading...</span>
                </div>
                <span className="text-lg font-bold text-emerald-400">{uploadProgress}%</span>
              </div>
              <Progress 
                value={uploadProgress} 
                className="w-full h-3 bg-slate-700/50" 
                data-testid="progress-upload"
              />
              <p className="text-sm text-slate-400 mt-3">Processing your marine research data...</p>
            </CardContent>
          </Card>
        )}

        <Button 
          type="submit" 
          disabled={uploading} 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed" 
          data-testid="button-upload"
        >
          {uploading ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <CloudUpload className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Upload Dataset
            </>
          )}
        </Button>
      </form>
    );
  };

  const uploadTabs = [
    { 
      id: 'ocean', 
      label: 'Ocean Data', 
      icon: Upload, 
      type: 'Ocean Data',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400'
    },
    { 
      id: 'fish', 
      label: 'Fish Data', 
      icon: Fish, 
      type: 'Fish Data',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400'
    },
    { 
      id: 'otoliths', 
      label: 'Otoliths', 
      icon: FileText, 
      type: 'Otolith Data',
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400'
    },
    { 
      id: 'edna', 
      label: 'eDNA', 
      icon: Dna, 
      type: 'eDNA',
      gradient: 'from-orange-500/20 to-yellow-500/20',
      borderColor: 'border-orange-500/30',
      iconColor: 'text-orange-400'
    },
  ];

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Upload Data' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 max-w-5xl mx-auto relative">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Enhanced Header Section */}
        <div className="mb-10 relative">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 overflow-hidden group hover:border-slate-600/50 transition-all duration-300">
            {/* Ocean Wave Animation */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
                <path d="M0 100 Q100 80, 200 100 T400 100 V200 H0 Z" fill="url(#uploadWaveGrad1)">
                  <animate attributeName="d" values="M0 100 Q100 80, 200 100 T400 100 V200 H0 Z;M0 100 Q100 120, 200 100 T400 100 V200 H0 Z;M0 100 Q100 80, 200 100 T400 100 V200 H0 Z" dur="6s" repeatCount="indefinite"/>
                </path>
                <path d="M0 120 Q150 100, 300 120 T400 120 V200 H0 Z" fill="url(#uploadWaveGrad2)" opacity="0.7">
                  <animate attributeName="d" values="M0 120 Q150 100, 300 120 T400 120 V200 H0 Z;M0 120 Q150 140, 300 120 T400 120 V200 H0 Z;M0 120 Q150 100, 300 120 T400 120 V200 H0 Z" dur="8s" repeatCount="indefinite"/>
                </path>
                <defs>
                  <linearGradient id="uploadWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1"/>
                  </linearGradient>
                  <linearGradient id="uploadWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                <Waves className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">Upload Data</h1>
                <p className="text-slate-400 text-lg">
                  Upload your marine research data for analysis and processing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Card */}
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-2xl">
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700/50 rounded-xl p-0.5 mb-8 gap-0.5" data-testid="tabs-upload-types">
                {uploadTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className={cn(
                        "flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg transition-all duration-300 font-medium text-xs min-w-0 flex-1",
                        isActive 
                          ? `bg-gradient-to-r ${tab.gradient} border ${tab.borderColor} text-white shadow-lg` 
                          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                      )}
                      data-testid={`tab-${tab.id}`}
                    >
                      <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? tab.iconColor : "text-slate-500")} />
                      <span className="truncate text-xs leading-tight">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {uploadTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-8">
                  <div className="mb-8 p-6 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${tab.gradient} rounded-lg flex items-center justify-center border ${tab.borderColor}`}>
                        <tab.icon className={`w-5 h-5 ${tab.iconColor}`} />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{tab.label} Upload</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {tab.id === 'ocean' && "Upload oceanographic data including temperature, salinity, and current measurements."}
                      {tab.id === 'fish' && "Upload fish population data, catch records, and biological measurements."}
                      {tab.id === 'otoliths' && "Upload otolith images and morphological data for age and growth analysis."}
                      {tab.id === 'edna' && "Upload environmental DNA samples for biodiversity assessment."}
                    </p>
                  </div>
                  <UploadForm type={tab.type} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
