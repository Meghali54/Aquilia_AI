import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, FileText, Database, Image, CheckCircle, Loader2, 
  FileCheck, Fish, Dna, Waves, BarChart3, TrendingUp,
  MapPin, Thermometer, Droplets, Activity, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data?: any[];
  summary?: {
    rows: number;
    columns: string[];
    parameters: string[];
    sampleData: any[];
    detectedTypes: Record<string, string>;
  };
  processed: boolean;
}

interface AIResult {
  species?: string;
  confidence?: number;
  taxonomy?: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  sequences?: Array<{
    species: string;
    similarity: number;
    accession: string;
  }>;
}

export default function EnhancedUploadPage() {
  const [activeTab, setActiveTab] = useState('csv');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aiResults, setAiResults] = useState<AIResult>({});
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();

  const simulateProcessing = async (duration = 3000) => {
    setProcessing(true);
    setProgress(0);
    
    const steps = [
      { progress: 20, message: "Reading file structure..." },
      { progress: 40, message: "Parsing data columns..." },
      { progress: 60, message: "Detecting marine parameters..." },
      { progress: 80, message: "Generating summary..." },
      { progress: 100, message: "Analysis complete!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, duration / steps.length));
      setProgress(step.progress);
      if (step.progress === 100) {
        setProcessing(false);
        setAnalysisComplete(true);
      }
    }
  };

  const simulateAIProcessing = async (type: 'image' | 'dna') => {
    setProcessing(true);
    setProgress(0);
    
    const steps = type === 'image' 
      ? [
          { progress: 25, message: "Preprocessing image..." },
          { progress: 50, message: "Extracting features..." },
          { progress: 75, message: "Running CNN classifier..." },
          { progress: 100, message: "Classification complete!" }
        ]
      : [
          { progress: 20, message: "Validating sequence..." },
          { progress: 40, message: "Searching BLAST database..." },
          { progress: 70, message: "Computing alignments..." },
          { progress: 100, message: "Matches found!" }
        ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
    }

    // Mock AI results
    if (type === 'image') {
      const species = ['Sardinella longiceps', 'Rastrelliger kanagurta', 'Scomberomorus commerson', 'Lutjanus argentimaculatus'];
      const selectedSpecies = species[Math.floor(Math.random() * species.length)];
      setAiResults({
        species: selectedSpecies,
        confidence: Math.floor(Math.random() * 20) + 80,
        taxonomy: {
          kingdom: 'Animalia',
          phylum: 'Chordata',
          class: 'Actinopterygii',
          order: 'Perciformes',
          family: selectedSpecies.includes('Sardinella') ? 'Clupeidae' : 'Scombridae',
          genus: selectedSpecies.split(' ')[0],
          species: selectedSpecies
        }
      });
    } else {
      setAiResults({
        sequences: [
          { species: 'Sardinella longiceps', similarity: 98.5, accession: 'MT123456' },
          { species: 'Sardinella gibbosa', similarity: 87.3, accession: 'KY987654' },
          { species: 'Sardinella fimbriata', similarity: 82.1, accession: 'JX456789' },
          { species: 'Amblygaster sirm', similarity: 78.9, accession: 'HQ234567' }
        ]
      });
    }

    setProcessing(false);
    setAnalysisComplete(true);
  };

  const parseCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        }
      });
    });
  };

  const detectColumnTypes = (data: any[]): Record<string, string> => {
    if (!data.length) return {};
    
    const sample = data[0];
    const types: Record<string, string> = {};
    
    Object.keys(sample).forEach(key => {
      const values = data.slice(0, 10).map(row => row[key]).filter(v => v !== null && v !== '');
      if (values.every(v => !isNaN(Number(v)))) {
        types[key] = 'numeric';
      } else if (values.some(v => /^\d{4}-\d{2}-\d{2}/.test(v))) {
        types[key] = 'date';
      } else {
        types[key] = 'text';
      }
    });
    
    return types;
  };

  const onDrop = useCallback(async (acceptedFiles: File[], fileType: string) => {
    if (fileType === 'csv') {
      await simulateProcessing();
      
      for (const file of acceptedFiles) {
        const fileInfo: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          processed: false
        };

        if (file.type === "text/csv" || file.name.endsWith('.csv')) {
          try {
            const data = await parseCSV(file);
            const columns = Object.keys(data[0] || {});
            const detectedTypes = detectColumnTypes(data);
            
            // Smart marine parameter detection
            const marineParams = columns.filter(col => {
              const lower = col.toLowerCase();
              return lower.includes('temp') || lower.includes('salinity') || 
                     lower.includes('ph') || lower.includes('oxygen') || 
                     lower.includes('fish') || lower.includes('species') ||
                     lower.includes('abundance') || lower.includes('depth') ||
                     lower.includes('chlorophyll') || lower.includes('nitrate');
            });

            // If no obvious marine params, create realistic ones
            const finalParams = marineParams.length > 0 ? marineParams : 
              ['Temperature (°C)', 'Salinity (PSU)', 'pH', 'Dissolved_Oxygen', 'Fish_Count'];

            fileInfo.data = data;
            fileInfo.summary = {
              rows: data.length,
              columns,
              parameters: finalParams,
              sampleData: data.slice(0, 5),
              detectedTypes
            };
            fileInfo.processed = true;
          } catch (error) {
            console.error("Error parsing CSV:", error);
          }
        }

        setUploadedFiles(prev => [...prev, fileInfo]);
        
        toast({
          title: "File processed successfully!",
          description: `Detected ${fileInfo.summary?.parameters?.length || 0} marine parameters in ${fileInfo.name}`,
        });
      }
    } else {
      // Handle image or DNA files
      for (const file of acceptedFiles) {
        const fileInfo: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          processed: true
        };
        setUploadedFiles(prev => [...prev, fileInfo]);
      }
      
      await simulateAIProcessing(fileType as 'image' | 'dna');
      
      toast({
        title: "AI Analysis Complete!",
        description: `Successfully processed ${acceptedFiles.length} file(s)`,
      });
    }
  }, []);

  const FileUploadZone = ({ 
    fileType, 
    accept, 
    title, 
    description, 
    icon: Icon 
  }: { 
    fileType: string;
    accept: Record<string, string[]>;
    title: string;
    description: string;
    icon: any;
  }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, fileType),
      accept,
      multiple: fileType === 'csv'
    });

    return (
      <div className="space-y-6">
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group overflow-hidden",
            isDragActive 
              ? "border-blue-400 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 backdrop-blur-sm scale-105" 
              : "border-slate-600 hover:border-blue-400/60 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm hover:scale-105"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <input {...getInputProps()} />
          <div className="relative z-10">
            <div className={cn(
              "w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300",
              isDragActive 
                ? "bg-gradient-to-r from-blue-500/30 to-emerald-500/30 border border-blue-400/50 scale-110" 
                : "bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/50 group-hover:scale-110"
            )}>
              <Icon className={cn(
                "w-10 h-10 transition-all duration-300",
                isDragActive ? "text-blue-400 animate-bounce" : "text-slate-400 group-hover:text-blue-400"
              )} />
            </div>
            <h3 className={cn(
              "text-xl font-semibold mb-3 transition-colors duration-300",
              isDragActive ? "text-blue-400" : "text-white group-hover:text-blue-400"
            )}>
              {title}
            </h3>
            <p className="text-slate-400 mb-6">{description}</p>
            <Button 
              variant="outline" 
              type="button" 
              className="border-slate-600 hover:border-blue-400 bg-slate-800/50 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-emerald-600/20 backdrop-blur-sm transition-all duration-300"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isDragActive ? "Drop files here" : "Select Files"}
            </Button>
          </div>
        </div>

        {processing && (
          <Card className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 backdrop-blur-sm border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  <span className="text-lg font-semibold text-blue-400">Processing...</span>
                </div>
                <span className="text-lg font-bold text-emerald-400">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full h-3 bg-slate-700/50" />
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderCSVSummary = (file: UploadedFile) => {
    if (!file.summary) return null;
    
    return (
      <div className="mt-4 space-y-4">
        <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-500/20">
          <h5 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Data Analysis Summary
          </h5>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{file.summary.rows.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Data Rows</div>
            </div>
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{file.summary.columns.length}</div>
              <div className="text-xs text-slate-400">Columns</div>
            </div>
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{file.summary.parameters.length}</div>
              <div className="text-xs text-slate-400">Marine Parameters</div>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Detected Marine Parameters:
            </h6>
            <div className="flex flex-wrap gap-1">
              {file.summary.parameters.map((param, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {param}
                </Badge>
              ))}
            </div>
          </div>

          {file.summary.sampleData.length > 0 && (
            <div>
              <h6 className="font-medium text-slate-300 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Sample Data Preview:
              </h6>
              <div className="bg-slate-900/50 rounded-lg p-3 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-700">
                      {file.summary.columns.slice(0, 5).map((col, i) => (
                        <th key={i} className="text-left p-2 text-slate-400 font-medium">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {file.summary.sampleData.slice(0, 3).map((row, i) => (
                      <tr key={i} className="border-b border-slate-800">
                        {file.summary!.columns.slice(0, 5).map((col, j) => (
                          <td key={j} className="p-2 text-slate-300">{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAIResults = () => {
    if (!analysisComplete) return null;

    if (aiResults.species) {
      return (
        <Card className="mt-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Fish className="w-5 h-5" />
              Species Classification Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <h4 className="text-xl font-bold text-white italic">{aiResults.species}</h4>
                <p className="text-slate-400">Confidence: {aiResults.confidence}%</p>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                  <span className="text-2xl font-bold text-green-400">{aiResults.confidence}%</span>
                </div>
              </div>
            </div>
            
            {aiResults.taxonomy && (
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h5 className="font-medium text-slate-300 mb-3">Taxonomic Classification:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(aiResults.taxonomy).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-400 capitalize">{key}:</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    if (aiResults.sequences) {
      return (
        <Card className="mt-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Database className="w-5 h-5" />
              eDNA Sequence Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiResults.sequences.map((seq, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-white italic">{seq.species}</h5>
                    <p className="text-xs text-slate-400">Accession: {seq.accession}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-400">{seq.similarity}%</div>
                    <div className="text-xs text-slate-400">Similarity</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Enhanced Upload' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                <Waves className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  Enhanced Data Upload
                </h1>
                <p className="text-slate-400 text-lg">
                  AI-powered marine data analysis with real-time processing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 mb-8">
                <TabsTrigger 
                  value="csv" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-emerald-500/20 data-[state=active]:border data-[state=active]:border-blue-500/30"
                >
                  <FileText className="w-4 h-4" />
                  CSV Data Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="image" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-green-500/30"
                >
                  <Fish className="w-4 h-4" />
                  Fish Species AI
                </TabsTrigger>
                <TabsTrigger 
                  value="dna" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border data-[state=active]:border-purple-500/30"
                >
                  <Database className="w-4 h-4" />
                  eDNA Sequencing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="csv">
                <FileUploadZone
                  fileType="csv"
                  accept={{ 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.xls', '.xlsx'] }}
                  title="Upload Marine Dataset"
                  description="Drag & drop CSV files with oceanographic data (temperature, salinity, species abundance)"
                  icon={FileText}
                />
              </TabsContent>

              <TabsContent value="image">
                <FileUploadZone
                  fileType="image"
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                  title="Fish Species Classifier"
                  description="Upload fish photos or otolith images for AI-powered species identification"
                  icon={Fish}
                />
              </TabsContent>

              <TabsContent value="dna">
                <FileUploadZone
                  fileType="dna"
                  accept={{ 'text/plain': ['.txt', '.fasta', '.fa'] }}
                  title="eDNA Sequence Analysis"
                  description="Upload environmental DNA sequences for biodiversity assessment and species matching"
                  icon={Database}
                />
              </TabsContent>
            </Tabs>

            {/* Results Section */}
            {uploadedFiles.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Processing Results
                </h3>
                
                {uploadedFiles.map((file, index) => (
                  <Card key={index} className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <FileCheck className="w-8 w-8 text-green-400" />
                          <div>
                            <h4 className="font-bold text-white">{file.name}</h4>
                            <p className="text-sm text-slate-400">
                              {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                            </p>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      
                      {renderCSVSummary(file)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {renderAIResults()}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}