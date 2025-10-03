import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Activity, Waves, Thermometer, Droplets, Wind, 
  Fish, BarChart3, TrendingUp, TrendingDown, 
  Zap, Globe, Eye, Play, Pause, RotateCcw,
  Sparkles, Brain, Target, Database, AlertTriangle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Digital Twin Environmental Parameters
interface EnvironmentalParams {
  temperature: number;    // 20-32°C
  salinity: number;      // 30-37 PSU
  phLevel: number;       // 7.8-8.3
  oxygenLevel: number;   // 4-8 mg/L
  turbidity: number;     // 0-10 NTU
  currentSpeed: number;  // 0-2 m/s
  depth: number;         // 10-200m
  nutrientLevel: number; // 0-100 μg/L
}

interface SpeciesData {
  id: string;
  name: string;
  scientificName: string;
  abundance: number;
  biomass: number;
  reproductionRate: number;
  survivalRate: number;
  migrationPattern: number;
  emoji: string;
  color: string;
  optimalTemp: [number, number];
  optimalSalinity: [number, number];
  optimalPH: [number, number];
}

// Mock species database
const marineSpecies: SpeciesData[] = [
  {
    id: 'tuna',
    name: 'Yellowfin Tuna',
    scientificName: 'Thunnus albacares',
    abundance: 1200,
    biomass: 15000,
    reproductionRate: 0.8,
    survivalRate: 0.75,
    migrationPattern: 0.9,
    emoji: '🐟',
    color: '#3b82f6',
    optimalTemp: [24, 28],
    optimalSalinity: [34, 36],
    optimalPH: [8.0, 8.2]
  },
  {
    id: 'sardine',
    name: 'Oil Sardine',
    scientificName: 'Sardinella longiceps',
    abundance: 8500,
    biomass: 25000,
    reproductionRate: 1.2,
    survivalRate: 0.65,
    migrationPattern: 0.7,
    emoji: '🐠',
    color: '#10b981',
    optimalTemp: [26, 30],
    optimalSalinity: [33, 35],
    optimalPH: [7.9, 8.1]
  },
  {
    id: 'mackerel',
    name: 'Indian Mackerel',
    scientificName: 'Rastrelliger kanagurta',
    abundance: 6200,
    biomass: 18500,
    reproductionRate: 1.0,
    survivalRate: 0.70,
    migrationPattern: 0.6,
    emoji: '🐡',
    color: '#f59e0b',
    optimalTemp: [25, 29],
    optimalSalinity: [34, 36],
    optimalPH: [8.0, 8.3]
  },
  {
    id: 'pomfret',
    name: 'Silver Pomfret',
    scientificName: 'Pampus argenteus',
    abundance: 3400,
    biomass: 12000,
    reproductionRate: 0.7,
    survivalRate: 0.80,
    migrationPattern: 0.4,
    emoji: '🐟',
    color: '#8b5cf6',
    optimalTemp: [22, 26],
    optimalSalinity: [35, 37],
    optimalPH: [8.1, 8.3]
  },
  {
    id: 'prawn',
    name: 'Tiger Prawn',
    scientificName: 'Penaeus monodon',
    abundance: 4800,
    biomass: 8000,
    reproductionRate: 1.5,
    survivalRate: 0.60,
    migrationPattern: 0.3,
    emoji: '🦐',
    color: '#ef4444',
    optimalTemp: [28, 32],
    optimalSalinity: [32, 34],
    optimalPH: [7.8, 8.0]
  }
];

// Ecosystem zones with different characteristics
const ecosystemZones = [
  { name: 'Coastal', depth: 20, productivity: 0.9, species: ['sardine', 'prawn'] },
  { name: 'Continental Shelf', depth: 80, productivity: 0.7, species: ['mackerel', 'pomfret'] },
  { name: 'Pelagic', depth: 150, productivity: 0.5, species: ['tuna'] },
  { name: 'Deep Sea', depth: 200, productivity: 0.3, species: ['tuna', 'pomfret'] }
];

