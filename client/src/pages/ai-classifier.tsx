import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Upload, Fish, Camera, Loader2, CheckCircle, Star, 
  Brain, Dna, Database, TrendingUp, Award, BookOpen,
  Image as ImageIcon, Microscope, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassificationResult {
  species: string;
  confidence: number;
  scientificName: string;
  commonNames: string[];
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  characteristics: string[];
  distribution: string;
  conservation: string;
  economicValue: string;
}

interface eDNAResult {
  inputSequence: string;
  matches: Array<{
    species: string;
    similarity: number;
    accession: string;
    eValue: string;
    identity: number;
    coverage: number;
  }>;
  analysis: {
    length: number;
    gcContent: number;
    qualityScore: number;
  };
}

const mockFishSpecies = [
  {
    species: 'Indian Oil Sardine',
    scientificName: 'Sardinella longiceps',
    confidence: 94.7,
    commonNames: ['Oil Sardine', 'Indian Sardine', 'Mathi'],
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: 'Actinopterygii',
      order: 'Clupeiformes',
      family: 'Clupeidae',
      genus: 'Sardinella',
      species: 'S. longiceps'
    },
    characteristics: [
      'Silvery body with blue-green back',
      'Length: 15-20 cm typically',
      'Streamlined fusiform body',
      'Single dorsal fin',
      'Forked caudal fin'
    ],
    distribution: 'Indo-Pacific: Red Sea, Persian Gulf, and western Indian Ocean',
    conservation: 'Least Concern (LC)',
    economicValue: 'High commercial importance - major fishery species in India'
  },
  {
    species: 'Indian Mackerel',
    scientificName: 'Rastrelliger kanagurta',
    confidence: 91.3,
    commonNames: ['Indian Mackerel', 'Bangda', 'Ayala'],
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: 'Actinopterygii',
      order: 'Scombriformes',
      family: 'Scombridae',
      genus: 'Rastrelliger',
      species: 'R. kanagurta'
    },
    characteristics: [
      'Dark wavy lines on back',
      'Length: 25-35 cm',
      'Two dorsal fins',
      'Deeply forked tail',
      'Metallic blue-green coloration'
    ],
    distribution: 'Indo-West Pacific: Persian Gulf to Indonesia and north to Japan',
    conservation: 'Least Concern (LC)',
    economicValue: 'Extremely important commercial species throughout range'
  },
  {
    species: 'Spanish Mackerel',
    scientificName: 'Scomberomorus commerson',
    confidence: 87.9,
    commonNames: ['Spanish Mackerel', 'Kingfish', 'Surmai'],
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: 'Actinopterygii',
      order: 'Scombriformes',
      family: 'Scombridae',
      genus: 'Scomberomorus',
      species: 'S. commerson'
    },
    characteristics: [
      'Large predatory fish',
      'Length: up to 200 cm',
      'Silvery with dark spots',
      'Sharp triangular teeth',
      'Fast swimmer'
    ],
    distribution: 'Indo-West Pacific: Red Sea and East Africa to southeast Asia',
    conservation: 'Near Threatened (NT)',
    economicValue: 'High value commercial and sport fishing species'
  }
];

