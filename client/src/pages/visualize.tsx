import React, { useState, useCallback, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Map, BarChart3, Layers, ZoomIn, Sparkles, TrendingUp, Settings,
  Upload, FileText, Image, Database, Eye, EyeOff, Maximize2, Filter,
  Play, Pause, RotateCcw, Share2, Save, Trash2, Plus, Minus, Grid3X3,
  Activity, Waves, Thermometer, Droplets, Wind, Sun, Moon, X, MapPin,
  Zap, AlertTriangle, Fish
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const temperatureData = [
  { month: 'Jan', fish: 65, coral: 82, plankton: 78 },
  { month: 'Feb', fish: 68, coral: 85, plankton: 82 },
  { month: 'Mar', fish: 72, coral: 88, plankton: 85 },
  { month: 'Apr', fish: 75, coral: 92, plankton: 88 },
  { month: 'May', fish: 78, coral: 95, plankton: 92 },
  { month: 'Jun', fish: 82, coral: 98, plankton: 95 },
];

const scatterData = [
  { temperature: 18, ph: 8.1 }, { temperature: 19, ph: 8.0 },
  { temperature: 20, ph: 7.9 }, { temperature: 21, ph: 7.8 },
  { temperature: 22, ph: 7.7 }, { temperature: 23, ph: 7.6 },
  { temperature: 24, ph: 7.5 }, { temperature: 25, ph: 7.4 },
];

const speciesData = [
  { name: 'Blue Rockfish', value: 25, color: '#3b82f6' },
  { name: 'Kelp Bass', value: 20, color: '#10b981' },
  { name: 'Yellowtail', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 40, color: '#8b5cf6' },
];

export default function Visualize() {
  const [selectedDataset, setSelectedDataset] = useState('kelp-survey');
  const [dataset, setDataset] = useState('kelp-forest');
  const [mapType, setMapType] = useState('satellite');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showTemperature, setShowTemperature] = useState(false);
  const [showCurrents, setShowCurrents] = useState(false);
  const [showSpecies, setShowSpecies] = useState(true);
  
  // Digital Twin Simulator state
  const [tempIncrease, setTempIncrease] = useState(0);
  const [salinityIncrease, setSalinityIncrease] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [ecosystemHealth, setEcosystemHealth] = useState(100);
  const [speciesPopulations, setSpeciesPopulations] = useState({
    sardine: 100,
    anchovy: 100,
    cod: 100,
    kelp: 100,
    plankton: 100
  });
  const [environmentalEvents, setEnvironmentalEvents] = useState<string[]>([]);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPNG = () => {
    console.log('Exporting as PNG...');
  };

  const handleExportCSV = () => {
    console.log('Exporting as CSV...');
  };

  // Enhanced Digital Twin Simulation Logic
  const updateEcosystemState = () => {
    // Calculate species population changes based on environmental factors
    const newPopulations = {
      sardine: Math.max(0, 100 - (tempIncrease * 18) - (salinityIncrease * 5)),
      anchovy: Math.max(0, 100 - (salinityIncrease * 25) - (tempIncrease * 8)),
      cod: Math.max(0, 100 - (tempIncrease * 12) - (salinityIncrease * 3)),
      kelp: Math.max(0, 100 - (tempIncrease * 20) - (salinityIncrease * 15)),
      plankton: Math.max(0, 100 - (tempIncrease * 15) - (salinityIncrease * 10))
    };

    setSpeciesPopulations(newPopulations);

    // Calculate overall ecosystem health
    const avgPopulation = Object.values(newPopulations).reduce((a, b) => a + b, 0) / 5;
    setEcosystemHealth(Math.max(0, Math.min(100, avgPopulation)));

    // Generate environmental events
    const events: string[] = [];
    if (tempIncrease > 2.5) events.push('🌡️ Critical temperature rise detected');
    if (tempIncrease > 1.5) events.push('🐟 Fish migration patterns shifting northward');
    if (salinityIncrease > 2) events.push('💧 Extreme salinity levels affecting marine life');
    if (salinityIncrease > 1) events.push('🦐 Crustacean populations under stress');
    if (avgPopulation < 50) events.push('⚠️ Ecosystem collapse risk detected');
    if (avgPopulation < 70) events.push('📉 Biodiversity decline accelerating');

    setEnvironmentalEvents(events);
  };

  const startSimulation = () => {
    setIsSimulationRunning(true);
    setSimulationTime(0);
    
    const interval = setInterval(() => {
      setSimulationTime(prev => {
        const newTime = prev + simulationSpeed;
        if (newTime >= 100) {
          setIsSimulationRunning(false);
          clearInterval(interval);
          return 100;
        }
        return newTime;
      });
      updateEcosystemState();
    }, 200);
    
    setSimulationInterval(interval);
  };

  const pauseSimulation = () => {
    setIsSimulationRunning(false);
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
  };

  const resetSimulation = () => {
    setIsSimulationRunning(false);
    setSimulationTime(0);
    setTempIncrease(0);
    setSalinityIncrease(0);
    setSpeciesPopulations({ sardine: 100, anchovy: 100, cod: 100, kelp: 100, plankton: 100 });
    setEcosystemHealth(100);
    setEnvironmentalEvents([]);
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
  };

  // Update ecosystem when environmental parameters change
  React.useEffect(() => {
    updateEcosystemState();
  }, [tempIncrease, salinityIncrease]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    for (let i = 0; i < files.length; i++) {
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setUploadedFiles(prev => [...prev, ...files]);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleZoomToData = () => {
    console.log('Zooming to data...');
  };

  const breadcrumbs = [
    { label: 'Visualizations' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Existing gradient orbs */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Additional ambient floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`ambient-${i}`}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${4 + Math.random() * 6}s`
              }}
            />
          ))}
          
          {/* Subtle flowing light streams */}
          <div className="absolute top-0 left-1/5 w-px h-full bg-gradient-to-b from-transparent via-blue-400/10 to-transparent animate-shimmer"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent animate-shimmer" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Ambient glow areas */}
          <div className="absolute top-1/4 left-0 w-32 h-96 bg-gradient-to-r from-blue-500/5 to-transparent rounded-r-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-0 w-32 h-96 bg-gradient-to-l from-emerald-500/5 to-transparent rounded-l-full blur-2xl"></div>
        </div>

        <div className="relative z-10 p-3 space-y-4 max-w-5xl mx-auto">
          {/* Hero Header */}
          <div className="text-center space-y-3 py-4">
            <div className="relative inline-block">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-teal-500/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mb-2 mx-auto animate-pulse">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                Data Visualizations
              </h1>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Interactive maps and charts for comprehensive marine data analysis
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <Button 
                onClick={handleExportPNG} 
                data-testid="button-export-png" 
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-lg px-3 py-1.5 text-xs transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                <Download className="w-3 h-3 mr-1" />
                Export PNG
              </Button>
              <Button 
                onClick={handleExportCSV} 
                data-testid="button-export-csv" 
                variant="outline" 
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-lg px-3 py-1.5 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Export CSV
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-lg px-3 py-1.5 text-xs">
                <Share2 className="w-3 h-3 mr-1" />
                Share
              </Button>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <Tabs defaultValue="map" className="w-full" data-testid="tabs-visualization">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-lg mb-3">
              <TabsTrigger 
                value="map" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-white text-slate-400 rounded-md transition-all duration-300 text-xs py-1.5 px-2"
              >
                <MapPin className="w-3 h-3 mr-1" />
                Map View
              </TabsTrigger>
              <TabsTrigger 
                value="charts" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-white text-slate-400 rounded-md transition-all duration-300 text-xs py-1.5 px-2"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Charts
              </TabsTrigger>
              <TabsTrigger 
                value="digital-twin" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/20 data-[state=active]:to-red-500/20 data-[state=active]:text-white text-slate-400 rounded-md transition-all duration-300 text-xs py-1.5 px-2"
              >
                <Waves className="w-3 h-3 mr-1" />
                Digital Twin
              </TabsTrigger>
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white text-slate-400 rounded-md transition-all duration-300 text-xs py-1.5 px-2"
              >
                <Upload className="w-3 h-3 mr-1" />
                Upload Data
              </TabsTrigger>
            </TabsList>

          <TabsContent value="map" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Streamlined Map Controls */}
              <Card className="lg:col-span-1 bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2 text-sm">
                    <Settings className="w-4 h-4 text-blue-400" />
                    Map Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="map-type" className="text-slate-300 text-xs font-medium mb-1 block">Map Type</Label>
                    <Select value={mapType} onValueChange={setMapType}>
                      <SelectTrigger className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors h-8 text-xs">
                        <div className="flex items-center gap-1">
                          <Map className="w-3 h-3 text-blue-400" />
                          <SelectValue placeholder="Select type" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-white/10">
                        <SelectItem value="satellite" className="text-white hover:bg-white/10 text-xs">🛰️ Satellite</SelectItem>
                        <SelectItem value="terrain" className="text-white hover:bg-white/10 text-xs">🏔️ Terrain</SelectItem>
                        <SelectItem value="hybrid" className="text-white hover:bg-white/10 text-xs">🗺️ Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dataset" className="text-slate-300 text-xs font-medium mb-1 block">Dataset</Label>
                    <Select value={dataset} onValueChange={setDataset}>
                      <SelectTrigger className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors h-8 text-xs">
                        <div className="flex items-center gap-1">
                          <Database className="w-3 h-3 text-emerald-400" />
                          <SelectValue placeholder="Select dataset" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-white/10">
                        <SelectItem value="kelp-forest" className="text-white hover:bg-white/10 text-xs">🌿 Pacific Kelp</SelectItem>
                        <SelectItem value="coral-reef" className="text-white hover:bg-white/10 text-xs">🪸 Coral Reef</SelectItem>
                        <SelectItem value="deep-sea" className="text-white hover:bg-white/10 text-xs">🌊 Deep Sea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-md border border-white/10">
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-red-400" />
                        <Label htmlFor="temperature" className="text-slate-300 text-xs">Temperature</Label>
                      </div>
                      <Switch
                        id="temperature"
                        checked={showTemperature}
                        onCheckedChange={setShowTemperature}
                        className="data-[state=checked]:bg-red-500 scale-75"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-md border border-white/10">
                      <div className="flex items-center gap-1">
                        <Waves className="w-3 h-3 text-blue-400" />
                        <Label htmlFor="currents" className="text-slate-300 text-xs">Currents</Label>
                      </div>
                      <Switch
                        id="currents"
                        checked={showCurrents}
                        onCheckedChange={setShowCurrents}
                        className="data-[state=checked]:bg-blue-500 scale-75"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-md border border-white/10">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <Label htmlFor="species" className="text-slate-300 text-xs">Species</Label>
                      </div>
                      <Switch
                        id="species"
                        checked={showSpecies}
                        onCheckedChange={setShowSpecies}
                        className="data-[state=checked]:bg-emerald-500 scale-75"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleZoomToData} 
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-md transition-all duration-300 shadow-lg hover:shadow-blue-500/25 h-8 text-xs"
                  >
                    <ZoomIn className="w-3 h-3 mr-1" />
                    Zoom to Data
                  </Button>
                </CardContent>
              </Card>

              {/* Enhanced Ocean Map */}
              <Card className="lg:col-span-3 bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-2">
                  <div className="h-[300px] bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 rounded-lg relative overflow-hidden border border-white/10">
                    {/* Animated Particle Background */}
                    <div className="absolute inset-0 overflow-hidden">
                      {/* Floating particles for depth effect */}
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-cyan-200/30 rounded-full animate-float"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                          }}
                        />
                      ))}
                    </div>

                    {/* Ocean Background with Advanced Depth Layers */}
                    <div className="absolute inset-0">
                      {/* Multi-layered ocean gradient with animated waves */}
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 via-blue-700/50 to-blue-900/80"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-teal-500/10 animate-pulse"></div>
                      
                      {/* Animated wave patterns */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-wave"></div>
                      <div className="absolute top-8 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-wave-delayed"></div>
                      
                      {/* Continental shelf visualization */}
                      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-emerald-500/40 via-emerald-600/20 to-transparent rounded-r-3xl"></div>
                      <div className="absolute bottom-0 right-0 w-2/5 h-3/4 bg-gradient-to-l from-teal-500/35 via-teal-600/15 to-transparent rounded-tl-3xl"></div>
                      
                      {/* Underwater terrain features */}
                      <div className="absolute bottom-1/4 left-1/4 w-16 h-8 bg-slate-600/40 rounded-full blur-sm transform rotate-12"></div>
                      <div className="absolute bottom-1/3 right-1/3 w-12 h-6 bg-slate-700/30 rounded-full blur-sm"></div>
                    </div>

                    {/* Enhanced Ocean Currents with Flow Animation */}
                    {showCurrents && (
                      <div className="absolute inset-0">
                        {/* Major current streams with animated flow */}
                        <div className="absolute top-1/4 left-1/6 w-40 h-1 bg-gradient-to-r from-cyan-400/60 via-cyan-300/40 to-transparent rounded-full transform rotate-12">
                          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full"></div>
                        </div>
                        <div className="absolute top-2/3 left-1/3 w-32 h-1 bg-gradient-to-r from-cyan-400/50 via-cyan-300/30 to-transparent rounded-full transform -rotate-6">
                          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-delayed rounded-full"></div>
                        </div>
                        <div className="absolute bottom-1/4 right-1/4 w-36 h-1 bg-gradient-to-r from-cyan-400/55 via-cyan-300/35 to-transparent rounded-full transform rotate-45">
                          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow rounded-full"></div>
                        </div>
                        
                        {/* Current direction arrows */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-b-4 border-b-cyan-300/60 animate-pulse"
                            style={{
                              left: `${20 + (i * 10)}%`,
                              top: `${30 + Math.sin(i) * 20}%`,
                              animationDelay: `${i * 0.3}s`,
                              transform: `rotate(${i * 15}deg)`
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Enhanced Temperature Overlay with Heat Zones */}
                    {showTemperature && (
                      <div className="absolute inset-0">
                        {/* Warm zones with pulsing heat effect */}
                        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-red-500/30 rounded-full blur-2xl animate-pulse-slow">
                          <div className="absolute inset-2 bg-red-400/40 rounded-full blur-xl animate-pulse"></div>
                          <div className="absolute inset-4 bg-red-300/50 rounded-full blur-lg animate-pulse-fast"></div>
                        </div>
                        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-orange-500/25 rounded-full blur-2xl animate-pulse-slow delay-1000">
                          <div className="absolute inset-2 bg-orange-400/35 rounded-full blur-xl animate-pulse delay-500"></div>
                        </div>
                        <div className="absolute top-1/2 center w-20 h-20 bg-yellow-500/20 rounded-full blur-xl animate-pulse delay-1500"></div>
                        
                        {/* Temperature gradient lines */}
                        <div className="absolute top-0 left-0 w-full h-full">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-full h-px bg-gradient-to-r from-transparent via-red-400/20 to-transparent"
                              style={{
                                top: `${20 + (i * 15)}%`,
                                opacity: 0.3 + (i * 0.1)
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Species Data Points with Interactive Effects */}
                    {showSpecies && (
                      <>
                        {/* Point A - Enhanced with multiple layers */}
                        <div className="absolute top-1/4 left-1/3 group cursor-pointer" data-testid="map-point-1">
                          <div className="relative">
                            {/* Outer glow ring */}
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-400/20 rounded-full animate-ping"></div>
                            {/* Middle glow ring */}
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-400/40 rounded-full animate-pulse"></div>
                            {/* Core point */}
                            <div className="w-3 h-3 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-full shadow-lg shadow-emerald-400/50 group-hover:scale-150 transition-transform duration-300">
                              <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                            </div>
                            {/* Data tooltip on hover */}
                            <div className="absolute -top-16 -left-12 bg-slate-900/90 backdrop-blur-sm border border-emerald-400/30 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 pointer-events-none">
                              <div className="text-xs text-white font-medium">Point A</div>
                              <div className="text-xs text-emerald-300">37.7749°N, 122.4194°W</div>
                              <div className="text-xs text-slate-300">Temp: 18.5°C</div>
                            </div>
                          </div>
                        </div>

                        {/* Point B - Marine sanctuary indicator */}
                        <div className="absolute top-2/3 left-1/2 group cursor-pointer" data-testid="map-point-2">
                          <div className="relative">
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/20 rounded-full animate-ping delay-300"></div>
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400/40 rounded-full animate-pulse delay-300"></div>
                            <div className="w-3 h-3 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full shadow-lg shadow-blue-400/50 group-hover:scale-150 transition-transform duration-300">
                              <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse delay-300"></div>
                            </div>
                            <div className="absolute -top-16 -left-12 bg-slate-900/90 backdrop-blur-sm border border-blue-400/30 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 pointer-events-none">
                              <div className="text-xs text-white font-medium">Point B</div>
                              <div className="text-xs text-blue-300">36.9741°N, 122.0308°W</div>
                              <div className="text-xs text-slate-300">Protected Area</div>
                            </div>
                          </div>
                        </div>

                        {/* Point C - Deep sea research station */}
                        <div className="absolute top-1/2 right-1/3 group cursor-pointer" data-testid="map-point-3">
                          <div className="relative">
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-400/20 rounded-full animate-ping delay-600"></div>
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400/40 rounded-full animate-pulse delay-600"></div>
                            <div className="w-3 h-3 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full shadow-lg shadow-purple-400/50 group-hover:scale-150 transition-transform duration-300">
                              <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse delay-600"></div>
                            </div>
                            <div className="absolute -top-16 -left-12 bg-slate-900/90 backdrop-blur-sm border border-purple-400/30 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 pointer-events-none">
                              <div className="text-xs text-white font-medium">Point C</div>
                              <div className="text-xs text-purple-300">35.6870°N, 121.1817°W</div>
                              <div className="text-xs text-slate-300">Deep Sea Station</div>
                            </div>
                          </div>
                        </div>

                        {/* Point D - Kelp forest monitoring */}
                        <div className="absolute bottom-1/4 left-2/3 group cursor-pointer" data-testid="map-point-4">
                          <div className="relative">
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400/20 rounded-full animate-ping delay-900"></div>
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400/40 rounded-full animate-pulse delay-900"></div>
                            <div className="w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg shadow-yellow-400/50 group-hover:scale-150 transition-transform duration-300">
                              <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse delay-900"></div>
                            </div>
                            <div className="absolute -top-16 -left-12 bg-slate-900/90 backdrop-blur-sm border border-yellow-400/30 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 pointer-events-none">
                              <div className="text-xs text-white font-medium">Point D</div>
                              <div className="text-xs text-yellow-300">34.4208°N, 119.6982°W</div>
                              <div className="text-xs text-slate-300">Kelp Forest</div>
                            </div>
                          </div>
                        </div>

                        {/* Connecting lines between points with data flow animation */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <defs>
                            <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="transparent" />
                              <stop offset="50%" stopColor="rgba(34, 197, 94, 0.6)" />
                              <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 33% 25% Q 50% 35% 66% 50%"
                            stroke="url(#dataFlow)"
                            strokeWidth="1"
                            fill="none"
                            className="animate-dash"
                          />
                          <path
                            d="M 50% 66% Q 55% 55% 66% 75%"
                            stroke="url(#dataFlow)"
                            strokeWidth="1"
                            fill="none"
                            className="animate-dash-delayed"
                          />
                        </svg>
                      </>
                    )}

                    {/* Enhanced Map Overlays */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Radar sweep effect */}
                      <div className="absolute top-4 right-4 w-16 h-16">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                        <div className="absolute inset-2 bg-green-400/30 rounded-full animate-pulse"></div>
                        <div className="absolute inset-4 bg-green-300/40 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 w-px h-6 bg-green-400 transform -translate-x-1/2 -translate-y-1/2 origin-bottom animate-spin"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Map Label with Status Indicators */}
                    <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white/90 text-sm font-medium">Interactive Ocean Map</span>
                      </div>
                      <div className="text-xs text-cyan-300 mt-1">Real-time Data • Live Monitoring</div>
                    </div>
                    
                    {/* Enhanced Depth & Data Legend */}
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
                          <Layers className="w-3 h-3" />
                          <span>Ocean Layers</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded"></div>
                          <span className="text-emerald-300">Shallow (0-50m)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                          <span className="text-blue-300">Deep (50-200m)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-700 to-blue-900 rounded"></div>
                          <span className="text-blue-400">Abyssal (200m+)</span>
                        </div>
                      </div>
                    </div>

                    {/* Data transmission indicator */}
                    <div className="absolute top-4 right-1/3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-4 bg-cyan-400/60 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sample Point Details */}
            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-2xl">
              <CardHeader className="pb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-emerald-500/10 rounded-t-lg"></div>
                <CardTitle className="text-white flex items-center gap-3 relative z-10">
                  <div className="relative">
                    <MapPin className="w-6 h-6 text-blue-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Live Sample Point Monitoring
                  </span>
                </CardTitle>
                <p className="text-slate-400 text-sm relative z-10">Real-time oceanographic data from monitoring stations</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Point A - Enhanced with status indicators */}
                  <div className="relative group" data-testid="sample-point-details-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-sm border border-emerald-400/30 rounded-2xl hover:border-emerald-400/60 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-emerald-500/20">
                      {/* Animated background particles */}
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-float"
                            style={{
                              left: `${20 + (i * 15)}%`,
                              top: `${20 + (i * 10)}%`,
                              animationDelay: `${i * 0.5}s`
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="relative z-10">
                        {/* Enhanced Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-full shadow-lg shadow-emerald-400/50 animate-pulse">
                                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                              </div>
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">Point A</h3>
                              <p className="text-emerald-300 text-xs">Coastal Monitoring Station</p>
                            </div>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                            ACTIVE
                          </Badge>
                        </div>

                        {/* Enhanced Coordinates */}
                        <div className="flex items-center gap-2 mb-4 p-2 bg-emerald-500/10 rounded-lg border border-emerald-400/20">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300 text-sm font-mono">37.7749°N, 122.4194°W</span>
                          <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        </div>

                        {/* Enhanced Data Metrics */}
                        <div className="space-y-3">
                          {/* Temperature with trend */}
                          <div className="group/metric p-3 bg-white/5 rounded-lg border border-white/10 hover:border-red-400/30 transition-all duration-300 hover:bg-red-500/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-red-400" />
                                <span className="text-slate-300 text-sm">Temperature</span>
                              </div>
                              <TrendingUp className="w-3 h-3 text-green-400 opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold text-lg">18.5°C</span>
                              <span className="text-green-400 text-xs">+0.3°</span>
                            </div>
                            <div className="w-full bg-red-900/30 rounded-full h-1 mt-2">
                              <div className="bg-gradient-to-r from-red-500 to-red-400 h-1 rounded-full transition-all duration-1000" style={{ width: '72%' }}></div>
                            </div>
                          </div>

                          {/* Salinity with status */}
                          <div className="group/metric p-3 bg-white/5 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:bg-blue-500/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-blue-400" />
                                <span className="text-slate-300 text-sm">Salinity</span>
                              </div>
                              <Activity className="w-3 h-3 text-blue-400 opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold text-lg">34.2 PSU</span>
                              <span className="text-yellow-400 text-xs">±0.1</span>
                            </div>
                            <div className="w-full bg-blue-900/30 rounded-full h-1 mt-2">
                              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1 rounded-full transition-all duration-1000" style={{ width: '86%' }}></div>
                            </div>
                          </div>

                          {/* Species with count */}
                          <div className="group/metric p-3 bg-white/5 rounded-lg border border-white/10 hover:border-emerald-400/30 transition-all duration-300 hover:bg-emerald-500/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <span className="text-slate-300 text-sm">Primary Species</span>
                              </div>
                              <Eye className="w-3 h-3 text-emerald-400 opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-300 font-bold">Blue Rockfish</span>
                              <span className="text-emerald-400 text-xs">47 detected</span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 h-1 bg-emerald-500/30 rounded-full"
                                  style={{ opacity: i < 4 ? 1 : 0.3 }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Data Quality Indicator */}
                          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-400/20">
                            <span className="text-green-300 text-xs font-medium">Data Quality</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-1.5 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Point B - Marine Sanctuary */}
                  <div className="relative group" data-testid="sample-point-details-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl hover:border-blue-400/60 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-float"
                            style={{
                              left: `${25 + (i * 12)}%`,
                              top: `${15 + (i * 12)}%`,
                              animationDelay: `${i * 0.7}s`
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full shadow-lg shadow-blue-400/50 animate-pulse delay-300">
                                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse delay-300"></div>
                              </div>
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-300"></div>
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">Point B</h3>
                              <p className="text-blue-300 text-xs">Protected Marine Area</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">
                            PROTECTED
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-4 p-2 bg-blue-500/10 rounded-lg border border-blue-400/20">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300 text-sm font-mono">36.9741°N, 122.0308°W</span>
                          <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                        </div>

                        <div className="space-y-3">
                          <div className="group/metric p-3 bg-white/5 rounded-lg border border-white/10 hover:border-red-400/30 transition-all duration-300 hover:bg-red-500/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-red-400" />
                                <span className="text-slate-300 text-sm">Temperature</span>
                              </div>
                              <TrendingUp className="w-3 h-3 text-red-400 opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold text-lg">16.8°C</span>
                              <span className="text-red-400 text-xs">-0.2°</span>
                            </div>
                            <div className="w-full bg-red-900/30 rounded-full h-1 mt-2">
                              <div className="bg-gradient-to-r from-red-500 to-orange-400 h-1 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                            </div>
                          </div>

                          <div className="group/metric p-3 bg-white/5 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:bg-blue-500/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-blue-400" />
                                <span className="text-slate-300 text-sm">Salinity</span>
                              </div>
                              <Activity className="w-3 h-3 text-green-400 opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold text-lg">33.9 PSU</span>
                              <span className="text-green-400 text-xs">stable</span>
                            </div>
                            <div className="w-full bg-blue-900/30 rounded-full h-1 mt-2">
                              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1 rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
                            </div>
                          </div>

                          <div className="group/metric p-3 bg-white/5 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:bg-blue-500/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                <span className="text-slate-300 text-sm">Primary Species</span>
                              </div>
                              <Eye className="w-3 h-3 text-blue-400 opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-300 font-bold">Kelp Bass</span>
                              <span className="text-blue-400 text-xs">31 detected</span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 h-1 bg-blue-500/30 rounded-full"
                                  style={{ opacity: i < 3 ? 1 : 0.3 }}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
                            <span className="text-blue-300 text-xs font-medium">Conservation Status</span>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-green-400 text-xs">Excellent</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Point C - Deep Sea Research */}
                  <div className="relative group" data-testid="sample-point-details-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/30 rounded-2xl hover:border-purple-400/60 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-float"
                            style={{
                              left: `${30 + (i * 10)}%`,
                              top: `${25 + (i * 8)}%`,
                              animationDelay: `${i * 0.9}s`
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full shadow-lg shadow-purple-400/50 animate-pulse delay-600">
                                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse delay-600"></div>
                              </div>
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-600"></div>
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">Point C</h3>
                              <p className="text-purple-300 text-xs">Deep Sea Research Station</p>
                            </div>
                          </div>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
                            RESEARCH
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-4 p-2 bg-purple-500/10 rounded-lg border border-purple-400/20">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 text-sm font-mono">35.6870°N, 121.1817°W</span>
                          <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-600"></div>
                        </div>

                        <div className="space-y-3">
                          <div className="group/metric p-3 bg-white/5 rounded-lg border border-white/10 hover:border-red-400/30 transition-all duration-300 hover:bg-red-500/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-red-400" />
                                <span className="text-slate-300 text-sm">Temperature</span>
                              </div>
                              <TrendingUp className="w-3 h-3 text-green-400 opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold text-lg">14.2°C</span>
                              <span className="text-green-400 text-xs">+0.1°</span>
                            </div>
                            <div className="w-full bg-red-900/30 rounded-full h-1 mt-2">
                              <div className="bg-gradient-to-r from-blue-500 to-purple-400 h-1 rounded-full transition-all duration-1000" style={{ width: '55%' }}></div>
                            </div>
                          </div>

                          <div className="group/metric p-3 bg-white/5 rounded-lg border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:bg-purple-500/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-purple-400" />
                                <span className="text-slate-300 text-sm">Salinity</span>
                              </div>
                              <Activity className="w-3 h-3 text-purple-400 opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold text-lg">34.8 PSU</span>
                              <span className="text-purple-400 text-xs">+0.2</span>
                            </div>
                            <div className="w-full bg-purple-900/30 rounded-full h-1 mt-2">
                              <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-1 rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
                            </div>
                          </div>

                          <div className="group/metric p-3 bg-white/5 rounded-lg border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:bg-purple-500/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span className="text-slate-300 text-sm">Primary Species</span>
                              </div>
                              <Eye className="w-3 h-3 text-purple-400 opacity-0 group-hover/metric:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-purple-300 font-bold">Deep Sea Urchin</span>
                              <span className="text-purple-400 text-xs">12 detected</span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 h-1 bg-purple-500/30 rounded-full"
                                  style={{ opacity: i < 2 ? 1 : 0.3 }}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
                            <span className="text-purple-300 text-xs font-medium">Research Priority</span>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                              <span className="text-yellow-400 text-xs">High</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Status Bar */}
                <div className="mt-8 p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-medium">All Stations Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm">Live Data Stream</span>
                      </div>
                    </div>
                    <div className="text-slate-400 text-xs">
                      Last Update: <span className="text-white">2 seconds ago</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Status Bar */}
                <div className="mt-8 p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-medium">All Stations Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm">Live Data Stream</span>
                      </div>
                    </div>
                    <div className="text-slate-400 text-xs">
                      Last Update: <span className="text-white">2 seconds ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="layers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Layers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: 'Bathymetry', enabled: true, color: 'bg-blue-500' },
                      { name: 'Temperature', enabled: showHeatmap, color: 'bg-red-500' },
                      { name: 'Salinity', enabled: false, color: 'bg-green-500' },
                      { name: 'Currents', enabled: showCurrents, color: 'bg-purple-500' },
                      { name: 'Species Density', enabled: showSpecies, color: 'bg-yellow-500' },
                      { name: 'Fishing Zones', enabled: false, color: 'bg-orange-500' },
                    ].map((layer) => (
                      <div key={layer.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${layer.color} rounded`} />
                          <span className="font-medium">{layer.name}</span>
                        </div>
                        <Switch checked={layer.enabled} disabled />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Layer Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Opacity</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="80"
                      className="w-full mt-2"
                      data-testid="slider-opacity"
                    />
                  </div>
                  
                  <div>
                    <Label>Time Range</Label>
                    <Select defaultValue="last-month">
                      <SelectTrigger className="mt-2" data-testid="select-time-range">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="all-time">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Color Scale</Label>
                    <Select defaultValue="viridis">
                      <SelectTrigger className="mt-2" data-testid="select-color-scale">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viridis">Viridis</SelectItem>
                        <SelectItem value="plasma">Plasma</SelectItem>
                        <SelectItem value="inferno">Inferno</SelectItem>
                        <SelectItem value="turbo">Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Species Distribution Chart */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Species Distribution Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.3)" />
                      <XAxis 
                        dataKey="month" 
                        stroke="rgba(148, 163, 184, 0.8)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="rgba(148, 163, 184, 0.8)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '10px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="fish" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
                        name="Fish"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="coral" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
                        name="Coral"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="plankton" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: '#8b5cf6', strokeWidth: 2 }}
                        name="Plankton"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Temperature vs pH Correlation */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2 text-sm">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    Temperature vs pH Correlation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <ScatterChart data={scatterData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.3)" />
                      <XAxis 
                        dataKey="temperature" 
                        name="Temperature" 
                        unit="°C"
                        stroke="rgba(148, 163, 184, 0.8)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        dataKey="ph" 
                        name="pH" 
                        domain={[7, 8.5]}
                        stroke="rgba(148, 163, 184, 0.8)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      />
                      <Scatter 
                        name="Samples" 
                        dataKey="ph" 
                        fill="#ef4444"
                        stroke="#ef4444"
                        strokeWidth={1}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-slate-300">
                      <span className="text-red-400 font-semibold">R² = 0.847</span> - Strong negative correlation
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Species Composition Pie Chart */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Species Composition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie 
                        data={speciesData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={70}
                        innerRadius={35}
                        paddingAngle={2}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth={1}
                      >
                        {speciesData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {speciesData.map((species, index) => (
                      <div key={index} className="flex items-center gap-2 p-1.5 bg-white/5 rounded-md border border-white/10">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: species.color }}
                        ></div>
                        <span className="text-xs text-slate-300 truncate">{species.name}</span>
                        <span className="text-xs font-semibold text-white ml-auto">{species.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Ocean Metrics */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2 text-sm">
                    <Waves className="w-4 h-4 text-blue-400" />
                    Real-time Ocean Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.3)" />
                      <XAxis 
                        dataKey="month" 
                        stroke="rgba(148, 163, 184, 0.8)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="rgba(148, 163, 184, 0.8)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Area 
                        type="monotone" 
                        dataKey="fish" 
                        stackId="1"
                        stroke="#ef4444" 
                        fill="rgba(239, 68, 68, 0.2)"
                        name="Temperature (°C)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="coral" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="rgba(59, 130, 246, 0.2)"
                        name="Salinity (PSU)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="plankton" 
                        stackId="1"
                        stroke="#10b981" 
                        fill="rgba(16, 185, 129, 0.2)"
                        name="pH Level"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-2 flex justify-center">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-slate-300">Temperature</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-300">Salinity</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-slate-300">pH Level</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            {/* Premium File Upload Dropbox */}
        <Card className="relative overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 group">
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-violet-400/40 to-purple-400/40 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-6 h-6 text-violet-400 group-hover:text-violet-300 transition-colors duration-300" />
              </div>
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Data Upload Center
                </div>
                <div className="text-slate-400 font-medium text-sm">Advanced drag & drop with real-time processing</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-violet-400 bg-gradient-to-br from-violet-500/20 to-purple-500/20 scale-[1.02] shadow-2xl shadow-violet-500/25'
                  : 'border-white/20 bg-gradient-to-br from-white/5 to-white/10 hover:border-violet-400/50 hover:bg-gradient-to-br hover:from-violet-500/10 hover:to-purple-500/10'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 bg-gradient-to-r from-violet-400/30 to-purple-400/30 rounded-full animate-pulse ${
                      isDragging ? 'animate-bounce' : ''
                    }`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-violet-500/30">
                      <div className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg font-semibold text-white">Uploading Files...</div>
                      <Progress value={uploadProgress} className="w-full h-3 bg-slate-700">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 shadow-lg shadow-violet-500/30"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </Progress>
                      <div className="text-sm text-slate-400">{uploadProgress}% complete</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className={`w-20 h-20 mx-auto bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-violet-500/30 transition-all duration-300 ${
                      isDragging ? 'scale-110 shadow-2xl shadow-violet-500/30' : 'hover:scale-105'
                    }`}>
                      <Upload className={`w-10 h-10 text-violet-400 transition-all duration-300 ${
                        isDragging ? 'animate-bounce' : ''
                      }`} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-white">
                        {isDragging ? 'Drop files here!' : 'Upload Ocean Data'}
                      </div>
                      <div className="text-slate-400">
                        Drag and drop files or{' '}
                        <button
                          onClick={handleFileSelect}
                          className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-2 transition-colors"
                        >
                          browse files
                        </button>
                      </div>
                    </div>

                    {/* Supported file types */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        { ext: 'CSV', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30', icon: FileText },
                        { ext: 'JSON', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30', icon: FileText },
                        { ext: 'XLS', color: 'from-orange-500/20 to-red-500/20 border-orange-500/30', icon: FileText },
                        { ext: 'PNG', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30', icon: Image }
                      ].map((type) => (
                        <Badge
                          key={type.ext}
                          variant="outline"
                          className={`bg-gradient-to-r ${type.color} text-white text-xs px-3 py-1 flex items-center gap-1`}
                        >
                          <type.icon className="w-3 h-3" />
                          {type.ext}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(Array.from(e.target.files));
                  }
                }}
                accept=".csv,.json,.xlsx,.xls,.png,.jpg,.jpeg"
              />
            </div>

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-slate-200">Uploaded Files ({uploadedFiles.length})</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedFiles([])}
                    className="text-xs bg-red-600/20 border-red-500/30 text-red-300 hover:border-red-400"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-violet-500/30">
                          {file.name.toLowerCase().includes('csv') || file.name.toLowerCase().includes('json') ? (
                            <FileText className="w-4 h-4 text-violet-400" />
                          ) : (
                            <Image className="w-4 h-4 text-violet-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white truncate max-w-48">{file.name}</div>
                          <div className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                        className="w-8 h-8 p-0 bg-red-600/20 border-red-500/30 text-red-300 hover:border-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
            </Card>
          </TabsContent>

          {/* Digital Twin Simulator Tab */}
          <TabsContent value="digital-twin" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Climate Controls */}
              <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-xl border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-orange-400" />
                    Climate Controls
                  </CardTitle>
                  <p className="text-slate-400 text-sm">Simulate environmental changes and observe ecosystem responses</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Temperature Control */}
                  <div className="space-y-3">
                    <Label className="text-white flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      Temperature Change: +{tempIncrease.toFixed(1)}°C
                    </Label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={tempIncrease}
                        onChange={(e) => setTempIncrease(parseFloat(e.target.value))}
                        className="w-full h-2 bg-orange-900/50 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>0°C</span>
                        <span>+2.5°C</span>
                        <span>+5°C</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg border transition-all duration-300 ${
                      tempIncrease > 2 ? 'bg-red-500/10 border-red-500/30' :
                      tempIncrease > 1 ? 'bg-yellow-500/10 border-yellow-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    }`}>
                      <p className="text-xs text-white">
                        {tempIncrease > 2 ? '⚠️ Severe warming - Major species migration' :
                         tempIncrease > 1 ? '⚠️ Moderate warming - Species distribution changes' :
                         '✅ Normal conditions'}
                      </p>
                    </div>
                  </div>

                  {/* Salinity Control */}
                  <div className="space-y-3">
                    <Label className="text-white flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      Salinity Change: +{salinityIncrease.toFixed(1)} PSU
                    </Label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={salinityIncrease}
                        onChange={(e) => setSalinityIncrease(parseFloat(e.target.value))}
                        className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>0 PSU</span>
                        <span>+1.5 PSU</span>
                        <span>+3 PSU</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg border transition-all duration-300 ${
                      salinityIncrease > 1.5 ? 'bg-red-500/10 border-red-500/30' :
                      salinityIncrease > 0.5 ? 'bg-yellow-500/10 border-yellow-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    }`}>
                      <p className="text-xs text-white">
                        {salinityIncrease > 1.5 ? '⚠️ High salinity - Freshwater species stress' :
                         salinityIncrease > 0.5 ? '⚠️ Elevated salinity - Ecosystem changes' :
                         '✅ Normal salinity levels'}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Simulation Controls */}
                  <div className="space-y-4">
                    {/* Simulation Speed Control */}
                    <div className="space-y-2">
                      <Label className="text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Simulation Speed: {simulationSpeed}x
                      </Label>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.5"
                        value={simulationSpeed}
                        onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                        className="w-full h-2 bg-yellow-900/50 rounded-lg appearance-none cursor-pointer slider"
                        disabled={isSimulationRunning}
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>0.5x</span>
                        <span>1.5x</span>
                        <span>3x</span>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (isSimulationRunning) {
                            pauseSimulation();
                          } else {
                            startSimulation();
                          }
                        }}
                        className={`flex-1 transition-all duration-300 ${
                          isSimulationRunning 
                            ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/25' 
                            : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/25'
                        }`}
                        disabled={simulationTime >= 100}
                      >
                        {isSimulationRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isSimulationRunning ? 'Pause' : simulationTime >= 100 ? 'Complete' : 'Start'} Simulation
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetSimulation}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Simulation Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Simulation Progress</span>
                        <span>{simulationTime.toFixed(0)}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={simulationTime} className="w-full h-3" />
                        {isSimulationRunning && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 text-center">
                        {simulationTime < 25 ? 'Initializing ecosystem model...' :
                         simulationTime < 50 ? 'Applying environmental changes...' :
                         simulationTime < 75 ? 'Analyzing species responses...' :
                         simulationTime < 100 ? 'Calculating ecosystem impacts...' :
                         'Simulation complete!'}
                      </div>
                    </div>

                    {/* Environmental Events Log */}
                    {environmentalEvents.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-white flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          Environmental Events
                        </Label>
                        <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-800/50 rounded-lg p-3">
                          {environmentalEvents.map((event, index) => (
                            <div key={index} className="text-xs text-slate-300 p-2 bg-slate-700/50 rounded border-l-2 border-yellow-400/50">
                              {event}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* EEZ Map Visualization */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Map className="w-5 h-5 text-blue-400" />
                      Marine Ecosystem Digital Twin
                    </CardTitle>
                    <p className="text-slate-400 text-sm">Real-time visualization of climate impacts on marine species distribution</p>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-96 bg-gradient-to-br from-blue-900/50 to-teal-900/50 rounded-lg border border-blue-500/30 overflow-hidden">
                      {/* Mock EEZ Map */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-green-600/20">
                        {/* Coastline simulation */}
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-green-800/60 to-transparent"></div>
                        
                        {/* Enhanced Species Distribution Zones with Dynamic Populations */}
                        {/* Sardine Zone (affected by temperature) */}
                        <div className={`absolute transition-all duration-1000 ${
                          tempIncrease >= 2 ? 'top-8 left-8' : 'top-28 left-16'
                        } rounded-full border-2 flex items-center justify-center ${
                          speciesPopulations.sardine > 70 ? 'border-yellow-400/80 bg-yellow-500/30' :
                          speciesPopulations.sardine > 40 ? 'border-yellow-400/60 bg-yellow-500/20' :
                          'border-red-400/80 bg-red-500/30'
                        }`} style={{
                          width: `${Math.max(40, speciesPopulations.sardine * 0.8)}px`,
                          height: `${Math.max(30, speciesPopulations.sardine * 0.6)}px`
                        }}>
                          <div className="text-center">
                            <span className="text-xs text-yellow-100 font-medium block">Sardine</span>
                            <span className="text-xs text-yellow-200">{speciesPopulations.sardine.toFixed(0)}%</span>
                          </div>
                          {tempIncrease >= 2 && (
                            <div className="absolute -top-3 -right-3 flex space-x-1">
                              <div className="w-0 h-0 border-l-3 border-l-transparent border-r-3 border-r-transparent border-b-6 border-b-yellow-400 animate-bounce"></div>
                              <div className="w-0 h-0 border-l-3 border-l-transparent border-r-3 border-r-transparent border-b-6 border-b-yellow-400 animate-bounce delay-100"></div>
                            </div>
                          )}
                        </div>

                        {/* Anchovy Zone (affected by salinity) */}
                        <div className={`absolute transition-all duration-1000 ${
                          salinityIncrease >= 1 ? 'bottom-16 right-28 opacity-70' : 'bottom-28 right-16 opacity-100'
                        } rounded-full border-2 flex items-center justify-center ${
                          speciesPopulations.anchovy > 70 ? 'border-purple-400/80 bg-purple-500/30' :
                          speciesPopulations.anchovy > 40 ? 'border-purple-400/60 bg-purple-500/20' :
                          'border-red-400/80 bg-red-500/30'
                        }`} style={{
                          width: `${Math.max(35, speciesPopulations.anchovy * 0.7)}px`,
                          height: `${Math.max(25, speciesPopulations.anchovy * 0.5)}px`
                        }}>
                          <div className="text-center">
                            <span className="text-xs text-purple-100 font-medium block">Anchovy</span>
                            <span className="text-xs text-purple-200">{speciesPopulations.anchovy.toFixed(0)}%</span>
                          </div>
                          {salinityIncrease >= 1 && speciesPopulations.anchovy < 60 && (
                            <div className="absolute -bottom-2 -left-2 w-0 h-0 border-t-3 border-t-transparent border-b-3 border-b-transparent border-r-6 border-r-red-400 animate-pulse"></div>
                          )}
                        </div>

                        {/* Cod Zone (most resilient) */}
                        <div className={`absolute top-16 right-12 rounded-full border-2 flex items-center justify-center ${
                          speciesPopulations.cod > 70 ? 'border-blue-400/80 bg-blue-500/30' :
                          speciesPopulations.cod > 40 ? 'border-blue-400/60 bg-blue-500/20' :
                          'border-red-400/80 bg-red-500/30'
                        } transition-all duration-1000`} style={{
                          width: `${Math.max(45, speciesPopulations.cod * 0.9)}px`,
                          height: `${Math.max(35, speciesPopulations.cod * 0.7)}px`
                        }}>
                          <div className="text-center">
                            <span className="text-xs text-blue-100 font-medium block">Cod</span>
                            <span className="text-xs text-blue-200">{speciesPopulations.cod.toFixed(0)}%</span>
                          </div>
                        </div>

                        {/* Kelp Forest (bottom habitat) */}
                        <div className={`absolute bottom-4 left-1/3 rounded-lg border-2 flex items-center justify-center ${
                          speciesPopulations.kelp > 70 ? 'border-green-400/80 bg-green-500/30' :
                          speciesPopulations.kelp > 40 ? 'border-green-400/60 bg-green-500/20' :
                          'border-red-400/80 bg-red-500/30'
                        } transition-all duration-1000`} style={{
                          width: `${Math.max(50, speciesPopulations.kelp * 1.0)}px`,
                          height: `${Math.max(25, speciesPopulations.kelp * 0.4)}px`
                        }}>
                          <div className="text-center">
                            <span className="text-xs text-green-100 font-medium block">Kelp</span>
                            <span className="text-xs text-green-200">{speciesPopulations.kelp.toFixed(0)}%</span>
                          </div>
                          {speciesPopulations.kelp < 50 && (
                            <div className="absolute inset-0 border-2 border-red-400/50 rounded-lg animate-pulse"></div>
                          )}
                        </div>

                        {/* Plankton Layer (microscopic indicators) */}
                        <div className="absolute top-1/4 left-1/4 w-32 h-8 pointer-events-none">
                          {Array.from({ length: Math.max(3, Math.floor(speciesPopulations.plankton / 20)) }).map((_, i) => (
                            <div
                              key={i}
                              className={`absolute w-1 h-1 rounded-full animate-float ${
                                speciesPopulations.plankton > 70 ? 'bg-cyan-400/70' :
                                speciesPopulations.plankton > 40 ? 'bg-cyan-400/50' :
                                'bg-red-400/60'
                              }`}
                              style={{
                                left: `${(i * 25) % 100}%`,
                                top: `${(i * 15) % 60}%`,
                                animationDelay: `${i * 0.3}s`
                              }}
                            />
                          ))}
                        </div>

                        {/* Temperature Effects Visualization */}
                        {tempIncrease > 0 && (
                          <div className="absolute inset-0 pointer-events-none">
                            {Array.from({ length: Math.floor(tempIncrease * 2) }).map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-2 h-2 bg-red-400/60 rounded-full animate-ping"
                                style={{
                                  left: `${20 + (i * 15)}%`,
                                  top: `${30 + (i * 10)}%`,
                                  animationDelay: `${i * 0.5}s`
                                }}
                              ></div>
                            ))}
                          </div>
                        )}

                        {/* Current Flow Arrows */}
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                          <div className="flex items-center space-x-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-0 h-0 border-t-2 border-t-transparent border-b-2 border-b-transparent border-l-4 border-l-cyan-400/60 animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              ></div>
                            ))}
                          </div>
                        </div>

                        {/* Enhanced Dynamic Legend */}
                        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-lg rounded-xl p-4 border border-slate-700/50 max-w-xs">
                          <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                            <Fish className="w-4 h-4 text-blue-400" />
                            Live Species Monitor
                          </h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded border ${
                                  speciesPopulations.sardine > 70 ? 'bg-yellow-500/50 border-yellow-400' :
                                  speciesPopulations.sardine > 40 ? 'bg-yellow-500/30 border-yellow-400/60' :
                                  'bg-red-500/50 border-red-400'
                                }`}></div>
                                <span className="text-yellow-200">Sardine</span>
                              </div>
                              <span className={`font-medium ${
                                speciesPopulations.sardine > 70 ? 'text-green-400' :
                                speciesPopulations.sardine > 40 ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>{speciesPopulations.sardine.toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded border ${
                                  speciesPopulations.anchovy > 70 ? 'bg-purple-500/50 border-purple-400' :
                                  speciesPopulations.anchovy > 40 ? 'bg-purple-500/30 border-purple-400/60' :
                                  'bg-red-500/50 border-red-400'
                                }`}></div>
                                <span className="text-purple-200">Anchovy</span>
                              </div>
                              <span className={`font-medium ${
                                speciesPopulations.anchovy > 70 ? 'text-green-400' :
                                speciesPopulations.anchovy > 40 ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>{speciesPopulations.anchovy.toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded border ${
                                  speciesPopulations.cod > 70 ? 'bg-blue-500/50 border-blue-400' :
                                  speciesPopulations.cod > 40 ? 'bg-blue-500/30 border-blue-400/60' :
                                  'bg-red-500/50 border-red-400'
                                }`}></div>
                                <span className="text-blue-200">Cod</span>
                              </div>
                              <span className={`font-medium ${
                                speciesPopulations.cod > 70 ? 'text-green-400' :
                                speciesPopulations.cod > 40 ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>{speciesPopulations.cod.toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded border ${
                                  speciesPopulations.kelp > 70 ? 'bg-green-500/50 border-green-400' :
                                  speciesPopulations.kelp > 40 ? 'bg-green-500/30 border-green-400/60' :
                                  'bg-red-500/50 border-red-400'
                                }`}></div>
                                <span className="text-green-200">Kelp Forest</span>
                              </div>
                              <span className={`font-medium ${
                                speciesPopulations.kelp > 70 ? 'text-green-400' :
                                speciesPopulations.kelp > 40 ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>{speciesPopulations.kelp.toFixed(0)}%</span>
                            </div>
                            <div className="border-t border-slate-600 pt-2 mt-2">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-cyan-200">Plankton</span>
                                <span className={`font-medium ${
                                  speciesPopulations.plankton > 70 ? 'text-green-400' :
                                  speciesPopulations.plankton > 40 ? 'text-yellow-400' :
                                  'text-red-400'
                                }`}>{speciesPopulations.plankton.toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Environmental Indicators */}
                        <div className="absolute bottom-4 right-4 space-y-2">
                          <div className="bg-slate-900/90 backdrop-blur-lg rounded-lg p-3 border border-slate-700/50">
                            <div className="flex items-center gap-2 text-sm mb-2">
                              <Activity className="w-4 h-4 text-purple-400" />
                              <span className="text-white font-medium">Ecosystem Health</span>
                            </div>
                            <div className={`text-2xl font-bold text-center ${
                              ecosystemHealth > 80 ? 'text-green-400' :
                              ecosystemHealth > 60 ? 'text-yellow-400' :
                              ecosystemHealth > 40 ? 'text-orange-400' :
                              'text-red-400'
                            }`}>
                              {ecosystemHealth.toFixed(0)}%
                            </div>
                          </div>
                          <div className="bg-slate-900/90 backdrop-blur-lg rounded-lg p-2 border border-slate-700/50">
                            <div className="flex items-center gap-2 text-xs">
                              <Thermometer className="w-3 h-3 text-orange-400" />
                              <span className="text-white">+{tempIncrease.toFixed(1)}°C</span>
                              {tempIncrease > 2 && <span className="text-red-400 animate-pulse">⚠️</span>}
                            </div>
                          </div>
                          <div className="bg-slate-900/90 backdrop-blur-lg rounded-lg p-2 border border-slate-700/50">
                            <div className="flex items-center gap-2 text-xs">
                              <Droplets className="w-3 h-3 text-blue-400" />
                              <span className="text-white">+{salinityIncrease.toFixed(1)} PSU</span>
                              {salinityIncrease > 1.5 && <span className="text-red-400 animate-pulse">⚠️</span>}
                            </div>
                          </div>
                          {isSimulationRunning && (
                            <div className="bg-slate-900/90 backdrop-blur-lg rounded-lg p-2 border border-green-500/50">
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400">Live Simulation</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Impact Analysis Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Species Population Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { 
                          species: 'Sardine', 
                          baseline: 100, 
                          current: speciesPopulations.sardine,
                          threat: tempIncrease > 1.5 ? 'High' : tempIncrease > 1 ? 'Medium' : 'Low'
                        },
                        { 
                          species: 'Anchovy', 
                          baseline: 100, 
                          current: speciesPopulations.anchovy,
                          threat: salinityIncrease > 1.5 ? 'High' : salinityIncrease > 0.5 ? 'Medium' : 'Low'
                        },
                        { 
                          species: 'Cod', 
                          baseline: 100, 
                          current: speciesPopulations.cod,
                          threat: tempIncrease > 2 ? 'Medium' : 'Low'
                        },
                        { 
                          species: 'Kelp', 
                          baseline: 100, 
                          current: speciesPopulations.kelp,
                          threat: (tempIncrease + salinityIncrease) > 2 ? 'High' : 'Medium'
                        },
                        { 
                          species: 'Plankton', 
                          baseline: 100, 
                          current: speciesPopulations.plankton,
                          threat: (tempIncrease + salinityIncrease) > 1.5 ? 'Medium' : 'Low'
                        }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="species" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value, name) => [
                            `${Number(value).toFixed(1)}%`,
                            name === 'baseline' ? 'Baseline Population' : 'Current Population'
                          ]}
                          labelFormatter={(label) => `Species: ${label}`}
                        />
                        <Bar dataKey="baseline" fill="#6B7280" name="Baseline" opacity={0.6} />
                        <Bar 
                          dataKey="current" 
                          name="Current"
                          fill={(data) => {
                            const value = data.current;
                            return value > 80 ? '#10B981' : value > 60 ? '#F59E0B' : value > 40 ? '#F97316' : '#EF4444';
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Population Change Summary */}
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {Object.entries(speciesPopulations).map(([species, population]) => (
                      <div key={species} className="text-center">
                        <div className={`text-lg font-bold ${
                          population > 80 ? 'text-green-400' :
                          population > 60 ? 'text-yellow-400' :
                          population > 40 ? 'text-orange-400' :
                          'text-red-400'
                        }`}>
                          {(population - 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-400 capitalize">{species}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Ecosystem Health Index
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className={`text-5xl font-bold transition-all duration-500 ${
                        ecosystemHealth > 80 ? 'text-green-400' :
                        ecosystemHealth > 60 ? 'text-yellow-400' :
                        ecosystemHealth > 40 ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {ecosystemHealth.toFixed(0)}%
                      </div>
                      <p className="text-slate-400 text-sm mt-2">Overall Health Score</p>
                      <div className={`text-xs mt-1 font-medium ${
                        ecosystemHealth > 80 ? 'text-green-400' :
                        ecosystemHealth > 60 ? 'text-yellow-400' :
                        ecosystemHealth > 40 ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {ecosystemHealth > 80 ? '🟢 Excellent' :
                         ecosystemHealth > 60 ? '🟡 Good' :
                         ecosystemHealth > 40 ? '🟠 Degraded' :
                         '🔴 Critical'}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Biodiversity</span>
                        <span className="text-sm text-white">{Math.max(0, (speciesPopulations.sardine + speciesPopulations.anchovy + speciesPopulations.cod) / 3).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.max(0, (speciesPopulations.sardine + speciesPopulations.anchovy + speciesPopulations.cod) / 3)} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Water Quality</span>
                        <span className="text-sm text-white">{Math.max(0, 100 - (salinityIncrease * 15) - (tempIncrease * 10)).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.max(0, 100 - (salinityIncrease * 15) - (tempIncrease * 10))} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Habitat Stability</span>
                        <span className="text-sm text-white">{speciesPopulations.kelp.toFixed(0)}%</span>
                      </div>
                      <Progress value={speciesPopulations.kelp} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Food Chain Health</span>
                        <span className="text-sm text-white">{speciesPopulations.plankton.toFixed(0)}%</span>
                      </div>
                      <Progress value={speciesPopulations.plankton} className="h-2" />
                    </div>

                    {/* Climate Impact Summary */}
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                      <h4 className="text-white text-sm font-medium mb-2">Climate Impact Analysis</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Temperature Stress:</span>
                          <span className={tempIncrease > 2 ? 'text-red-400' : tempIncrease > 1 ? 'text-yellow-400' : 'text-green-400'}>
                            {tempIncrease > 2 ? 'High' : tempIncrease > 1 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Salinity Stress:</span>
                          <span className={salinityIncrease > 1.5 ? 'text-red-400' : salinityIncrease > 0.5 ? 'text-yellow-400' : 'text-green-400'}>
                            {salinityIncrease > 1.5 ? 'High' : salinityIncrease > 0.5 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Migration Events:</span>
                          <span className="text-white">
                            {tempIncrease >= 2 || salinityIncrease >= 1 ? 'Active' : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </Layout>
  );
}