// AI Prediction Model (Simplified)
const predictSpeciesAbundance = (species: SpeciesData, params: EnvironmentalParams): number => {
  let multiplier = 1.0;
  
  // Temperature factor
  const tempOptimal = (species.optimalTemp[0] + species.optimalTemp[1]) / 2;
  const tempDiff = Math.abs(params.temperature - tempOptimal);
  multiplier *= Math.max(0.2, 1 - (tempDiff / 10));
  
  // Salinity factor
  const salinityOptimal = (species.optimalSalinity[0] + species.optimalSalinity[1]) / 2;
  const salinityDiff = Math.abs(params.salinity - salinityOptimal);
  multiplier *= Math.max(0.3, 1 - (salinityDiff / 5));
  
  // pH factor
  const phOptimal = (species.optimalPH[0] + species.optimalPH[1]) / 2;
  const phDiff = Math.abs(params.phLevel - phOptimal);
  multiplier *= Math.max(0.4, 1 - (phDiff / 0.5));
  
  // Oxygen factor
  multiplier *= Math.min(1.0, params.oxygenLevel / 6);
  
  // Turbidity factor (inverse relationship)
  multiplier *= Math.max(0.3, 1 - (params.turbidity / 15));
  
  // Nutrient factor
  multiplier *= Math.min(1.0, params.nutrientLevel / 50);
  
  return Math.round(species.abundance * multiplier);
};

