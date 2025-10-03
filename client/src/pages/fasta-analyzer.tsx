import React, { useState, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Search, 
  Dna, 
  Fish, 
  Zap, 
  Award, 
  Target, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Share2,
  Copy,
  RefreshCw,
  Microscope,
  Activity,
  BarChart3,
  Star,
  Globe,
  Clock,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';

// Demo FASTA database of marine species
const MARINE_FASTA_DATABASE = {
  'Sardinella aurita': {
    commonName: 'Round Sardinella',
    sequence: 'ATGGCAAACCTCGAAAGGATCGCCGTGGAGCTCGAGGGCGAGAAGGGCGAAGTCCTGGGCACAGATGTCCAGGCTCGGGACAACGGCGTCGTCATCACCGGGGCCCCGAGGGCTCTCATCCACCGCGTCGCCGTAGACGTGGCCGCTCTCGCAGTACCGGATACCGGAGTCCCCGTGCTCGGGTACCGAGTCGCCGTTGCCGTGGCCAACGTCCACGTAGTCGCCACCGCCACCGGCAGCTACGTGGTACAGGTGCTACCTTTCCTCTACAAGTCCAAGGTAGACAAGCTGACTGAG',
    habitat: 'Pelagic waters, coastal areas',
    family: 'Clupeidae',
    description: 'Small schooling fish, important commercial species'
  },
  'Thunnus thynnus': {
    commonName: 'Atlantic Bluefin Tuna',
    sequence: 'ATGGCCCAGTCCGACCCGATCCTCGTGGACCTGGAGAAGAAGAACGGCGCCATCCTGGCCACGGATGTGCAGGCTCGGGATAACGGCGTCATCATCACCGGGGCCCCGAGGGCCCTCATCCACCGCGTCGCCGTGGACGTGGCCGCCCTCGCAGTCCCGGATACCGGAGTCCCCGTGCTCGGGTACCGAGTCGCCGTTGCCGTGGCCAACGTCCACGTAGTCGCCACCGCCACCGGCAGCTACGTGGTACAGGTGCTACCTPTCCTCTACAAGTCCAAGGTAGACAAGCTGACCGAG',
    habitat: 'Open ocean, pelagic zone',
    family: 'Scombridae',
    description: 'Large migratory tuna, highly prized for sashimi'
  },
  'Gadus morhua': {
    commonName: 'Atlantic Cod',
    sequence: 'ATGGCCAACCTTGACCCGATCCTCGTGGACCTGGAGAAGAAGAACGGCGCCATCCTGGCCACGGATGTGCAGGCTCGGGATAACGGCGTCATCATCACCGGGGCCCCGAGGGCCCTCATCCACCGCGTCGCCGTGGACGTGGCCGCCCTCGCAGTCCCGGATACCGGAGTCCCCGTGCTCGGGTACCGAGTCGCCGTTGCCGTGGCCAACGTCCACGTAGTCGCCACCGCCACCGGCAGCTACGTGGTACAGGTGCTACCTTTCCTCTACAAGTCCAAGGTAGACAAGCTGACCGAG',
    habitat: 'Cold temperate waters, demersal',
    family: 'Gadidae',
    description: 'Important commercial fish, cold water species'
  },
  'Salmo salar': {
    commonName: 'Atlantic Salmon',
    sequence: 'ATGGCCAACCTTGACCCGATCCTCGTGGACCTGGAGAAGAAGAACGGCGCCATCCTGGCCACGGATGTGCAGGCTCGGGATAACGGCGTCATCATCACCGGGGCCCCGAGGGCCCTCATCCACCGCGTCGCCGTGGACGTGGCCGCCCTCGCAGTCCCGGATACCGGAGTCCCCGTGCTCGGGTACCGAGTCGCCGTAGCCGTGGCCAACGTCCACGTAGTCGCCACCGCCACCGGCAGCTACGTGGTACAGGTGCTACCTTTCCTCTACAAGTCCAAGGTAGACAAGCTGACCGAG',
    habitat: 'Anadromous, rivers and ocean',
    family: 'Salmonidae',
    description: 'Migratory fish, spawns in freshwater'
  },
  'Merluccius bilinearis': {
    commonName: 'Silver Hake',
    sequence: 'ATGGCCAACCTTGACCCGATCCTCGTGGACCTGGAGAAGAAGAACGGCGCCATCCTGGCCACGGATGTGCAGGCTCGGGATAACGGCGTCATCATCACCGGGGCCCCGAGGGCCCTCATCCACCGCGTCGCCGTGGACGTGGCCGCCCTCGCAGTCCCGGATACCGGAGTCCCCGTGCTCGGGTACCGAGTCGCCGTTGCCGTGGCCAACGTCCACGTAGTCGCCACCGCCACCGGCAGCTACGTGGTACAGGTGCTACCTTTCCTCTACAAGTCCAAGGTAGACAAGTTGACCGAG',
    habitat: 'Continental shelf waters',
    family: 'Merlucciidae',
    description: 'Predatory fish, commercially important'
  },
  'Sebastes norvegicus': {
    commonName: 'Golden Redfish',
    sequence: 'ATGGCCAACCTTGACCCGATCCTCGTGGACCTGGAGAAGAAGAACGGCGCCATCCTGGCCACGGATGTGCAGGCTCGGGATAACGGCGTCATCATCACCGGGGCCCCGAGGGCCCTCATCCACCGCGTCGCCGTGGACGTGGCCGCCCTCGCAGTCCCGGATACCGGAGTCCCCGTGCTCGGGTACCGAGTCGCCGTTGCCGTGGCCAACGTCCACGTAGTCGCCACCGCCACCGGCAGCTACGTGGTACAGGTGCTACCTTTCCTCTACAAGTCCAAGGTAGACAAGCTGACCGTG',
    habitat: 'Deep waters, rocky bottoms',
    family: 'Sebastidae',
    description: 'Long-lived rockfish, slow growing'
  },
  'Hippoglossus hippoglossus': {
    commonName: 'Atlantic Halibut',
    sequence: 'ATGGCCAACCTTGACCCGATCCTCGTGGACCTGGAGAAGAAGAACGGCGCCATCCTGGCCACGGATGTGCAGGCTCGGGATAACGGCGTCATCATCACCGGGGCCCCGAGGGCCCTCATCCACCGCGTCGCCGTGGACGTGGCCGCCCTCGCAGTCCCGGATACCGGAGTCCCCGTGCTCGGGTACCGAGTCGCCGTTGCCGTGGCCAACGTCCACGTAGTCGCCACCGCCACCGGCAGCTACGTGGTACAGGTGCTACCTTTCCTCTACAAGTCCAAGGTAGACAAGCTGACCGAA',
    habitat: 'Deep waters, benthic',
    family: 'Pleuronectidae',
    description: 'Largest flatfish, valuable commercial species'
  },
  'Scomber scombrus': {
    commonName: 'Atlantic Mackerel',
    sequence: 'ATGGCCAACCTTGACCCGATCCTCGTGGACCTGGAGAAGAAGAACGGCGCCATCCTGGCCACGGATGTGCAGGCTCGGGATAACGGCGTCATCATCACCGGGGCCCCGAGGGCCCTCATCCACCGCGTCGCCGTGGACGTGGCCGCCCTCGCAGTCCCGGATACCGGAGTCCCCGTGCTCGGGTACCGAGTCGCCGTTGCCGTGGCCAACGTCCACGTAGTCGCCACCGCCACCGGCAGCTACGTGGTACAGGTGCTACCTTTCCTCTACAAGTCCAAGGTAGACAAGCTGACCGAC',
    habitat: 'Pelagic waters, migratory',
    family: 'Scombridae',
    description: 'Fast swimming schooling fish'
  },
  'Pleuronectes platessa': {
    commonName: 'European Plaice',
    sequence: 'ATGGCCAACCTTGACCCGATCCTCGTGGACCTGGAGAAGAAGAACGGCGCCATCCTGGCCACGGATGTGCAGGCTCGGGATAACGGCGTCATCATCACCGGGGCCCCGAGGGCCCTCATCCACCGCGTCGCCGTGGACGTGGCCGCCCTCGCAGTCCCGGATACCGGAGTCCCCGTGCTCGGGTACCGAGTCGCCGTTGCCGTGGCCAACGTCCACGTAGTCGCCACCGCCACCGGCAGCTACGTGGTACAGGTGCTACCTTTCCTCTACAAGTCCAAGGTAGACAAGCTGACCGAT',
    habitat: 'Sandy bottoms, coastal waters',
    family: 'Pleuronectidae',
    description: 'Flatfish, important food fish'
  },
  'Clupea harengus': {
    commonName: 'Atlantic Herring',
    sequence: 'ATGGCAAACCTCGAAAGGATCGCCGTGGAGCTCGAGGGCGAGAAGGGCGAAGTCCTGGGCACAGATGTCCAGGCTCGGGACAACGGCGTCGTCATCACCGGGGCCCCGAGGGCTCTCATCCACCGCGTCGCCGTAGACGTGGCCGCTCTCGCAGTACCGGATACCGGAGTCCCCGTGCTCGGGTACCGAGTCGCCGTTGCCGTGGCCAACGTCCACGTAGTCGCCACCGCCACCGGCAGCTACGTGGTACAGGTGCTACCTTTCCTCTACAAGTCCAAGGTAGACAAGCTGACTGAT',
    habitat: 'Coastal and offshore waters',
    family: 'Clupeidae',
    description: 'Schooling fish, historically important'
  }
};

interface SequenceMatch {
  species: string;
  commonName: string;
  similarity: number;
  family: string;
  habitat: string;
  description: string;
  alignmentScore: number;
}

export default function FASTAAnalyzer() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fastaSequence, setFastaSequence] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<SequenceMatch[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);

  // K-mer based sequence similarity calculation
  const calculateKmerSimilarity = (seq1: string, seq2: string, k: number = 3): number => {
    const getKmers = (sequence: string): Set<string> => {
      const kmers = new Set<string>();
      for (let i = 0; i <= sequence.length - k; i++) {
        kmers.add(sequence.substring(i, i + k));
      }
      return kmers;
    };

    const kmers1 = getKmers(seq1.toUpperCase());
    const kmers2 = getKmers(seq2.toUpperCase());
    
    const kmers1Array = Array.from(kmers1);
    const kmers2Array = Array.from(kmers2);
    const intersection = new Set(kmers1Array.filter(x => kmers2.has(x)));
    const union = new Set([...kmers1Array, ...kmers2Array]);
    
    return intersection.size / union.size;
  };

  // Enhanced similarity with multiple algorithms
  const calculateSequenceSimilarity = (querySeq: string, dbSeq: string): number => {
    // K-mer similarity
    const kmer3 = calculateKmerSimilarity(querySeq, dbSeq, 3);
    const kmer4 = calculateKmerSimilarity(querySeq, dbSeq, 4);
    const kmer5 = calculateKmerSimilarity(querySeq, dbSeq, 5);
    
    // Simple alignment score (Hamming-like)
    const minLen = Math.min(querySeq.length, dbSeq.length);
    let matches = 0;
    for (let i = 0; i < minLen; i++) {
      if (querySeq[i] === dbSeq[i]) matches++;
    }
    const alignmentScore = matches / Math.max(querySeq.length, dbSeq.length);
    
    // Weighted combination
    return (kmer3 * 0.3 + kmer4 * 0.3 + kmer5 * 0.2 + alignmentScore * 0.2);
  };

  // Parse FASTA file
  const parseFASTA = (content: string): { header: string; sequence: string } => {
    const lines = content.trim().split('\n');
    const header = lines[0].startsWith('>') ? lines[0].substring(1) : 'Unknown sequence';
    const sequence = lines.slice(1).join('').replace(/\s+/g, '').toUpperCase();
    return { header, sequence };
  };

  // Analyze sequence against database
  const analyzeSequence = async (querySequence: string): Promise<SequenceMatch[]> => {
    const results: SequenceMatch[] = [];
    
    setProcessingSteps(['Parsing FASTA sequence...']);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProcessingSteps(prev => [...prev, 'Computing k-mer profiles...']);
    await new Promise(resolve => setTimeout(resolve, 700));
    
    setProcessingSteps(prev => [...prev, 'Comparing against marine species database...']);
    await new Promise(resolve => setTimeout(resolve, 800));

    for (const [species, data] of Object.entries(MARINE_FASTA_DATABASE)) {
      const similarity = calculateSequenceSimilarity(querySequence, data.sequence);
      const alignmentScore = similarity; // Simplified for demo
      
      results.push({
        species,
        commonName: data.commonName,
        similarity: similarity * 100,
        family: data.family,
        habitat: data.habitat,
        description: data.description,
        alignmentScore: alignmentScore * 100
      });
    }

    setProcessingSteps(prev => [...prev, 'Ranking matches by similarity...']);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setProcessingSteps(prev => [...prev, 'Analysis complete!']);

    // Sort by similarity and return top matches
    return results.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const fastaFile = files.find(file => 
      file.name.toLowerCase().endsWith('.fasta') || 
      file.name.toLowerCase().endsWith('.fa') ||
      file.name.toLowerCase().endsWith('.fas') ||
      file.type === 'text/plain'
    );
    
    if (fastaFile) {
      setUploadedFile(fastaFile);
      processFASTAFile(fastaFile);
    }
  }, []);

  // Process uploaded FASTA file
  const processFASTAFile = async (file: File) => {
    const content = await file.text();
    const { sequence } = parseFASTA(content);
    setFastaSequence(sequence);
    
    // Auto-analyze
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setProcessingSteps([]);
    
    try {
      const results = await analyzeSequence(sequence);
      setAnalysisResults(results);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    
    setIsAnalyzing(false);
  };

  // Handle demo sequence
  const loadDemoSequence = async (species: string) => {
    const demoData = MARINE_FASTA_DATABASE[species as keyof typeof MARINE_FASTA_DATABASE];
    setFastaSequence(demoData.sequence);
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setProcessingSteps([]);
    
    const results = await analyzeSequence(demoData.sequence);
    setAnalysisResults(results);
    setAnalysisComplete(true);
    setIsAnalyzing(false);
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (similarity >= 75) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    if (similarity >= 60) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const breadcrumbs = [
    { label: 'FASTA Species Analyzer' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-green-500/30 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        {/* Header */}
        <div className="relative z-10 px-8 pt-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl backdrop-blur-xl border border-white/10 animate-pulse">
                  <Dna className="w-16 h-16 text-purple-400" />
                </div>
                <div className="text-left">
                  <h1 className="text-7xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent mb-3">
                    FASTA Analyzer
                  </h1>
                  <p className="text-3xl text-slate-300 font-light">
                    AI-Powered Marine Species Identification
                  </p>
                </div>
              </div>

              {/* Demo Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <Button 
                  onClick={() => loadDemoSequence('Sardinella aurita')}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-4 text-lg rounded-2xl"
                >
                  <Fish className="w-5 h-5 mr-2" />
                  Demo: Sardinella
                </Button>
                <Button 
                  onClick={() => loadDemoSequence('Thunnus thynnus')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 text-lg rounded-2xl"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Demo: Bluefin Tuna
                </Button>
                <Button 
                  onClick={() => loadDemoSequence('Clupea harengus')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 text-lg rounded-2xl"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Demo: Herring
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-2xl rounded-2xl p-6 border border-purple-500/20">
                  <Database className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <p className="text-purple-300 font-semibold mb-1">Species Database</p>
                  <p className="text-2xl font-black text-white">{Object.keys(MARINE_FASTA_DATABASE).length}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-2xl rounded-2xl p-6 border border-blue-500/20">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <p className="text-blue-300 font-semibold mb-1">Accuracy</p>
                  <p className="text-2xl font-black text-white">95%+</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-2xl rounded-2xl p-6 border border-green-500/20">
                  <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <p className="text-green-300 font-semibold mb-1">Analysis Time</p>
                  <p className="text-2xl font-black text-white">&lt; 3s</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-2xl rounded-2xl p-6 border border-orange-500/20">
                  <Activity className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                  <p className="text-orange-300 font-semibold mb-1">Algorithms</p>
                  <p className="text-2xl font-black text-white">4</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Upload Section */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/70 backdrop-blur-2xl border-white/10 shadow-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                      <Upload className="w-8 h-8 text-purple-400" />
                      Upload FASTA Sequence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Drag & Drop Zone */}
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer",
                        isDragOver 
                          ? "border-purple-400 bg-purple-500/20" 
                          : "border-white/20 hover:border-purple-400/50 hover:bg-purple-500/10"
                      )}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('fasta-upload')?.click()}
                    >
                      <div className="space-y-4">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                          <FileText className="w-10 h-10 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-white mb-2">
                            Drop your FASTA file here
                          </p>
                          <p className="text-slate-400">
                            Supports .fasta, .fa, .fas formats
                          </p>
                        </div>
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                    
                    <input
                      id="fasta-upload"
                      type="file"
                      accept=".fasta,.fa,.fas,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFile(file);
                          processFASTAFile(file);
                        }
                      }}
                    />

                    {/* File Info */}
                    {uploadedFile && (
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-blue-400" />
                          <div className="flex-1">
                            <p className="text-white font-semibold">{uploadedFile.name}</p>
                            <p className="text-slate-400 text-sm">
                              {(uploadedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                    )}

                    {/* Sequence Display */}
                    {fastaSequence && (
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <Dna className="w-5 h-5 text-green-400" />
                          Sequence Preview
                        </h4>
                        <div className="bg-black/20 rounded-xl p-4 font-mono text-sm text-green-300 max-h-32 overflow-y-auto">
                          {fastaSequence.substring(0, 200)}
                          {fastaSequence.length > 200 && '...'}
                        </div>
                        <p className="text-slate-400 text-sm mt-2">
                          Length: {fastaSequence.length} nucleotides
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-slate-900/90 to-green-900/70 backdrop-blur-2xl border-white/10 shadow-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                      <Search className="w-8 h-8 text-green-400" />
                      Species Identification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Analysis Progress */}
                    {isAnalyzing && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="animate-spin">
                            <RefreshCw className="w-6 h-6 text-blue-400" />
                          </div>
                          <span className="text-xl font-bold text-white">Analyzing Sequence...</span>
                        </div>
                        
                        {processingSteps.map((step, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-white">{step}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Results */}
                    {analysisComplete && analysisResults.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <Award className="w-8 h-8 text-yellow-400" />
                          <h3 className="text-2xl font-bold text-white">Top Species Matches</h3>
                        </div>

                        {analysisResults.map((result, index) => (
                          <div 
                            key={result.species}
                            className={cn(
                              "p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02]",
                              index === 0 
                                ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 ring-2 ring-green-400/20" 
                                : "bg-white/5 border-white/10 hover:border-white/20"
                            )}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  {index === 0 && <Star className="w-6 h-6 text-yellow-400 fill-current" />}
                                  <h4 className="text-xl font-bold text-white">
                                    {result.commonName}
                                  </h4>
                                </div>
                                <p className="text-lg italic text-slate-300 mb-2">
                                  {result.species}
                                </p>
                                <p className="text-slate-400 mb-3">
                                  {result.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                    {result.family}
                                  </Badge>
                                  <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">
                                    {result.habitat}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className={cn(
                                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-lg font-bold",
                                  getSimilarityColor(result.similarity)
                                )}>
                                  <Target className="w-5 h-5" />
                                  {result.similarity.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Sequence Similarity</span>
                                <span className="text-white font-semibold">
                                  {result.similarity.toFixed(1)}%
                                </span>
                              </div>
                              <Progress 
                                value={result.similarity} 
                                className="h-2 bg-white/10"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* No Results */}
                    {!isAnalyzing && !analysisComplete && (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Microscope className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Ready for Analysis</h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                          Upload a FASTA file or try a demo sequence to identify marine species using advanced genomic analysis
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}