import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Brain, Upload, Dna, Eye, FileImage, Microscope, Sparkles, Waves, BarChart3, FileText, TrendingUp, RotateCw, Ruler, Play, Pause } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

interface EnvironmentalData {
  date: string;
  temperature: number;
  salinity: number;
  chlorophyll: number;
}

interface DataInsights {
  avgTemperature: number;
  avgSalinity: number;
  avgChlorophyll: number;
  temperatureTrend: 'increasing' | 'decreasing' | 'stable';
  salinityTrend: 'increasing' | 'decreasing' | 'stable';
  chlorophyllTrend: 'increasing' | 'decreasing' | 'stable';
  dataQuality: number;
  recommendations: string[];
}

// Sample images for quick demo
const sampleOtolithImages = [
  { 
    name: 'Cod Otolith', 
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMUYyOTM3IiByeD0iOCIvPgo8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0MCIgcng9IjM1IiByeT0iMjUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOSIvPgo8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0MCIgcng9IjI1IiByeT0iMTUiIGZpbGw9IiM2Mzc0ODEiIG9wYWNpdHk9IjAuNSIvPgo8dGV4dCB4PSI2MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk0QTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q09EPC90ZXh0Pgo8L3N2Zz4=', 
    species: 'Gadus morhua',
    confidence: 0.95 
  },
  { 
    name: 'Herring Otolith', 
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMUYyOTM3IiByeD0iOCIvPgo8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0MCIgcng9IjMwIiByeT0iMjAiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOSIvPgo8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0MCIgcng9IjIwIiByeT0iMTIiIGZpbGw9IiM2Mzc0ODEiIG9wYWNpdHk9IjAuNSIvPgo8dGV4dCB4PSI2MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI5IiBmaWxsPSIjOTRBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5IRVJSSU5HPC90ZXh0Pgo8L3N2Zz4=', 
    species: 'Clupea harengus',
    confidence: 0.88 
  },
  { 
    name: 'Mackerel Otolith', 
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMUYyOTM3IiByeD0iOCIvPgo8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0MCIgcng9IjMyIiByeT0iMTgiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOSIvPgo8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0MCIgcng9IjIyIiByeT0iMTAiIGZpbGw9IiM2Mzc0ODEiIG9wYWNpdHk9IjAuNSIvPgo8dGV4dCB4PSI2MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSIjOTRBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NQUNLRVJFTDwvdGV4dD4KPC9zdmc+', 
    species: 'Scomber scombrus',
    confidence: 0.92 
  }
];

// Sample DNA sequences for quick demo
const sampleDNASequences = [
  {
    name: 'Atlantic Cod (COI)',
    sequence: `>Gadus_morhua_COI_barcode
TTAAACGTTCGAGCCGAACTAGGAACTCCAGGAAACCTAATTCGAACAGAATTAGGACAACCAGGCTCACTT
ATTGGAAACGATCAAATTTATAATGTAATTGTTACAGCTCATGCATTTGTAATAATTTTCTTTATAGTAATA
CCAATTATAATTGGAGGGTTTGGAAACTGACTAGTTCCATTAATAATTGGAGCCCCTGATATAGCATTTCCT
CGGATAAATAATATAAGATTTTGATTATTACCCCCTTCATTAACACTATTACTTATAAGAAGAATAGTAGAA
AAAGGAGCAGGAACAGGTTGAACAGTATATCCACCTCTAGCTGGAAACCTCGCTCATGCAGGAGCATCAGTA
GATTTAACAATTTTCTCATTACACTTAGCAGGAGTTTCATCAATTTTAGGATCAATTAATTTTATTACAACA
ATTATAAACATAAAAT`,
    species: 'Gadus morhua',
    similarity: 98.5
  },
  {
    name: 'Atlantic Herring (16S)',
    sequence: `>Clupea_harengus_16S_rRNA
CGCCTGTTTACCAAAAAACAACCCCCCTCTCCCCATTGATGGTATTAAGAGAAATGGTAACGCTACGCTATTTTAA
CAATAAACCCATAGCTTTGTAGAATTCAAATGGACGAAAAGACCCCATGGAGCTTAAACCTAAAATCTAGTTGAC
ACTAAATCAATGAAATTAATCTAAGCGGTAACAGGCTGATAATCCTGTAAAGCGGGGATAAGCTACCATAAGACGA
GAAGACCCTATGGAGCTTTAAACTTAACATAAAACCCCCTGAAAAGAAGTTAGAACCTAATCAAAAAATTGATATT
GGTTATAAAGACCACGGTTGGGTTGGGGCGACCGTCCTAAAAAATCAAGAGCTACCCCGATCAGTGAAATTCTAGC
CTACCCGTCTAAGGGACCCCTTTTCCGGCTGGGGCGACCACGGAGGAAAGAAAGCCCCCCAAGTTTAATTAAAAGC
CACACCTCCTGTTCAAATCATACTAACGTATAAAC`,
    species: 'Clupea harengus',
    similarity: 96.2
  },
  {
    name: 'Unknown Marine Sample',
    sequence: `>Marine_sample_001_unknown
ATGCGATCCGAATCGGTACGATCGCTAATTCCGTAGCATATGCGATCGCTTAATCGCGATCGCTAATTCGCGAT
CGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCT
AATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATT
CGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCG
ATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCG
CTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATCGCTAA
TTCGCGATCGCTAATTCGCGATCGCTAATTCGCGATC`,
    species: 'Unknown species',
    similarity: 78.3
  }
];

// Helper function to get realistic alternative species for otolith identification
const getAlternativeSpecies = (primarySpecies: string, primaryConfidence: number) => {
  const alternatives: Record<string, Array<{species: string, commonName: string}>> = {
    'Gadus morhua': [
      { species: 'Pollachius virens', commonName: 'Saithe/Pollock' },
      { species: 'Melanogrammus aeglefinus', commonName: 'Haddock' }
    ],
    'Clupea harengus': [
      { species: 'Sardina pilchardus', commonName: 'European Pilchard' },
      { species: 'Sprattus sprattus', commonName: 'European Sprat' }
    ],
    'Scomber scombrus': [
      { species: 'Trachurus trachurus', commonName: 'Atlantic Horse Mackerel' },
      { species: 'Scomber colias', commonName: 'Atlantic Chub Mackerel' }
    ]
  };

  const speciesAlts = alternatives[primarySpecies] || [
    { species: 'Merlangius merlangus', commonName: 'Whiting' },
    { species: 'Pleuronectes platessa', commonName: 'European Plaice' }
  ];

  return speciesAlts.map((alt, index) => ({
    species: alt.species,
    commonName: alt.commonName,
    confidence: primaryConfidence - (0.1 * (index + 1))
  }));
};