export default function DigitalTwinPage() {
  // Environmental parameters state
  const [envParams, setEnvParams] = useState<EnvironmentalParams>({
    temperature: 26,
    salinity: 34,
    phLevel: 8.1,
    oxygenLevel: 6,
    turbidity: 3,
    currentSpeed: 0.8,
    depth: 50,
    nutrientLevel: 40
  });

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [timeStep, setTimeStep] = useState(0);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'species' | 'ecosystem'>('overview');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showPredictions, setShowPredictions] = useState(true);

  // Calculated data
  const [speciesData, setSpeciesData] = useState<SpeciesData[]>(marineSpecies);
  const [ecosystemHealth, setEcosystemHealth] = useState(75);
  const [biodiversityIndex, setBiodiversityIndex] = useState(0.8);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  // Update species data based on environmental parameters
  const updateEcosystem = useCallback(() => {
    const updatedSpecies = marineSpecies.map(species => {
      const newAbundance = predictSpeciesAbundance(species, envParams);
      const biomassRatio = species.abundance > 0 ? (species.biomass / species.abundance) : 1;
      return {
        ...species,
        abundance: newAbundance,
        biomass: Math.round(newAbundance * biomassRatio)
      };
    });
    
    setSpeciesData(updatedSpecies);
    
    // Calculate ecosystem health
    const totalAbundance = updatedSpecies.reduce((sum, s) => sum + s.abundance, 0);
    const maxPossibleAbundance = marineSpecies.reduce((sum, s) => sum + s.abundance, 0);
    const health = Math.round((totalAbundance / maxPossibleAbundance) * 100);
    setEcosystemHealth(health);
    
    // Calculate biodiversity index (Shannon diversity)
    const totalBiomass = updatedSpecies.reduce((sum, s) => sum + s.biomass, 0);
    let diversity = 0;
    updatedSpecies.forEach(species => {
      if (species.biomass > 0) {
        const proportion = species.biomass / totalBiomass;
        diversity -= proportion * Math.log(proportion);
      }
    });
    setBiodiversityIndex(Math.round(diversity * 100) / 100);
    
  }, [envParams]);

  // Update ecosystem when parameters change
  useEffect(() => {
    updateEcosystem();
  }, [updateEcosystem]);

  // Simulation loop
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setTimeStep(prev => prev + 1);
        
        // Add to historical data with error handling
        setHistoricalData(prev => {
          try {
            const newData = {
              time: prev.length,
              totalAbundance: speciesData.reduce((sum, s) => sum + (s.abundance || 0), 0),
              ecosystemHealth: ecosystemHealth || 0,
              biodiversityIndex: biodiversityIndex || 0,
              temperature: envParams.temperature || 26,
              ...speciesData.reduce((acc, species) => ({
                ...acc,
                [species.name]: species.abundance || 0
              }), {})
            };
            return [...prev.slice(-19), newData]; // Keep last 20 points
          } catch (error) {
            console.warn('Error updating historical data:', error);
            return prev;
          }
        });
        
        // Simulate natural variations
        if (Math.random() < 0.3) {
          setEnvParams(prev => ({
            ...prev,
            temperature: Math.max(20, Math.min(32, prev.temperature + (Math.random() - 0.5) * 0.5)),
            oxygenLevel: Math.max(4, Math.min(8, prev.oxygenLevel + (Math.random() - 0.5) * 0.2)),
            nutrientLevel: Math.max(0, Math.min(100, prev.nutrientLevel + (Math.random() - 0.5) * 5))
          }));
        }
      }, 2000 / simulationSpeed);
      
      return () => clearInterval(interval);
    }
  }, [isSimulating, simulationSpeed, speciesData, ecosystemHealth, biodiversityIndex, envParams]);

  // AI Insights state
  const [insights, setInsights] = useState<Array<{
    id: string;
    type: 'warning' | 'success' | 'info' | 'critical';
    title: string;
    description: string;
    impact: string;
    timestamp: Date;
    confidence: number;
  }>>([]);

  // Generate AI insights based on environmental changes
  const generateInsights = useCallback(() => {
    const newInsights: typeof insights = [];
    const baselineParams = {
      temperature: 26,
      salinity: 34,
      phLevel: 8.1,
      oxygenLevel: 6,
      turbidity: 3,
      nutrientLevel: 40
    };

    // Temperature insights
    const tempDiff = envParams.temperature - baselineParams.temperature;
    if (Math.abs(tempDiff) > 2) {
      const affectedSpecies = speciesData.filter(species => {
        const optimalTemp = (species.optimalTemp[0] + species.optimalTemp[1]) / 2;
        return Math.abs(envParams.temperature - optimalTemp) > 2;
      });
      
      if (affectedSpecies.length > 0) {
        const worstAffected = affectedSpecies.reduce((worst, current) => {
          const worstDiff = Math.abs(envParams.temperature - (worst.optimalTemp[0] + worst.optimalTemp[1]) / 2);
          const currentDiff = Math.abs(envParams.temperature - (current.optimalTemp[0] + current.optimalTemp[1]) / 2);
          return currentDiff > worstDiff ? current : worst;
        });

        const originalSpecies = marineSpecies.find(s => s.id === worstAffected.id)!;
        const populationChange = ((worstAffected.abundance - originalSpecies.abundance) / originalSpecies.abundance * 100);

        newInsights.push({
          id: `temp-${Date.now()}`,
          type: Math.abs(populationChange) > 30 ? 'critical' : 'warning',
          title: `Temperature Impact on ${worstAffected.name}`,
          description: `${tempDiff > 0 ? 'Rising' : 'Falling'} temperature (${envParams.temperature.toFixed(1)}°C) in marine zones`,
          impact: `${Math.abs(populationChange).toFixed(1)}% ${populationChange > 0 ? 'increase' : 'decrease'} in ${worstAffected.name} population`,
          timestamp: new Date(),
          confidence: 0.85
        });
      }
    }

    // Salinity insights
    const salinityDiff = envParams.salinity - baselineParams.salinity;
    if (Math.abs(salinityDiff) > 1.5) {
      const sardineData = speciesData.find(s => s.id === 'sardine');
      if (sardineData) {
        const originalSardine = marineSpecies.find(s => s.id === 'sardine')!;
        const populationChange = ((sardineData.abundance - originalSardine.abundance) / originalSardine.abundance * 100);
        
        newInsights.push({
          id: `salinity-${Date.now()}`,
          type: Math.abs(populationChange) > 25 ? 'critical' : 'warning',
          title: `Salinity Shift in Northern EEZ`,
          description: `${salinityDiff > 0 ? 'Rising' : 'Falling'} salinity levels (${envParams.salinity.toFixed(1)} PSU) detected`,
          impact: `${Math.abs(populationChange).toFixed(1)}% ${populationChange > 0 ? 'boost' : 'drop'} in Sardinella population`,
          timestamp: new Date(),
          confidence: 0.78
        });
      }
    }

    // Oxygen insights
    const oxygenDiff = envParams.oxygenLevel - baselineParams.oxygenLevel;
    if (oxygenDiff < -1) {
      newInsights.push({
        id: `oxygen-${Date.now()}`,
        type: 'critical',
        title: `Hypoxic Conditions Detected`,
        description: `Dangerously low oxygen levels (${envParams.oxygenLevel.toFixed(1)} mg/L) in coastal waters`,
        impact: `Potential mass mortality event for benthic species`,
        timestamp: new Date(),
        confidence: 0.92
      });
    }

    // pH acidification insights
    const phDiff = envParams.phLevel - baselineParams.phLevel;
    if (phDiff < -0.2) {
      newInsights.push({
        id: `ph-${Date.now()}`,
        type: 'warning',
        title: `Ocean Acidification Alert`,
        description: `pH levels dropping to ${envParams.phLevel.toFixed(2)} - approaching critical threshold`,
        impact: `Coral reef systems and shell-forming organisms at risk`,
        timestamp: new Date(),
        confidence: 0.88
      });
    }

    // Nutrient insights
    const nutrientDiff = envParams.nutrientLevel - baselineParams.nutrientLevel;
    if (nutrientDiff > 30) {
      newInsights.push({
        id: `nutrient-${Date.now()}`,
        type: 'warning',
        title: `Eutrophication Risk`,
        description: `Elevated nutrient levels (${envParams.nutrientLevel.toFixed(0)} μg/L) detected`,
        impact: `Algal bloom potential - oxygen depletion risk in 48-72 hours`,
        timestamp: new Date(),
        confidence: 0.73
      });
    } else if (nutrientDiff < -20) {
      newInsights.push({
        id: `nutrient-low-${Date.now()}`,
        type: 'info',
        title: `Oligotrophic Conditions`,
        description: `Low nutrient levels (${envParams.nutrientLevel.toFixed(0)} μg/L) creating pristine waters`,
        impact: `Enhanced water clarity but reduced primary productivity`,
        timestamp: new Date(),
        confidence: 0.81
      });
    }

    // Ecosystem health insights
    if (ecosystemHealth < 60) {
      newInsights.push({
        id: `ecosystem-${Date.now()}`,
        type: 'critical',
        title: `Ecosystem Stress Indicator`,
        description: `Overall ecosystem health declining to ${ecosystemHealth}%`,
        impact: `Multi-species population crash imminent - immediate intervention required`,
        timestamp: new Date(),
        confidence: 0.95
      });
    } else if (ecosystemHealth > 90) {
      newInsights.push({
        id: `ecosystem-good-${Date.now()}`,
        type: 'success',
        title: `Optimal Ecosystem Conditions`,
        description: `Ecosystem health at ${ecosystemHealth}% - thriving marine environment`,
        impact: `Perfect conditions for biodiversity conservation and sustainable fishing`,
        timestamp: new Date(),
        confidence: 0.91
      });
    }

    // Biodiversity insights
    if (biodiversityIndex < 0.5) {
      newInsights.push({
        id: `biodiversity-${Date.now()}`,
        type: 'critical',
        title: `Biodiversity Loss Alert`,
        description: `Shannon diversity index dropped to ${biodiversityIndex.toFixed(2)}`,
        impact: `Ecosystem becoming dominated by single species - resilience compromised`,
        timestamp: new Date(),
        confidence: 0.87
      });
    }

    // Species-specific insights for dramatic changes
    speciesData.forEach(species => {
      const original = marineSpecies.find(s => s.id === species.id)!;
      const change = ((species.abundance - original.abundance) / original.abundance * 100);
      
      if (Math.abs(change) > 50) {
        newInsights.push({
          id: `species-${species.id}-${Date.now()}`,
          type: Math.abs(change) > 70 ? 'critical' : 'warning',
          title: `${species.name} Population ${change > 0 ? 'Boom' : 'Crash'}`,
          description: `Dramatic ${Math.abs(change).toFixed(1)}% ${change > 0 ? 'increase' : 'decrease'} in ${species.name} numbers`,
          impact: `${change > 0 ? 'Overpopulation may lead to resource competition' : 'Species at risk - conservation action needed'}`,
          timestamp: new Date(),
          confidence: 0.83
        });
      }
    });

    // Keep only the latest 5 insights
    setInsights(prev => [...newInsights, ...prev].slice(0, 5));
  }, [envParams, speciesData, ecosystemHealth, biodiversityIndex]);

  // Generate insights when parameters change significantly
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateInsights();
    }, 1000); // Debounce insights generation
    
    return () => clearTimeout(timeoutId);
  }, [generateInsights]);

  // Reset simulation
  const resetSimulation = () => {
    setTimeStep(0);
    setHistoricalData([]);
    setInsights([]);
    setEnvParams({
      temperature: 26,
      salinity: 34,
      phLevel: 8.1,
      oxygenLevel: 6,
      turbidity: 3,
      currentSpeed: 0.8,
      depth: 50,
      nutrientLevel: 40
    });
  };

  // Parameter change handlers
  const updateParameter = (param: keyof EnvironmentalParams, value: number) => {
    setEnvParams(prev => ({ ...prev, [param]: value }));
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <Brain className="w-10 h-10 text-cyan-400" />
              Digital Twin Marine Ecosystem
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                AI-Powered
              </Badge>
            </h1>
            <p className="text-slate-400 text-lg mt-2">Real-time ecosystem simulation & predictive modeling</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">AI Model Active</span>
            </div>
            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              variant={isSimulating ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isSimulating ? 'Pause' : 'Start'} Simulation
            </Button>
            <Button onClick={resetSimulation} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-slate-700/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{timeStep}</div>
                <div className="text-xs text-slate-400">Time Steps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{ecosystemHealth}%</div>
                <div className="text-xs text-slate-400">Ecosystem Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{biodiversityIndex}</div>
                <div className="text-xs text-slate-400">Biodiversity Index</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{speciesData.reduce((sum, s) => sum + s.abundance, 0).toLocaleString()}</div>
                <div className="text-xs text-slate-400">Total Fish</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{envParams.temperature.toFixed(1)}°C</div>
                <div className="text-xs text-slate-400">Water Temp</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{envParams.oxygenLevel.toFixed(1)}</div>
                <div className="text-xs text-slate-400">Oxygen (mg/L)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        {insights.length > 0 && (
          <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-xl border-indigo-700/50 shadow-2xl shadow-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                <Brain className="w-6 h-6 text-indigo-400" />
                AI-Generated Insights
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs animate-pulse">
                  LIVE ANALYSIS
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {insights.map((insight, index) => {
                  const getInsightColor = (type: typeof insight.type) => {
                    switch (type) {
                      case 'critical': return 'from-red-500 to-pink-600';
                      case 'warning': return 'from-yellow-500 to-orange-600';
                      case 'success': return 'from-green-500 to-emerald-600';
                      case 'info': return 'from-blue-500 to-cyan-600';
                      default: return 'from-gray-500 to-slate-600';
                    }
                  };

                  const getInsightIcon = (type: typeof insight.type) => {
                    switch (type) {
                      case 'critical': return '🚨';
                      case 'warning': return '⚠️';
                      case 'success': return '✅';
                      case 'info': return 'ℹ️';
                      default: return '📊';
                    }
                  };

                  return (
                    <div 
                      key={insight.id}
                      className={`p-4 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type)}/10 border border-${insight.type === 'critical' ? 'red' : insight.type === 'warning' ? 'yellow' : insight.type === 'success' ? 'green' : 'blue'}-500/30 hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white text-sm">{insight.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  insight.type === 'critical' ? 'text-red-400 border-red-400/30' :
                                  insight.type === 'warning' ? 'text-yellow-400 border-yellow-400/30' :
                                  insight.type === 'success' ? 'text-green-400 border-green-400/30' :
                                  'text-blue-400 border-blue-400/30'
                                }`}
                              >
                                {(insight.confidence * 100).toFixed(0)}% confidence
                              </Badge>
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm">{insight.description}</p>
                          <div className="bg-slate-900/50 rounded p-2 border-l-4 border-indigo-400">
                            <p className="text-indigo-300 text-sm font-medium">
                              <strong>Impact:</strong> {insight.impact}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{insight.timestamp.toLocaleTimeString()}</span>
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              <span>AI Prediction Model</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Environmental Controls */}
          <Card className="lg:col-span-1 bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Environmental Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Temperature */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    Temperature
                  </Label>
                  <Badge variant="outline" className="text-red-400 border-red-400/30">
                    {envParams.temperature.toFixed(1)}°C
                  </Badge>
                </div>
                <Slider
                  value={[envParams.temperature]}
                  onValueChange={([value]) => updateParameter('temperature', value)}
                  min={20}
                  max={32}
                  step={0.1}
                  className="[&_[role=slider]]:bg-red-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>20°C</span>
                  <span>32°C</span>
                </div>
              </div>

              {/* Salinity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    Salinity
                  </Label>
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                    {envParams.salinity.toFixed(1)} PSU
                  </Badge>
                </div>
                <Slider
                  value={[envParams.salinity]}
                  onValueChange={([value]) => updateParameter('salinity', value)}
                  min={30}
                  max={37}
                  step={0.1}
                  className="[&_[role=slider]]:bg-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>30 PSU</span>
                  <span>37 PSU</span>
                </div>
              </div>

              {/* pH Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    pH Level
                  </Label>
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    {envParams.phLevel.toFixed(2)}
                  </Badge>
                </div>
                <Slider
                  value={[envParams.phLevel]}
                  onValueChange={([value]) => updateParameter('phLevel', value)}
                  min={7.8}
                  max={8.3}
                  step={0.01}
                  className="[&_[role=slider]]:bg-green-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>7.8</span>
                  <span>8.3</span>
                </div>
              </div>

              {/* Oxygen Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    Oxygen
                  </Label>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                    {envParams.oxygenLevel.toFixed(1)} mg/L
                  </Badge>
                </div>
                <Slider
                  value={[envParams.oxygenLevel]}
                  onValueChange={([value]) => updateParameter('oxygenLevel', value)}
                  min={4}
                  max={8}
                  step={0.1}
                  className="[&_[role=slider]]:bg-cyan-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>4 mg/L</span>
                  <span>8 mg/L</span>
                </div>
              </div>

              {/* Turbidity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    Turbidity
                  </Label>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                    {envParams.turbidity.toFixed(1)} NTU
                  </Badge>
                </div>
                <Slider
                  value={[envParams.turbidity]}
                  onValueChange={([value]) => updateParameter('turbidity', value)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="[&_[role=slider]]:bg-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0 NTU</span>
                  <span>10 NTU</span>
                </div>
              </div>

              {/* Nutrient Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Nutrients
                  </Label>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                    {envParams.nutrientLevel.toFixed(0)} μg/L
                  </Badge>
                </div>
                <Slider
                  value={[envParams.nutrientLevel]}
                  onValueChange={([value]) => updateParameter('nutrientLevel', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-yellow-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0 μg/L</span>
                  <span>100 μg/L</span>
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="pt-4 border-t border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Auto Simulation</Label>
                  <Switch
                    checked={isSimulating}
                    onCheckedChange={setIsSimulating}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Speed: {simulationSpeed}x</Label>
                  <Slider
                    value={[simulationSpeed]}
                    onValueChange={([value]) => setSimulationSpeed(value)}
                    min={0.5}
                    max={5}
                    step={0.5}
                    className="[&_[role=slider]]:bg-indigo-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Species Population Chart */}
            <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Real-time Species Population
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={speciesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9ca3af"
                        fontSize={12}
                      />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px' 
                        }}
                      />
                      <Area 
                        dataKey="abundance" 
                        stroke="#3b82f6" 
                        fill="url(#colorAbundance)" 
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="colorAbundance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Historical Trends */}
            {historicalData.length > 2 && (
              <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Ecosystem Trends Over Time ({historicalData.length} data points)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                        <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px' 
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="ecosystemHealth" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Ecosystem Health %"
                          yAxisId="left"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="totalAbundance" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Total Fish Count"
                          yAxisId="right"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          name="Temperature °C"
                          yAxisId="left"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Species Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {speciesData.map(species => {
                const originalSpecies = marineSpecies.find(s => s.id === species.id)!;
                const percentageChange = ((species.abundance - originalSpecies.abundance) / originalSpecies.abundance) * 100;
                
                return (
                  <Card 
                    key={species.id} 
                    className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 cursor-pointer"
                    style={{ borderColor: `${species.color}40` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{species.emoji}</span>
                          <div>
                            <h3 className="font-bold text-white text-sm">{species.name}</h3>
                            <p className="text-xs text-slate-400 italic">{species.scientificName}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={percentageChange >= 0 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {percentageChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {percentageChange.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Population:</span>
                          <span className="font-bold" style={{ color: species.color }}>
                            {species.abundance.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Biomass:</span>
                          <span className="text-slate-300">{species.biomass.toLocaleString()} kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Survival Rate:</span>
                          <span className="text-slate-300">{(species.survivalRate * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="text-xs text-slate-500">
                          Optimal: {species.optimalTemp[0]}-{species.optimalTemp[1]}°C, 
                          pH {species.optimalPH[0]}-{species.optimalPH[1]}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}