const mockDNASequences = [
  'ATGGCCTCCTTCCTGTTCCTGCTGGCCCTGTGCCTGCTGCCCTGCACCGAGGAGAAGCTGCTGCAGGTGGGCGACTTCCTGCCCAAGACCTACCACCTGATCAAGTTC',
  'GTGCAGCTGGTGGAGTCTGGGGGAGGCTTGGTACAGCCTGGGGGGTCCCTGAGACTCTCCTGTGCAGCCTCTGGATTCACCTTCAGTAGCTATGCAATGAGCTGGGTC',
  'CAGCTGCAGCTGCAGGAGTCGGGCCCAGGACTGGTGAAGCCTTCGGAGACCCTGTCCCTCACCTGCGCTGTCTCTGGTGGCTCCATCAGCAGTGGTGGTTACTACTGG'
];

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState<'fish' | 'edna'>('fish');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [dnaSequence, setDnaSequence] = useState('');
  const [ednaResult, setEdnaResult] = useState<eDNAResult | null>(null);

  const simulateImageProcessing = async () => {
    setProcessing(true);
    setProgress(0);
    
    const steps = [
      { progress: 15, message: "Preprocessing image..." },
      { progress: 30, message: "Extracting morphological features..." },
      { progress: 45, message: "Analyzing fin structure..." },
      { progress: 60, message: "Computing color patterns..." },
      { progress: 75, message: "Running CNN classifier..." },
      { progress: 90, message: "Validating against database..." },
      { progress: 100, message: "Classification complete!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setProgress(step.progress);
    }

    // Mock classification result
    const randomSpecies = mockFishSpecies[Math.floor(Math.random() * mockFishSpecies.length)];
    setClassificationResult({
      ...randomSpecies,
      confidence: Math.floor(Math.random() * 15) + 85 // 85-100%
    });

    setProcessing(false);
  };

  const simulateDNAProcessing = async () => {
    setProcessing(true);
    setProgress(0);
    
    const steps = [
      { progress: 20, message: "Validating DNA sequence..." },
      { progress: 40, message: "Searching NCBI database..." },
      { progress: 60, message: "Computing BLAST alignments..." },
      { progress: 80, message: "Calculating similarity scores..." },
      { progress: 100, message: "Analysis complete!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
    }

    // Mock eDNA results
    const mockMatches = [
      { species: 'Sardinella longiceps', similarity: 98.5, accession: 'MT123456', eValue: '2e-147', identity: 99, coverage: 97 },
      { species: 'Sardinella gibbosa', similarity: 87.3, accession: 'KY987654', eValue: '5e-89', identity: 91, coverage: 89 },
      { species: 'Sardinella fimbriata', similarity: 82.1, accession: 'JX456789', eValue: '1e-67', identity: 87, coverage: 85 },
      { species: 'Amblygaster sirm', similarity: 78.9, accession: 'HQ234567', eValue: '3e-52', identity: 83, coverage: 79 },
      { species: 'Dussumieria acuta', similarity: 74.2, accession: 'GU123890', eValue: '7e-41', identity: 79, coverage: 76 }
    ];

    setEdnaResult({
      inputSequence: dnaSequence,
      matches: mockMatches,
      analysis: {
        length: dnaSequence.length,
        gcContent: Math.round((dnaSequence.match(/[GC]/g)?.length || 0) / dnaSequence.length * 100),
        qualityScore: Math.floor(Math.random() * 20) + 80
      }
    });

    setProcessing(false);
  };

  const onImageDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      simulateImageProcessing();
    }
  }, []);

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
    onDrop: onImageDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    multiple: false
  });

  const handleDNAAnalysis = () => {
    if (dnaSequence.trim()) {
      simulateDNAProcessing();
    }
  };

  const insertSampleSequence = () => {
    const randomSequence = mockDNASequences[Math.floor(Math.random() * mockDNASequences.length)];
    setDnaSequence(randomSequence);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-yellow-400';
    if (confidence >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 95) return 'Excellent';
    if (confidence >= 90) return 'Very High';
    if (confidence >= 80) return 'High';
    if (confidence >= 70) return 'Good';
    return 'Fair';
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                AI Marine Tools
              </h1>
              <p className="text-slate-400 text-lg">
                Advanced AI-powered species identification and eDNA analysis
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('fish')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-medium",
              activeTab === 'fish'
                ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            )}
          >
            <Fish className="w-5 h-5" />
            Fish Species Classifier
          </button>
          <button
            onClick={() => setActiveTab('edna')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-medium",
              activeTab === 'edna'
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            )}
          >
            <Dna className="w-5 h-5" />
            eDNA Sequencing
          </button>
        </div>

        {/* Fish Species Classifier */}
        {activeTab === 'fish' && (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Upload Fish Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getImageRootProps()}
                  className={cn(
                    "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group",
                    isImageDragActive 
                      ? "border-green-400 bg-gradient-to-br from-green-500/20 to-blue-500/20" 
                      : "border-slate-600 hover:border-green-400/60 bg-gradient-to-br from-slate-800/50 to-slate-700/50"
                  )}
                >
                  <input {...getImageInputProps()} />
                  
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded fish" 
                        className="max-w-xs max-h-48 mx-auto rounded-lg shadow-lg"
                      />
                      <p className="text-green-400 font-medium">Image uploaded successfully!</p>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 text-slate-400 group-hover:text-green-400 transition-colors" />
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {isImageDragActive ? "Drop image here" : "Upload Fish Image"}
                      </h3>
                      <p className="text-slate-400 mb-6">
                        Drag & drop a fish photo or otolith image for AI classification
                      </p>
                      <Button variant="outline" className="border-slate-600 hover:border-green-400">
                        <Upload className="w-4 h-4 mr-2" />
                        Select Image
                      </Button>
                    </div>
                  )}
                </div>

                {processing && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                        <span className="text-lg font-semibold text-green-400">Analyzing Image...</span>
                      </div>
                      <span className="text-lg font-bold text-blue-400">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full h-3 bg-slate-700/50" />
                    <p className="text-sm text-slate-400 mt-3">Running advanced CNN classification models...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Classification Results */}
            {classificationResult && !processing && (
              <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    Classification Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Result */}
                  <div className="flex items-center justify-between p-6 bg-slate-800/50 rounded-xl">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{classificationResult.species}</h3>
                      <p className="text-lg text-slate-300 italic mb-3">{classificationResult.scientificName}</p>
                      <div className="flex flex-wrap gap-2">
                        {classificationResult.commonNames.map((name, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-green-500/30 mb-2">
                        <span className={`text-3xl font-bold ${getConfidenceColor(classificationResult.confidence)}`}>
                          {classificationResult.confidence}%
                        </span>
                      </div>
                      <Badge className={cn("text-xs", getConfidenceColor(classificationResult.confidence))}>
                        {getConfidenceLabel(classificationResult.confidence)} Confidence
                      </Badge>
                    </div>
                  </div>

                  {/* Taxonomy */}
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Taxonomic Classification
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {Object.entries(classificationResult.taxonomy).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-slate-400 capitalize block">{key}:</span>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Characteristics */}
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <Microscope className="w-4 h-4" />
                      Key Characteristics
                    </h4>
                    <ul className="space-y-2">
                      {classificationResult.characteristics.map((char, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-300">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <h5 className="font-bold text-blue-400 mb-2">Distribution</h5>
                      <p className="text-slate-300 text-sm">{classificationResult.distribution}</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <h5 className="font-bold text-green-400 mb-2">Conservation Status</h5>
                      <p className="text-slate-300 text-sm">{classificationResult.conservation}</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <h5 className="font-bold text-purple-400 mb-2">Economic Value</h5>
                      <p className="text-slate-300 text-sm">{classificationResult.economicValue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* eDNA Sequencing */}
        {activeTab === 'edna' && (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  DNA Sequence Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dna-sequence" className="text-slate-300 font-medium">
                    Enter DNA Sequence (FASTA format)
                  </Label>
                  <Textarea
                    id="dna-sequence"
                    value={dnaSequence}
                    onChange={(e) => setDnaSequence(e.target.value)}
                    placeholder="Enter your DNA sequence here (A, T, G, C nucleotides)..."
                    rows={6}
                    className="mt-2 bg-slate-900/50 border-slate-600 focus:border-purple-400 text-white font-mono text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleDNAAnalysis}
                    disabled={!dnaSequence.trim() || processing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze Sequence
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={insertSampleSequence}
                    className="border-slate-600 hover:border-purple-400"
                  >
                    Use Sample Sequence
                  </Button>
                </div>

                {processing && (
                  <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                        <span className="text-lg font-semibold text-purple-400">Processing DNA Sequence...</span>
                      </div>
                      <span className="text-lg font-bold text-pink-400">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full h-3 bg-slate-700/50" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* eDNA Results */}
            {ednaResult && !processing && (
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-purple-400 flex items-center gap-2">
                    <Database className="w-6 h-6" />
                    eDNA Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sequence Analysis */}
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <h4 className="font-bold text-white mb-3">Sequence Analysis</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-400">{ednaResult.analysis.length}</div>
                        <div className="text-xs text-slate-400">Base Pairs</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-pink-400">{ednaResult.analysis.gcContent}%</div>
                        <div className="text-xs text-slate-400">GC Content</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{ednaResult.analysis.qualityScore}</div>
                        <div className="text-xs text-slate-400">Quality Score</div>
                      </div>
                    </div>
                  </div>

                  {/* BLAST Results */}
                  <div>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Top Species Matches
                    </h4>
                    <div className="space-y-3">
                      {ednaResult.matches.map((match, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
                          <div className="flex-1">
                            <h5 className="font-bold text-white italic">{match.species}</h5>
                            <p className="text-sm text-slate-400">Accession: {match.accession} | E-value: {match.eValue}</p>
                            <div className="flex gap-4 mt-2 text-xs text-slate-300">
                              <span>Identity: {match.identity}%</span>
                              <span>Coverage: {match.coverage}%</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={cn(
                              "text-2xl font-bold",
                              match.similarity >= 95 ? "text-green-400" :
                              match.similarity >= 90 ? "text-blue-400" :
                              match.similarity >= 80 ? "text-yellow-400" : "text-orange-400"
                            )}>
                              {match.similarity}%
                            </div>
                            <div className="text-xs text-slate-400">Similarity</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}