// Helper function to get realistic alternative DNA matches
const getAlternativeDNAMatches = (primarySpecies: string, primarySimilarity: number) => {
  const alternatives: Record<string, Array<{species: string, commonName: string}>> = {
    'Gadus morhua': [
      { species: 'Pollachius virens', commonName: 'Atlantic Pollock (16S rRNA)' },
      { species: 'Melanogrammus aeglefinus', commonName: 'Haddock (COI)' }
    ],
    'Clupea harengus': [
      { species: 'Sardina pilchardus', commonName: 'European Sardine (16S rRNA)' },
      { species: 'Alosa alosa', commonName: 'Allis Shad (COI)' }
    ],
    'Unknown species': [
      { species: 'Merluccius merluccius', commonName: 'European Hake (COI)' },
      { species: 'Solea solea', commonName: 'Common Sole (16S rRNA)' }
    ]
  };

  const speciesAlts = alternatives[primarySpecies] || [
    { species: 'Limanda limanda', commonName: 'Common Dab (COI)' },
    { species: 'Microstomus kitt', commonName: 'Lemon Sole (16S rRNA)' }
  ];

  return speciesAlts.map((alt, index) => ({
    species: alt.species,
    commonName: alt.commonName,
    similarity: primarySimilarity - (5.0 * (index + 1))
  }));
};

