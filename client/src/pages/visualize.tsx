import { useState, useCallback, useRef } from 'react';
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
  Activity, Waves, Thermometer, Droplets, Wind, Sun, Moon, X, MapPin
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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
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
            <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-lg mb-3">
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
                    {/* Ocean Background with Depth Layers */}
                    <div className="absolute inset-0">
                      {/* Deep ocean gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/40 via-blue-800/60 to-blue-900/80"></div>
                      
                      {/* Coastal areas */}
                      <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-emerald-600/30 to-transparent"></div>
                      <div className="absolute bottom-0 right-0 w-1/3 h-2/3 bg-gradient-to-l from-teal-600/25 to-transparent"></div>
                      
                      {/* Ocean currents */}
                      {showCurrents && (
                        <div className="absolute inset-0">
                          <div className="absolute top-1/4 left-1/6 w-32 h-0.5 bg-cyan-400/50 rounded-full transform rotate-12 animate-pulse"></div>
                          <div className="absolute top-2/3 left-1/3 w-24 h-0.5 bg-cyan-400/40 rounded-full transform -rotate-6 animate-pulse delay-500"></div>
                          <div className="absolute bottom-1/4 right-1/4 w-28 h-0.5 bg-cyan-400/45 rounded-full transform rotate-45 animate-pulse delay-1000"></div>
                        </div>
                      )}
                      
                      {/* Temperature overlay */}
                      {showTemperature && (
                        <div className="absolute inset-0">
                          <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-yellow-500/15 rounded-full blur-xl animate-pulse delay-700"></div>
                        </div>
                      )}
                      
                      {/* Species data points */}
                      {showSpecies && (
                        <>
                          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" data-testid="map-point-1">
                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-emerald-400/20 rounded-full animate-ping"></div>
                          </div>
                          <div className="absolute top-2/3 left-1/2 w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50 delay-300" data-testid="map-point-2">
                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-blue-400/20 rounded-full animate-ping delay-300"></div>
                          </div>
                          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50 delay-600" data-testid="map-point-3">
                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-purple-400/20 rounded-full animate-ping delay-600"></div>
                          </div>
                          <div className="absolute bottom-1/4 left-2/3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50 delay-900" data-testid="map-point-4">
                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-400/20 rounded-full animate-ping delay-900"></div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Map Label */}
                    <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-md">
                      <span className="text-white/80 text-xs font-medium">Interactive Ocean Map</span>
                    </div>
                    
                    {/* Depth Legend */}
                    <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>Shallow</span>
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Deep</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sample Point Details */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Sample Point Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Point A */}
                  <div className="relative p-4 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-sm border border-emerald-400/20 rounded-xl hover:border-emerald-400/40 transition-all duration-300 group" data-testid="sample-point-details-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg shadow-emerald-400/30 animate-pulse" />
                        <span className="font-semibold text-white text-lg">Point A</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3 text-emerald-300">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-mono">37.7749°N, 122.4194°W</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-red-400" />
                            <span className="text-slate-300 text-sm">Temperature</span>
                          </div>
                          <span className="text-white font-medium">18.5°C</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-300 text-sm">Salinity</span>
                          </div>
                          <span className="text-white font-medium">34.2 PSU</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-slate-300 text-sm">Species</span>
                          </div>
                          <span className="text-emerald-300 font-medium">Blue Rockfish</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Point B */}
                  <div className="relative p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-400/20 rounded-xl hover:border-blue-400/40 transition-all duration-300 group" data-testid="sample-point-details-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-lg shadow-blue-400/30 animate-pulse delay-300" />
                        <span className="font-semibold text-white text-lg">Point B</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3 text-blue-300">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-mono">36.9741°N, 122.0308°W</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-red-400" />
                            <span className="text-slate-300 text-sm">Temperature</span>
                          </div>
                          <span className="text-white font-medium">16.8°C</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-300 text-sm">Salinity</span>
                          </div>
                          <span className="text-white font-medium">33.9 PSU</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-300 text-sm">Species</span>
                          </div>
                          <span className="text-blue-300 font-medium">Kelp Bass</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Point C */}
                  <div className="relative p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/20 rounded-xl hover:border-purple-400/40 transition-all duration-300 group" data-testid="sample-point-details-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full shadow-lg shadow-purple-400/30 animate-pulse delay-600" />
                        <span className="font-semibold text-white text-lg">Point C</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3 text-purple-300">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-mono">35.6870°N, 121.1817°W</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-red-400" />
                            <span className="text-slate-300 text-sm">Temperature</span>
                          </div>
                          <span className="text-white font-medium">19.2°C</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-300 text-sm">Salinity</span>
                          </div>
                          <span className="text-white font-medium">34.5 PSU</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-slate-300 text-sm">Species</span>
                          </div>
                          <span className="text-purple-300 font-medium">Yellowtail</span>
                        </div>
                      </div>
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
        </Tabs>
        </div>
      </div>
    </Layout>
  );
}
