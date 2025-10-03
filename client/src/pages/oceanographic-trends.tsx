import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, Waves, Thermometer, Droplets, Wind, 
  Fish, BarChart3, TrendingUp, TrendingDown, 
  Zap, Globe, Brain, Target, Database, Lightbulb,
  AlertTriangle, CheckCircle, Cpu, BarChart2,
  LineChart, PieChart, Activity as ActivityIcon
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Environmental parameters interface
interface EnvironmentalParams {
  temperature: number;
  salinity: number;
  ph: number;
  oxygen: number;
  depth: number;
  turbidity: number;
  nutrientLevel: number;
}

// Prediction results interface
interface PredictionResult {
  fishCount: number;
  speciesDiversity: number;
  biomass: number;
  confidence: number;
}

// ML Model info
interface ModelInfo {
  algorithm: string;
  features: string[];
  accuracy: string;
  lastTrained: string;
}

export default function OceanographicTrendPage() {
  // Environmental parameters state
  const [params, setParams] = useState<EnvironmentalParams>({
    temperature: 26.0,
    salinity: 34.5,
    ph: 8.1,
    oxygen: 6.5,
    depth: 25,
    turbidity: 3.0,
    nutrientLevel: 40
  });

  // Prediction results
  const [predictions, setPredictions] = useState<PredictionResult>({
    fishCount: 1420,
    speciesDiversity: 11.8,
    biomass: 16776,
    confidence: 92
  });

  // Model information
  const [modelInfo, setModelInfo] = useState<ModelInfo>({
    algorithm: "Random Forest Regressor",
    features: ["Temperature", "Salinity", "pH", "Oxygen", "Depth", "Turbidity", "Nutrient Level"],
    accuracy: "94.2%",
    lastTrained: "2024-01-15"
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [autoPredict, setAutoPredict] = useState(true);
  const [environmentalImpacts, setEnvironmentalImpacts] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [historicalPredictions, setHistoricalPredictions] = useState<any[]>([]);
  const [correlationData, setCorrelationData] = useState<any[]>([]);

  // Feature importance data
  const [featureImportance] = useState([
    { feature: 'Temperature', importance: 0.32, color: '#ef4444' },
    { feature: 'Oxygen', importance: 0.24, color: '#06b6d4' },
    { feature: 'pH', importance: 0.18, color: '#10b981' },
    { feature: 'Salinity', importance: 0.15, color: '#3b82f6' },
    { feature: 'Nutrient Level', importance: 0.08, color: '#f59e0b' },
    { feature: 'Turbidity', importance: 0.02, color: '#8b5cf6' },
    { feature: 'Depth', importance: 0.01, color: '#6b7280' }
  ]);

  // Make prediction API call
  const makePrediction = useCallback(async (newParams: EnvironmentalParams) => {
    if (!autoPredict) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ml/predict-abundance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: newParams.temperature,
          salinity: newParams.salinity,
          ph: newParams.ph,
          oxygen: newParams.oxygen,
          depth: newParams.depth,
          turbidity: newParams.turbidity,
          nutrientLevel: newParams.nutrientLevel
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPredictions(data.predictions);
        setEnvironmentalImpacts(data.environmentalImpacts || []);
        setRecommendations(data.recommendations || []);
        setModelInfo(data.modelInfo);
        
        // Add to historical data
        setHistoricalPredictions(prev => [...prev.slice(-19), {
          timestamp: Date.now(),
          ...newParams,
          ...data.predictions
        }]);
      }
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [autoPredict]);

  // Update parameter and trigger prediction
  const updateParameter = (param: keyof EnvironmentalParams, value: number) => {
    const newParams = { ...params, [param]: value };
    setParams(newParams);
    
    if (autoPredict) {
      makePrediction(newParams);
    }
  };

  // Generate correlation data
  useEffect(() => {
    const correlations = [
      { parameter: 'Temperature', fishCount: 0.78, speciesDiversity: -0.65, biomass: 0.82 },
      { parameter: 'Oxygen', fishCount: 0.92, speciesDiversity: 0.87, biomass: 0.89 },
      { parameter: 'pH', fishCount: 0.74, speciesDiversity: 0.69, biomass: 0.76 },
      { parameter: 'Salinity', fishCount: -0.43, speciesDiversity: -0.38, biomass: -0.41 },
      { parameter: 'Turbidity', fishCount: -0.68, speciesDiversity: -0.72, biomass: -0.70 }
    ];
    setCorrelationData(correlations);
  }, []);

  // Initialize with sample historical data for immediate visualization
  useEffect(() => {
    const sampleHistoricalData = [
      { timestamp: Date.now() - 9000, temperature: 25.8, fishCount: 1380, speciesDiversity: 11.2 },
      { timestamp: Date.now() - 8000, temperature: 26.1, fishCount: 1420, speciesDiversity: 11.5 },
      { timestamp: Date.now() - 7000, temperature: 26.3, fishCount: 1450, speciesDiversity: 11.7 },
      { timestamp: Date.now() - 6000, temperature: 26.0, fishCount: 1420, speciesDiversity: 11.6 },
      { timestamp: Date.now() - 5000, temperature: 26.2, fishCount: 1440, speciesDiversity: 11.8 }
    ];
    setHistoricalPredictions(sampleHistoricalData);
    makePrediction(params);
  }, []);

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
              <Brain className="w-10 h-10 text-blue-400" />
              Oceanographic ML Prediction Engine
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white animate-pulse">
                AI-Powered
              </Badge>
            </h1>
            <p className="text-slate-400 text-lg mt-2">Machine Learning-driven fish abundance prediction using Random Forest Regression</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-slate-400">Model Accuracy</div>
              <div className="text-2xl font-bold text-green-400">{modelInfo.accuracy}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Model Active</span>
            </div>
            <Button
              onClick={() => makePrediction(params)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500"
            >
              {isLoading ? <Cpu className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {isLoading ? 'Predicting...' : 'Predict Now'}
            </Button>
          </div>
        </div>

        {/* Model Status Bar */}
        <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-slate-700/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-sm text-slate-400">Algorithm</div>
                <div className="text-lg font-bold text-blue-400">{modelInfo.algorithm.split(' ')[0]}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Features</div>
                <div className="text-lg font-bold text-purple-400">{modelInfo.features.length}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Confidence</div>
                <div className="text-lg font-bold text-green-400">{predictions.confidence}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Predicted Fish</div>
                <div className="text-lg font-bold text-cyan-400">{predictions.fishCount.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Species Diversity</div>
                <div className="text-lg font-bold text-yellow-400">{predictions.speciesDiversity}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Biomass (kg)</div>
                <div className="text-lg font-bold text-orange-400">{predictions.biomass.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Environmental Controls */}
          <Card className="lg:col-span-1 bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Environmental Parameters
              </CardTitle>
              <div className="flex items-center justify-between">
                <Label className="text-slate-400 text-sm">Auto-predict</Label>
                <Switch
                  checked={autoPredict}
                  onCheckedChange={setAutoPredict}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Temperature Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    Temperature
                  </Label>
                  <Badge variant="outline" className="text-red-400 border-red-400/30">
                    {params.temperature.toFixed(1)}°C
                  </Badge>
                </div>
                <Slider
                  value={[params.temperature]}
                  onValueChange={([value]) => updateParameter('temperature', value)}
                  min={20}
                  max={32}
                  step={0.1}
                  className="[&_[role=slider]]:bg-red-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>20°C</span>
                  <span className="text-red-400">Optimal: 24-28°C</span>
                  <span>32°C</span>
                </div>
              </div>

              {/* Salinity Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    Salinity
                  </Label>
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                    {params.salinity.toFixed(1)} PSU
                  </Badge>
                </div>
                <Slider
                  value={[params.salinity]}
                  onValueChange={([value]) => updateParameter('salinity', value)}
                  min={30}
                  max={37}
                  step={0.1}
                  className="[&_[role=slider]]:bg-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>30 PSU</span>
                  <span className="text-blue-400">Optimal: 33-36 PSU</span>
                  <span>37 PSU</span>
                </div>
              </div>

              {/* pH Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    pH Level
                  </Label>
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    {params.ph.toFixed(2)}
                  </Badge>
                </div>
                <Slider
                  value={[params.ph]}
                  onValueChange={([value]) => updateParameter('ph', value)}
                  min={7.5}
                  max={8.5}
                  step={0.01}
                  className="[&_[role=slider]]:bg-green-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>7.5</span>
                  <span className="text-green-400">Optimal: 8.0-8.2</span>
                  <span>8.5</span>
                </div>
              </div>

              {/* Oxygen Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    Dissolved Oxygen
                  </Label>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                    {params.oxygen.toFixed(1)} mg/L
                  </Badge>
                </div>
                <Slider
                  value={[params.oxygen]}
                  onValueChange={([value]) => updateParameter('oxygen', value)}
                  min={4}
                  max={8}
                  step={0.1}
                  className="[&_[role=slider]]:bg-cyan-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>4 mg/L</span>
                  <span className="text-cyan-400">Optimal: &gt;6 mg/L</span>
                  <span>8 mg/L</span>
                </div>
              </div>

              {/* Depth Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Waves className="w-4 h-4 text-purple-400" />
                    Depth
                  </Label>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                    {params.depth.toFixed(0)}m
                  </Badge>
                </div>
                <Slider
                  value={[params.depth]}
                  onValueChange={([value]) => updateParameter('depth', value)}
                  min={10}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>10m</span>
                  <span className="text-purple-400">Coastal: 10-50m</span>
                  <span>100m</span>
                </div>
              </div>

              {/* Turbidity Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-yellow-400" />
                    Turbidity
                  </Label>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                    {params.turbidity.toFixed(1)} NTU
                  </Badge>
                </div>
                <Slider
                  value={[params.turbidity]}
                  onValueChange={([value]) => updateParameter('turbidity', value)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="[&_[role=slider]]:bg-yellow-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0 NTU</span>
                  <span className="text-yellow-400">Clear: &lt;3 NTU</span>
                  <span>10 NTU</span>
                </div>
              </div>

              {/* Nutrient Level Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Database className="w-4 h-4 text-orange-400" />
                    Nutrients
                  </Label>
                  <Badge variant="outline" className="text-orange-400 border-orange-400/30">
                    {params.nutrientLevel.toFixed(0)} μg/L
                  </Badge>
                </div>
                <Slider
                  value={[params.nutrientLevel]}
                  onValueChange={([value]) => updateParameter('nutrientLevel', value)}
                  min={10}
                  max={80}
                  step={1}
                  className="[&_[role=slider]]:bg-orange-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>10 μg/L</span>
                  <span className="text-orange-400">Optimal: 30-50 μg/L</span>
                  <span>80 μg/L</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Prediction Results Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Predicted Fish Count</p>
                      <p className="text-3xl font-bold text-blue-400">{predictions.fishCount.toLocaleString()}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {predictions.fishCount > 1200 ? 
                          <TrendingUp className="w-4 h-4 text-green-400" /> : 
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        }
                        <span className={`text-sm ${predictions.fishCount > 1200 ? 'text-green-400' : 'text-red-400'}`}>
                          {predictions.fishCount > 1200 ? 'Healthy' : 'Below Average'}
                        </span>
                      </div>
                    </div>
                    <Fish className="w-12 h-12 text-blue-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Species Diversity</p>
                      <p className="text-3xl font-bold text-green-400">{predictions.speciesDiversity}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {predictions.speciesDiversity > 10 ? 
                          <TrendingUp className="w-4 h-4 text-green-400" /> : 
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        }
                        <span className={`text-sm ${predictions.speciesDiversity > 10 ? 'text-green-400' : 'text-red-400'}`}>
                          {predictions.speciesDiversity > 10 ? 'Rich Ecosystem' : 'Limited Diversity'}
                        </span>
                      </div>
                    </div>
                    <BarChart3 className="w-12 h-12 text-green-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Biomass</p>
                      <p className="text-3xl font-bold text-purple-400">{(predictions.biomass/1000).toFixed(1)}t</p>
                      <div className="flex items-center gap-1 mt-2">
                        <ActivityIcon className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-400">
                          {predictions.confidence}% Confidence
                        </span>
                      </div>
                    </div>
                    <Database className="w-12 h-12 text-purple-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Importance Chart */}
            <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-blue-400" />
                  ML Model Feature Importance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureImportance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                      <YAxis dataKey="feature" type="category" stroke="#9ca3af" fontSize={12} width={100} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px' 
                        }}
                        formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
                      />
                      <Bar dataKey="importance" radius={[0, 4, 4, 0]} fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Historical Predictions */}
            {historicalPredictions.length > 0 && (
              <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-green-400" />
                    Prediction History & Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={historicalPredictions.slice(-10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="timestamp" stroke="#9ca3af" fontSize={12} 
                               tickFormatter={(value) => new Date(value).toLocaleTimeString().slice(0, 5)} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px' 
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="fishCount" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Fish Count"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="speciesDiversity" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Species Diversity"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Environmental Impacts & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Environmental Impacts */}
              {environmentalImpacts.length > 0 && (
                <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Environmental Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {environmentalImpacts.map((impact, index) => (
                        <Alert key={index} className="border-red-500/30 bg-red-500/10">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-red-300">
                            {impact}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-green-400 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendations.map((rec, index) => (
                        <Alert key={index} className="border-green-500/30 bg-green-500/10">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <AlertDescription className="text-green-300">
                            {rec}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Parameter Correlation Matrix */}
            <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-400" />
                  Environmental Parameter Correlations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={correlationData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="parameter" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[-1, 1]} 
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                      />
                      <Radar
                        name="Fish Count"
                        dataKey="fishCount"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Species Diversity"
                        dataKey="speciesDiversity"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Biomass"
                        dataKey="biomass"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}