export default function AITools() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dnaSequence, setDnaSequence] = useState('');
  const [predictionResult, setPredictionResult] = useState<SpeciesPrediction | null>(null);
  const [dnaMatches, setDnaMatches] = useState<DNAMatch[] | null>(null);
  const [step, setStep] = useState(1);
  
  // CSV Data Analysis State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData[]>([]);
  const [dataInsights, setDataInsights] = useState<DataInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Otolith Viewer State
  const [selectedOtolith, setSelectedOtolith] = useState<typeof sampleOtolithImages[0] | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [measurementMode, setMeasurementMode] = useState(false);
  const [measurements, setMeasurements] = useState({
    length: 12.4,
    width: 8.2,
    thickness: 2.1,
    volume: 213.6
  });
  const [analysis, setAnalysis] = useState({
    age: 3.2,
    growthRings: 3,
    species: 'Blue Rockfish',
    confidence: 89.3
  });
  
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
      // Simulate DNA analysis with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate realistic DNA matching results
      const cleanSequence = sequence.replace(/[>\n\r\s]/g, '');
      const sequenceLength = cleanSequence.length;
      const gcContent = ((cleanSequence.match(/[GC]/gi)?.length || 0) / sequenceLength) * 100;
      
      // Determine primary match based on sequence characteristics
      let primarySpecies = "Gadus morhua";
      let primarySimilarity = 92.5;
      
      if (gcContent > 50) {
        primarySpecies = "Salmo salar";
        primarySimilarity = 95.2;
      } else if (sequenceLength > 500) {
        primarySpecies = "Thunnus thynnus";
        primarySimilarity = 89.7;
      } else if (sequenceLength < 200) {
        primarySpecies = "Pleuronectes platessa";
        primarySimilarity = 87.3;
      }
      
      // Generate alternative matches
      const alternativeMatches = getAlternativeDNAMatches(primarySpecies, primarySimilarity);
      
      return {
        matches: [
          {
            species: primarySpecies,
            commonName: primarySpecies === "Gadus morhua" ? "Atlantic Cod" :
                       primarySpecies === "Salmo salar" ? "Atlantic Salmon" :
                       primarySpecies === "Thunnus thynnus" ? "Atlantic Bluefin Tuna" :
                       "European Plaice",
            similarity: primarySimilarity,
            confidence: primarySimilarity / 100
          },
          ...alternativeMatches
        ]
      };
    },
    onSuccess: (data) => {
      setDnaMatches(data.matches);
      toast({
        title: "DNA analysis complete",
        description: `Found ${data.matches.length} potential matches in database.`,
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setStep(2);
    }
  };

  const handleSampleImageSelect = (sampleImage: typeof sampleOtolithImages[0]) => {
    // Convert base64 to File object for demo
    fetch(sampleImage.url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], sampleImage.name + '.png', { type: 'image/png' });
        setSelectedImage(file);
        setStep(2);
        // Auto-predict for demo
        setTimeout(() => {
          setPredictionResult({
            species: sampleImage.species,
            commonName: sampleImage.name,
            confidence: sampleImage.confidence,
            alternates: getAlternativeSpecies(sampleImage.species, sampleImage.confidence)
          });
          setStep(3);
          toast({
            title: "Analysis complete",
            description: `Identified as ${sampleImage.name} with ${(sampleImage.confidence * 100).toFixed(1)}% confidence`,
          });
        }, 1500);
      });
  };

  const handleSampleDNASelect = (sampleDNA: typeof sampleDNASequences[0]) => {
    setDnaSequence(sampleDNA.sequence);
    // Auto-analyze for demo
    setTimeout(() => {
      const primaryMatch = {
        species: sampleDNA.species,
        commonName: sampleDNA.name,
        similarity: sampleDNA.similarity
      };
      const alternativeMatches = getAlternativeDNAMatches(sampleDNA.species, sampleDNA.similarity);
      
      setDnaMatches([primaryMatch, ...alternativeMatches]);
      toast({
        title: "DNA analysis complete",
        description: `Best match: ${sampleDNA.species} (${sampleDNA.similarity.toFixed(1)}% similarity)`,
      });
    }, 2000);
  };

  const handleSpeciesPrediction = () => {
    if (selectedImage) {
      // Simulate AI analysis with realistic delay and results
      setStep(3);
      
      // Show loading state
      toast({
        title: "Starting AI analysis",
        description: "Processing image for species identification...",
      });

      // Simulate processing time
      setTimeout(() => {
        // Generate realistic prediction based on image name or random selection
        const imageName = selectedImage.name.toLowerCase();
        let primarySpecies = 'Gadus morhua';
        let confidence = 0.89 + Math.random() * 0.1; // 89-99% confidence
        
        if (imageName.includes('cod')) {
          primarySpecies = 'Gadus morhua';
          confidence = 0.92 + Math.random() * 0.07;
        } else if (imageName.includes('herring')) {
          primarySpecies = 'Clupea harengus';
          confidence = 0.88 + Math.random() * 0.1;
        } else if (imageName.includes('mackerel')) {
          primarySpecies = 'Scomber scombrus';
          confidence = 0.85 + Math.random() * 0.12;
        } else {
          // Random selection for other images
          const randomSpecies = ['Gadus morhua', 'Clupea harengus', 'Scomber scombrus'];
          primarySpecies = randomSpecies[Math.floor(Math.random() * randomSpecies.length)];
          confidence = 0.75 + Math.random() * 0.2;
        }

        const speciesNames = {
          'Gadus morhua': 'Atlantic Cod',
          'Clupea harengus': 'Atlantic Herring',
          'Scomber scombrus': 'Atlantic Mackerel'
        };

        const alternativeSpecies = getAlternativeSpecies(primarySpecies, confidence);
        
        const prediction: SpeciesPrediction = {
          species: primarySpecies,
          commonName: speciesNames[primarySpecies as keyof typeof speciesNames],
          confidence: Number(confidence.toFixed(3)),
          alternates: alternativeSpecies
        };

        setPredictionResult(prediction);
        
        toast({
          title: "Analysis complete",
          description: `Identified as ${prediction.commonName} with ${(prediction.confidence * 100).toFixed(1)}% confidence`,
        });
      }, 3000); // 3 second simulation
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

  // CSV Data Processing Functions
  const parseCSVData = (csvContent: string): EnvironmentalData[] => {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        date: values[0]?.trim() || '',
        temperature: parseFloat(values[1]) || 0,
        salinity: parseFloat(values[2]) || 0,
        chlorophyll: parseFloat(values[3]) || 0
      };
    }).filter(data => data.date && !isNaN(data.temperature));
  };

  const calculateTrend = (values: number[]): 'increasing' | 'decreasing' | 'stable' => {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (percentChange > 2) return 'increasing';
    if (percentChange < -2) return 'decreasing';
    return 'stable';
  };

  const generateInsights = (data: EnvironmentalData[]): DataInsights => {
    const temperatures = data.map(d => d.temperature);
    const salinities = data.map(d => d.salinity);
    const chlorophylls = data.map(d => d.chlorophyll);

    const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    const avgSal = salinities.reduce((a, b) => a + b, 0) / salinities.length;
    const avgChl = chlorophylls.reduce((a, b) => a + b, 0) / chlorophylls.length;

    const tempTrend = calculateTrend(temperatures);
    const salTrend = calculateTrend(salinities);
    const chlTrend = calculateTrend(chlorophylls);

    const recommendations = [];
    if (tempTrend === 'increasing' && avgTemp > 30) {
      recommendations.push('⚠️ Rising temperatures detected - Monitor for heat stress in marine organisms');
    }
    if (salTrend === 'increasing' && avgSal > 36) {
      recommendations.push('🧂 High salinity levels - Check for freshwater input changes');
    }
    if (chlTrend === 'decreasing') {
      recommendations.push('🌱 Declining chlorophyll - Monitor primary productivity levels');
    }
    if (avgChl > 1.0) {
      recommendations.push('🌊 High chlorophyll detected - Potential algal bloom conditions');
    }

    return {
      avgTemperature: avgTemp,
      avgSalinity: avgSal,
      avgChlorophyll: avgChl,
      temperatureTrend: tempTrend,
      salinityTrend: salTrend,
      chlorophyllTrend: chlTrend,
      dataQuality: Math.min(100, (data.length / 50) * 100), // Quality based on data points
      recommendations: recommendations.length > 0 ? recommendations : ['✅ All parameters within normal ranges']
    };
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          setIsAnalyzing(true);
          const content = e.target?.result as string;
          const parsedData = parseCSVData(content);
          
          if (parsedData.length === 0) {
            throw new Error('No valid data found in CSV file');
          }

          setEnvironmentalData(parsedData);
          
          // Generate insights after a brief delay for demo effect
          setTimeout(() => {
            const insights = generateInsights(parsedData);
            setDataInsights(insights);
            setIsAnalyzing(false);
            
            toast({
              title: "Data analysis complete",
              description: `Processed ${parsedData.length} data points successfully`,
            });
          }, 2000);
          
        } catch (error) {
          setIsAnalyzing(false);
          toast({
            title: "CSV parsing failed",
            description: "Please check your CSV format and try again",
            variant: "destructive",
          });
        }
      };
      
      reader.readAsText(file);
    }
  };

  const loadSampleData = () => {
    const sampleCSV = `Date,Temperature(°C),Salinity(PSU),Chlorophyll(mg/m³)
2025-01-01,27.8,34.8,0.72
2025-01-08,28.1,34.9,0.75
2025-01-15,28.4,35.0,0.78
2025-01-22,28.9,35.1,0.80
2025-02-01,29.2,35.3,0.82
2025-02-08,29.5,35.4,0.88
2025-02-15,29.8,35.5,0.90
2025-02-22,30.1,35.7,0.95
2025-03-01,30.3,35.8,1.02
2025-03-08,30.5,35.9,1.05
2025-03-15,30.7,36.0,1.10
2025-03-22,30.9,36.1,1.15
2025-04-01,31.0,36.2,1.20
2025-04-08,31.2,36.3,1.25
2025-04-15,31.5,36.4,1.30
2025-04-22,31.7,36.5,1.35`;

    setIsAnalyzing(true);
    const parsedData = parseCSVData(sampleCSV);
    setEnvironmentalData(parsedData);
    
    setTimeout(() => {
      const insights = generateInsights(parsedData);
      setDataInsights(insights);
      setIsAnalyzing(false);
      
      toast({
        title: "Sample data loaded",
        description: `Analyzing ${parsedData.length} sample measurements`,
      });
    }, 2000);
  };

  const resetDataAnalysis = () => {
    setCsvFile(null);
    setEnvironmentalData([]);
    setDataInsights(null);
    setIsAnalyzing(false);
  };

  // Otolith Viewer Functions
  const handleOtolithSelect = (otolith: typeof sampleOtolithImages[0]) => {
    setSelectedOtolith(otolith);
    // Generate realistic measurements based on species
    const baseLength = otolith.species === 'Gadus morhua' ? 14.2 : 
                      otolith.species === 'Clupea harengus' ? 8.5 : 11.3;
    const variationFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2 variation
    
    const newMeasurements = {
      length: Number((baseLength * variationFactor).toFixed(1)),
      width: Number((baseLength * 0.65 * variationFactor).toFixed(1)),
      thickness: Number((baseLength * 0.18 * variationFactor).toFixed(1)),
      volume: Number((baseLength * 0.65 * 0.18 * variationFactor * Math.PI * 4/3).toFixed(1))
    };
    
    setMeasurements(newMeasurements);
    
    // Generate species-specific analysis
    const speciesData = {
      'Gadus morhua': { age: 4.1, growthRings: 4, species: 'Atlantic Cod', confidence: 94.2 },
      'Clupea harengus': { age: 2.3, growthRings: 2, species: 'Atlantic Herring', confidence: 91.7 },
      'Scomber scombrus': { age: 3.0, growthRings: 3, species: 'Atlantic Mackerel', confidence: 88.9 }
    };
    
    const analysisData = speciesData[otolith.species as keyof typeof speciesData] || 
                        { age: 3.2, growthRings: 3, species: 'Unknown Species', confidence: 75.0 };
    
    setAnalysis(analysisData);
    
    toast({
      title: "Otolith loaded",
      description: `${otolith.name} ready for 3D analysis`,
    });
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
    if (!isRotating) {
      // Start rotation animation
      const rotateInterval = setInterval(() => {
        setRotationAngle(prev => (prev + 2) % 360);
      }, 50);
      
      // Store interval reference for cleanup
      setTimeout(() => {
        if (isRotating) {
          clearInterval(rotateInterval);
        }
      }, 100);
    }
    
    toast({
      title: isRotating ? "Rotation stopped" : "Rotation started",
      description: `3D otolith ${isRotating ? 'paused' : 'rotating'}`,
    });
  };

  const toggleMeasurement = () => {
    setMeasurementMode(!measurementMode);
    if (!measurementMode) {
      // Simulate real-time measurement updates
      const measurementInterval = setInterval(() => {
        setMeasurements(prev => ({
          ...prev,
          length: Number((prev.length + (Math.random() - 0.5) * 0.1).toFixed(1)),
          width: Number((prev.width + (Math.random() - 0.5) * 0.1).toFixed(1))
        }));
      }, 1000);
      
      setTimeout(() => clearInterval(measurementInterval), 5000);
    }
    
    toast({
      title: measurementMode ? "Measurement mode off" : "Measurement mode on",
      description: `${measurementMode ? 'Stopped' : 'Started'} real-time measurements`,
    });
  };

  const resetOtolith = () => {
    setSelectedOtolith(null);
    setIsRotating(false);
    setRotationAngle(0);
    setMeasurementMode(false);
    setMeasurements({ length: 12.4, width: 8.2, thickness: 2.1, volume: 213.6 });
    setAnalysis({ age: 3.2, growthRings: 3, species: 'Blue Rockfish', confidence: 89.3 });
  };

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
            <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-xl">
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
            <TabsTrigger 
              value="data" 
              data-testid="tab-data"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600/20 data-[state=active]:to-cyan-600/20 data-[state=active]:text-white data-[state=active]:border-teal-500/30 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-lg border border-transparent"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Data Analysis
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
                          
                          {/* Sample Images for Quick Demo */}
                          <div className="mt-8">
                            <p className="text-white text-sm font-medium mb-4 text-center">Or try these sample otoliths:</p>
                            <div className="grid grid-cols-3 gap-4">
                              {sampleOtolithImages.map((sample, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSampleImageSelect(sample)}
                                  className="group relative overflow-hidden rounded-lg border border-white/20 hover:border-blue-400/50 transition-all duration-300 bg-white/5 hover:bg-white/10 p-3"
                                >
                                  <img 
                                    src={sample.url} 
                                    alt={sample.name}
                                    className="w-full h-16 object-cover rounded-md mb-2"
                                  />
                                  <p className="text-xs text-white font-medium">{sample.name}</p>
                                  <p className="text-xs text-slate-400">{(sample.confidence * 100).toFixed(0)}% match</p>
                                  
                                  {/* Hover effect */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                                    <Sparkles className="w-3 h-3 text-white" />
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && selectedImage && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-6 border border-white/20 rounded-xl bg-white/5 backdrop-blur-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                          <FileImage className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white text-lg">{selectedImage.name}</p>
                          <p className="text-slate-400">
                            {(selectedImage.size / (1024 * 1024)).toFixed(1)} MB • Ready for analysis
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={resetSpeciesAnalysis} 
                          className="border-white/20 text-white hover:bg-white/10"
                          data-testid="button-change-image"
                        >
                          Change Image
                        </Button>
                      </div>

                      <Button 
                        onClick={handleSpeciesPrediction}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                        data-testid="button-analyze-species"
                      >
                        <Brain className="w-5 h-5 mr-2" />
                        Start AI Analysis
                      </Button>
                      
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-blue-400" />
                          AI Analysis Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-white/5 rounded-lg">
                            <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <p className="text-white text-sm font-medium">Neural Network</p>
                            <p className="text-slate-400 text-xs">Deep learning classification</p>
                          </div>
                          <div className="text-center p-4 bg-white/5 rounded-lg">
                            <Eye className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                            <p className="text-white text-sm font-medium">Visual Analysis</p>
                            <p className="text-slate-400 text-xs">Morphological features</p>
                          </div>
                          <div className="text-center p-4 bg-white/5 rounded-lg">
                            <Microscope className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                            <p className="text-white text-sm font-medium">Precision ID</p>
                            <p className="text-slate-400 text-xs">Species-level accuracy</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && !predictionResult && (
                    <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
                      <CardContent className="p-8">
                        <div className="text-center">
                          <div className="relative mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mx-auto flex items-center justify-center animate-pulse">
                              <Brain className="w-10 h-10 text-blue-400" />
                            </div>
                            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-blue-400/30 border-t-blue-400 animate-spin mx-auto"></div>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">AI Analysis in Progress</h3>
                          <p className="text-slate-300 mb-6">
                            Our neural network is analyzing the image for species identification...
                          </p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400">Processing image features</span>
                              <span className="text-blue-400 font-medium">Complete</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400">Running classification model</span>
                              <span className="text-yellow-400 font-medium">In Progress</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400">Generating confidence scores</span>
                              <span className="text-slate-500 font-medium">Pending</span>
                            </div>
                          </div>
                          <Progress value={66} className="mt-6 h-3 bg-white/10" data-testid="progress-species-analysis" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {step === 3 && predictionResult && (
                    <div className="space-y-6">
                      {/* Success Header */}
                      <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Brain className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">Analysis Complete!</h3>
                        <p className="text-green-300">Species successfully identified with AI classification</p>
                      </div>

                      {/* Primary Identification */}
                      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Brain className="w-5 h-5 text-blue-400" />
                            Primary Identification
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-white mb-2" data-testid="text-predicted-species">
                                {predictionResult.species}
                              </p>
                              <p className="text-xl text-blue-300 mb-4" data-testid="text-common-name">
                                {predictionResult.commonName}
                              </p>
                              
                              {/* Confidence Badge */}
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                                <div className={`w-3 h-3 rounded-full ${
                                  predictionResult.confidence >= 0.8 ? 'bg-green-400 animate-pulse' :
                                  predictionResult.confidence >= 0.6 ? 'bg-yellow-400 animate-pulse' :
                                  'bg-red-400 animate-pulse'
                                }`}></div>
                                <span className="text-white font-semibold" data-testid="badge-confidence">
                                  {(predictionResult.confidence * 100).toFixed(1)}% Confidence
                                </span>
                              </div>
                            </div>
                            
                            {/* Enhanced Confidence Visualization */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-300 font-medium">Classification Accuracy</span>
                                <span className={`font-bold ${
                                  predictionResult.confidence >= 0.8 ? 'text-green-400' :
                                  predictionResult.confidence >= 0.6 ? 'text-yellow-400' :
                                  'text-red-400'
                                }`}>
                                  {predictionResult.confidence >= 0.8 ? 'Excellent' :
                                   predictionResult.confidence >= 0.6 ? 'Good' :
                                   'Fair'}
                                </span>
                              </div>
                              <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    predictionResult.confidence >= 0.8 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                    predictionResult.confidence >= 0.6 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                                    'bg-gradient-to-r from-red-500 to-pink-400'
                                  }`}
                                  style={{ width: `${predictionResult.confidence * 100}%` }}
                                >
                                  <div className="h-full bg-white/20 animate-pulse"></div>
                                </div>
                              </div>
                              <div className="flex justify-between text-xs text-slate-400">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                              </div>
                            </div>

                            {/* Analysis Details */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                              <div className="bg-white/5 rounded-lg p-4 text-center">
                                <Microscope className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                <p className="text-white text-sm font-medium">Analysis Method</p>
                                <p className="text-slate-400 text-xs">Deep Neural Network</p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-4 text-center">
                                <Eye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                <p className="text-white text-sm font-medium">Processing Time</p>
                                <p className="text-slate-400 text-xs">2.8 seconds</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Alternative Matches */}
                      {predictionResult.alternates && predictionResult.alternates.length > 0 && (
                        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-yellow-400" />
                              Alternative Matches
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {predictionResult.alternates.map((alt, index) => (
                                <div 
                                  key={index} 
                                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200" 
                                  data-testid={`alt-match-${index}`}
                                >
                                  <div className="flex-1">
                                    <p className="font-semibold text-white">{alt.species}</p>
                                    <p className="text-sm text-slate-300 italic">{alt.commonName}</p>
                                  </div>
                                  <div className="text-right">
                                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                                      {(alt.confidence * 100).toFixed(1)}%
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <Button 
                          onClick={resetSpeciesAnalysis}
                          variant="outline"
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                          data-testid="button-analyze-another"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Analyze Another
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          data-testid="button-save-results"
                        >
                          <FileImage className="w-4 h-4 mr-2" />
                          Save Results
                        </Button>
                      </div>
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
                    3D Otolith Viewer
                  </CardTitle>
                  <p className="text-slate-400">
                    Interactive 3D visualization of otolith structures for age and growth analysis
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Sample Otolith Selection */}
                  {!selectedOtolith && (
                    <div className="mb-6">
                      <h3 className="text-white font-semibold mb-4">Select an Otolith Sample</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sampleOtolithImages.map((otolith, index) => (
                          <button
                            key={index}
                            onClick={() => handleOtolithSelect(otolith)}
                            className="group relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 hover:border-orange-400/50 rounded-xl p-4 transition-all duration-300 hover:scale-105"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative z-10">
                              <img 
                                src={otolith.url} 
                                alt={otolith.name}
                                className="w-full h-20 object-contain mb-3 opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              <h4 className="text-white font-medium text-sm">{otolith.name}</h4>
                              <p className="text-slate-400 text-xs italic">{otolith.species}</p>
                              <div className="mt-2">
                                <Badge className="bg-orange-500/20 text-orange-300 text-xs">
                                  {(otolith.confidence * 100).toFixed(0)}% confidence
                                </Badge>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3D Viewer */}
                  <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
                      {/* Controls */}
                      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                        <div className="text-white text-sm font-medium mb-1">
                          {selectedOtolith ? selectedOtolith.name : '3D Otolith Model'}
                        </div>
                        {selectedOtolith && (
                          <div className="text-slate-300 text-xs italic">
                            {selectedOtolith.species}
                          </div>
                        )}
                      </div>

                      {/* Status Indicators */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {isRotating && (
                          <div className="bg-green-500/20 border border-green-500/50 px-3 py-1 rounded-full text-green-300 text-xs flex items-center gap-1">
                            <RotateCw className="w-3 h-3 animate-spin" />
                            Rotating
                          </div>
                        )}
                        {measurementMode && (
                          <div className="bg-blue-500/20 border border-blue-500/50 px-3 py-1 rounded-full text-blue-300 text-xs flex items-center gap-1">
                            <Ruler className="w-3 h-3" />
                            Measuring
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute bottom-6 right-6 flex gap-3">
                        <button 
                          onClick={toggleRotation}
                          className={`group relative overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:scale-105 shadow-lg text-white px-4 py-3 rounded-xl ${
                            isRotating 
                              ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-500/50 hover:border-green-400/70 shadow-green-500/40'
                              : 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-500/50 hover:border-orange-400/70 shadow-orange-500/20 hover:shadow-orange-500/40'
                          }`}
                          data-testid="button-rotate-otolith"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          
                          <div className="relative z-10 flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                              isRotating 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 group-hover:rotate-12'
                                : 'bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:rotate-12'
                            }`}>
                              {isRotating ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                            </div>
                            <span className="font-semibold text-sm">{isRotating ? 'Stop' : 'Rotate'}</span>
                          </div>
                        </button>
                        
                        <button 
                          onClick={toggleMeasurement}
                          className={`group relative overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:scale-105 shadow-lg text-white px-4 py-3 rounded-xl ${
                            measurementMode
                              ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-blue-500/50 hover:border-blue-400/70 shadow-blue-500/40'
                              : 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500/50 hover:border-teal-400/70 shadow-teal-500/20 hover:shadow-teal-500/40'
                          }`}
                          data-testid="button-measure-otolith"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          
                          <div className="relative z-10 flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                              measurementMode
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:rotate-12'
                                : 'bg-gradient-to-r from-teal-500 to-cyan-500 group-hover:rotate-12'
                            }`}>
                              <Ruler className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-sm">Measure</span>
                          </div>
                        </button>

                        {selectedOtolith && (
                          <button 
                            onClick={resetOtolith}
                            className="group relative overflow-hidden bg-gradient-to-r from-slate-500/20 to-gray-500/20 backdrop-blur-xl border border-slate-500/50 hover:border-slate-400/70 hover:from-slate-500/30 hover:to-gray-500/30 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-slate-500/20 hover:shadow-slate-500/40"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            
                            <div className="relative z-10 flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-gray-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                <Upload className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-semibold text-sm">Reset</span>
                            </div>
                          </button>
                        )}
                      </div>
                      
                      {/* Enhanced 3D object */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div 
                          className={`relative transition-transform duration-300 ${isRotating ? 'animate-spin' : ''}`}
                          style={{ transform: `rotate(${rotationAngle}deg)` }}
                        >
                          {selectedOtolith ? (
                            <div className="relative">
                              {/* Main otolith shape */}
                              <div className="w-40 h-24 bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 rounded-full opacity-90 shadow-2xl">
                                {/* Growth rings */}
                                <div className="absolute inset-2 border-2 border-amber-600/30 rounded-full opacity-60"></div>
                                <div className="absolute inset-4 border-2 border-amber-700/30 rounded-full opacity-40"></div>
                                <div className="absolute inset-6 border-2 border-amber-800/30 rounded-full opacity-30"></div>
                                
                                {/* Measurement guides */}
                                {measurementMode && (
                                  <>
                                    <div className="absolute top-0 left-1/2 w-px h-full bg-red-400 opacity-70 transform -translate-x-0.5"></div>
                                    <div className="absolute top-1/2 left-0 w-full h-px bg-red-400 opacity-70 transform -translate-y-0.5"></div>
                                  </>
                                )}
                              </div>
                              
                              {/* Species indicator */}
                              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-orange-500/30 text-orange-200 text-xs backdrop-blur-sm">
                                  {selectedOtolith.species}
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="w-32 h-20 bg-gradient-to-r from-yellow-200 to-amber-300 rounded-full opacity-60 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Ruler className="w-5 h-5 text-teal-400" />
                        Measurements
                        {measurementMode && (
                          <Badge className="bg-blue-500/20 text-blue-300 text-xs animate-pulse">
                            Live
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Length:</span>
                        <span className="text-white font-medium">{measurements.length} mm</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Width:</span>
                        <span className="text-white font-medium">{measurements.width} mm</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Thickness:</span>
                        <span className="text-white font-medium">{measurements.thickness} mm</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Volume:</span>
                        <span className="text-white font-medium">{measurements.volume} mm³</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-xs">Accuracy:</span>
                          <span className="text-green-400 text-xs font-medium">±0.05mm</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        AI Analysis
                        {selectedOtolith && (
                          <Badge className="bg-green-500/20 text-green-300 text-xs">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Estimated Age:</span>
                        <span className="text-white font-medium">{analysis.age} years</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Growth Rings:</span>
                        <span className="text-white font-medium">{analysis.growthRings} detected</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Species:</span>
                        <span className="text-white font-medium">{analysis.species}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Confidence:</span>
                        <span className="text-white font-medium">{analysis.confidence}%</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <Progress 
                          value={analysis.confidence} 
                          className="h-2 bg-white/10"
                        />
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-slate-400 text-xs">Classification Quality</span>
                          <span className={`text-xs font-medium ${
                            analysis.confidence > 90 ? 'text-green-400' :
                            analysis.confidence > 80 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {analysis.confidence > 90 ? 'Excellent' :
                             analysis.confidence > 80 ? 'Good' : 'Fair'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                    
                    {/* Real-time sequence feedback */}
                    {dnaSequence && (
                      <div className="mt-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                          <span>Sequence Length: <strong className="text-white">{dnaSequence.replace(/[>\n\r\s]/g, '').length} bp</strong></span>
                          <span>GC Content: <strong className="text-white">{
                            ((dnaSequence.match(/[GC]/gi)?.length || 0) / (dnaSequence.replace(/[>\n\r\s]/g, '').length || 1) * 100).toFixed(1)
                          }%</strong></span>
                        </div>
                        <div className="flex gap-4 text-xs">
                          <span className="text-blue-400">A: {dnaSequence.match(/A/gi)?.length || 0}</span>
                          <span className="text-green-400">T: {dnaSequence.match(/T/gi)?.length || 0}</span>
                          <span className="text-yellow-400">G: {dnaSequence.match(/G/gi)?.length || 0}</span>
                          <span className="text-purple-400">C: {dnaSequence.match(/C/gi)?.length || 0}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sample DNA Sequences */}
                  <div>
                    <p className="text-white text-sm font-medium mb-4">Or try these sample sequences:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {sampleDNASequences.map((sample, index) => (
                        <button
                          key={index}
                          onClick={() => handleSampleDNASelect(sample)}
                          className="group relative overflow-hidden rounded-lg border border-white/20 hover:border-purple-400/50 transition-all duration-300 bg-white/5 hover:bg-white/10 p-4 text-left"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Dna className="w-4 h-4 text-purple-400" />
                            <p className="text-sm text-white font-medium">{sample.name}</p>
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{sample.species}</p>
                          <div className="text-xs font-mono text-slate-300 bg-slate-800/50 p-2 rounded mb-2 max-h-16 overflow-hidden">
                            {sample.sequence.substring(0, 120)}...
                          </div>
                          <p className="text-xs text-purple-400">{sample.similarity.toFixed(1)}% expected match</p>
                          
                          {/* Hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {dnaMatchMutation.isPending && (
                    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="relative mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mx-auto flex items-center justify-center animate-pulse">
                              <Dna className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-purple-400/30 border-t-purple-400 animate-spin mx-auto"></div>
                          </div>
                          <h3 className="text-white text-lg font-bold mb-2">DNA Sequence Analysis</h3>
                          <p className="text-purple-300 mb-6">
                            Comparing sequence against marine species database...
                          </p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400">Processing sequence data</span>
                              <span className="text-purple-400 font-medium">Complete</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400">Alignment analysis</span>
                              <span className="text-yellow-400 font-medium">In Progress</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400">Generating similarity scores</span>
                              <span className="text-slate-500 font-medium">Pending</span>
                            </div>
                          </div>
                          <Progress value={70} className="mt-6 h-3 bg-white/10" data-testid="progress-dna-analysis" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleDNAAnalysis}
                      disabled={dnaMatchMutation.isPending || !dnaSequence.trim()}
                      data-testid="button-analyze-dna"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Dna className="w-4 h-4 mr-2" />
                      {dnaMatchMutation.isPending ? 'Analyzing...' : 'Analyze DNA'}
                    </Button>
                    <Button variant="outline" onClick={resetDNAAnalysis} data-testid="button-clear-dna">
                      Clear
                    </Button>
                  </div>

                  {dnaMatches && dnaMatches.length > 0 && (
                    <div className="space-y-6">
                      {/* Success Header */}
                      <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Dna className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">DNA Analysis Complete!</h3>
                        <p className="text-purple-300">Found {dnaMatches.length} potential species matches</p>
                      </div>

                      {/* Primary Match */}
                      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Brain className="w-5 h-5 text-purple-400" />
                            Primary DNA Match
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-white mb-2" data-testid={`dna-match-0-species`}>
                                {dnaMatches[0].species}
                              </p>
                              <p className="text-xl text-purple-300 mb-4" data-testid={`dna-match-0-common`}>
                                {dnaMatches[0].commonName}
                              </p>
                              
                              {/* Similarity Badge */}
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                                <div className={`w-3 h-3 rounded-full ${
                                  dnaMatches[0].similarity >= 95 ? 'bg-green-400 animate-pulse' :
                                  dnaMatches[0].similarity >= 90 ? 'bg-yellow-400 animate-pulse' :
                                  'bg-orange-400 animate-pulse'
                                }`}></div>
                                <span className="text-white font-semibold" data-testid={`dna-match-0-similarity`}>
                                  {dnaMatches[0].similarity.toFixed(1)}% Similarity
                                </span>
                              </div>
                            </div>
                            
                            {/* Enhanced Similarity Visualization */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-300 font-medium">Sequence Alignment</span>
                                <span className={`font-bold ${
                                  dnaMatches[0].similarity >= 95 ? 'text-green-400' :
                                  dnaMatches[0].similarity >= 90 ? 'text-yellow-400' :
                                  'text-orange-400'
                                }`}>
                                  {dnaMatches[0].similarity >= 95 ? 'Excellent Match' :
                                   dnaMatches[0].similarity >= 90 ? 'Strong Match' :
                                   'Moderate Match'}
                                </span>
                              </div>
                              <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    dnaMatches[0].similarity >= 95 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                    dnaMatches[0].similarity >= 90 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                                    'bg-gradient-to-r from-orange-500 to-red-400'
                                  }`}
                                  style={{ width: `${dnaMatches[0].similarity}%` }}
                                >
                                  <div className="h-full bg-white/20 animate-pulse"></div>
                                </div>
                              </div>
                              <div className="flex justify-between text-xs text-slate-400">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                              </div>
                            </div>

                            {/* Analysis Details */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                              <div className="bg-white/5 rounded-lg p-4 text-center">
                                <Dna className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                <p className="text-white text-sm font-medium">Method</p>
                                <p className="text-slate-400 text-xs">BLAST Alignment</p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-4 text-center">
                                <Microscope className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                                <p className="text-white text-sm font-medium">Database</p>
                                <p className="text-slate-400 text-xs">Marine Species</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Alternative Matches */}
                      {dnaMatches.length > 1 && (
                        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-yellow-400" />
                              Alternative DNA Matches
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {dnaMatches.slice(1).map((match, index) => (
                                <div 
                                  key={index + 1} 
                                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200" 
                                  data-testid={`dna-match-${index + 1}`}
                                >
                                  <div className="flex-1">
                                    <p className="font-semibold text-white">{match.species}</p>
                                    <p className="text-sm text-slate-300 italic">{match.commonName}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className={`mb-2 w-20 h-2 rounded-full overflow-hidden ${
                                      match.similarity > 95 ? 'bg-green-900/50' :
                                      match.similarity > 90 ? 'bg-yellow-900/50' :
                                      'bg-orange-900/50'
                                    }`}>
                                      <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                          match.similarity > 95 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                                          match.similarity > 90 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                          'bg-gradient-to-r from-orange-500 to-orange-400'
                                        }`}
                                        style={{ width: `${match.similarity}%` }}
                                      ></div>
                                    </div>
                                    <Badge className={
                                      match.similarity > 95 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                      match.similarity > 90 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                      'bg-orange-500/20 text-orange-400 border-orange-500/30'
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

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <Button 
                          onClick={resetDNAAnalysis}
                          variant="outline"
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                          data-testid="button-clear-dna"
                        >
                          <Dna className="w-4 h-4 mr-2" />
                          Analyze Another
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          data-testid="button-save-dna-results"
                        >
                          <FileImage className="w-4 h-4 mr-2" />
                          Save Results
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Analysis Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-400" />
                  Environmental Data Analysis
                </CardTitle>
                <p className="text-slate-400">
                  Upload CSV data with Date, Temperature, Salinity, and Chlorophyll measurements for real-time insights
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* File Upload Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="csv-upload" className="text-white mb-2 block">
                          Upload CSV File
                        </Label>
                        <Input
                          id="csv-upload"
                          type="file"
                          accept=".csv"
                          onChange={handleCSVUpload}
                          className="bg-white/5 border-white/20 text-white file:bg-teal-500/20 file:text-teal-300 file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-lg hover:file:bg-teal-500/30"
                        />
                        <p className="text-xs text-slate-400 mt-2">
                          Expected format: Date,Temperature(°C),Salinity(PSU),Chlorophyll(mg/m³)
                        </p>
                      </div>
                      
                      <Button 
                        onClick={loadSampleData}
                        variant="outline"
                        className="w-full border-teal-500/30 text-teal-300 hover:bg-teal-500/10"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Load Sample Data
                      </Button>
                    </div>

                    {/* Quick Stats */}
                    {environmentalData.length > 0 && (
                      <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-xl p-4 border border-teal-500/20">
                        <h3 className="text-white font-semibold mb-3">Dataset Overview</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Data Points:</span>
                            <span className="text-teal-300 font-medium">{environmentalData.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Date Range:</span>
                            <span className="text-teal-300 font-medium">
                              {environmentalData[0]?.date} - {environmentalData[environmentalData.length - 1]?.date}
                            </span>
                          </div>
                          {dataInsights && (
                            <div className="flex justify-between">
                              <span className="text-slate-300">Quality Score:</span>
                              <span className="text-teal-300 font-medium">{dataInsights.dataQuality.toFixed(0)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Loading State */}
                  {isAnalyzing && (
                    <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                          <div>
                            <p className="text-white font-medium">Analyzing Environmental Data...</p>
                            <p className="text-slate-400 text-sm">Processing measurements and generating insights</p>
                          </div>
                        </div>
                        <Progress value={66} className="mt-4 h-2" />
                      </CardContent>
                    </Card>
                  )}

                  {/* Charts and Insights */}
                  {environmentalData.length > 0 && dataInsights && !isAnalyzing && (
                    <div className="space-y-6">
                      {/* Key Insights */}
                      <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-teal-400" />
                            Environmental Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white/5 rounded-lg p-4 text-center">
                              <p className="text-2xl font-bold text-blue-400">{dataInsights.avgTemperature.toFixed(1)}°C</p>
                              <p className="text-slate-300 text-sm">Avg Temperature</p>
                              <Badge className={`mt-2 ${
                                dataInsights.temperatureTrend === 'increasing' ? 'bg-red-500/20 text-red-300' :
                                dataInsights.temperatureTrend === 'decreasing' ? 'bg-blue-500/20 text-blue-300' :
                                'bg-green-500/20 text-green-300'
                              }`}>
                                {dataInsights.temperatureTrend}
                              </Badge>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 text-center">
                              <p className="text-2xl font-bold text-purple-400">{dataInsights.avgSalinity.toFixed(1)} PSU</p>
                              <p className="text-slate-300 text-sm">Avg Salinity</p>
                              <Badge className={`mt-2 ${
                                dataInsights.salinityTrend === 'increasing' ? 'bg-red-500/20 text-red-300' :
                                dataInsights.salinityTrend === 'decreasing' ? 'bg-blue-500/20 text-blue-300' :
                                'bg-green-500/20 text-green-300'
                              }`}>
                                {dataInsights.salinityTrend}
                              </Badge>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 text-center">
                              <p className="text-2xl font-bold text-green-400">{dataInsights.avgChlorophyll.toFixed(2)} mg/m³</p>
                              <p className="text-slate-300 text-sm">Avg Chlorophyll</p>
                              <Badge className={`mt-2 ${
                                dataInsights.chlorophyllTrend === 'increasing' ? 'bg-green-500/20 text-green-300' :
                                dataInsights.chlorophyllTrend === 'decreasing' ? 'bg-red-500/20 text-red-300' :
                                'bg-blue-500/20 text-blue-300'
                              }`}>
                                {dataInsights.chlorophyllTrend}
                              </Badge>
                            </div>
                          </div>

                          {/* Recommendations */}
                          <div className="bg-white/5 rounded-lg p-4">
                            <h4 className="text-white font-medium mb-3">AI Recommendations</h4>
                            <div className="space-y-2">
                              {dataInsights.recommendations.map((rec, index) => (
                                <p key={index} className="text-slate-300 text-sm leading-relaxed">{rec}</p>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Temperature Chart */}
                      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white">Temperature Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={environmentalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#9CA3AF"
                                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <YAxis 
                                  stroke="#9CA3AF"
                                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F3F4F6'
                                  }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="temperature" 
                                  stroke="#3B82F6" 
                                  strokeWidth={2}
                                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Salinity Chart */}
                      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white">Salinity Levels</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={environmentalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#9CA3AF"
                                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <YAxis 
                                  stroke="#9CA3AF"
                                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F3F4F6'
                                  }}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="salinity" 
                                  stroke="#8B5CF6" 
                                  fill="url(#colorSalinity)"
                                  strokeWidth={2}
                                />
                                <defs>
                                  <linearGradient id="colorSalinity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Chlorophyll Chart */}
                      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white">Chlorophyll Concentration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={environmentalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#9CA3AF"
                                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <YAxis 
                                  stroke="#9CA3AF"
                                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F3F4F6'
                                  }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="chlorophyll" 
                                  stroke="#10B981" 
                                  strokeWidth={2}
                                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Reset Button */}
                      <div className="text-center">
                        <Button 
                          onClick={resetDataAnalysis}
                          variant="outline"
                          className="border-slate-500 text-slate-300 hover:bg-slate-700/50"
                        >
                          Reset Analysis
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {environmentalData.length === 0 && !isAnalyzing && (
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardContent className="p-12 text-center">
                        <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Data Loaded</h3>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">
                          Upload a CSV file with environmental data or load sample data to see real-time analysis and insights
                        </p>
                        <Button 
                          onClick={loadSampleData}
                          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Try Sample Data
                        </Button>
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
