import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  TrendingUp, Fish, Waves, Thermometer, Droplets, Activity,
  BarChart3, PieChart as PieChartIcon, TrendingDown, MapPin,
  Filter, Download, RefreshCw, Calendar, Users, Zap
} from 'lucide-react';

// Mock data for different chart types
const temperatureData = [
  { month: 'Jan', temperature: 24.5, salinity: 35.2, ph: 8.1, fishCount: 145 },
  { month: 'Feb', temperature: 25.1, salinity: 35.4, ph: 8.0, fishCount: 162 },
  { month: 'Mar', temperature: 26.2, salinity: 35.1, ph: 8.2, fishCount: 198 },
  { month: 'Apr', temperature: 27.8, salinity: 34.9, ph: 8.1, fishCount: 234 },
  { month: 'May', temperature: 28.9, salinity: 34.8, ph: 8.0, fishCount: 289 },
  { month: 'Jun', temperature: 29.2, salinity: 34.7, ph: 7.9, fishCount: 312 },
  { month: 'Jul', temperature: 28.8, salinity: 34.8, ph: 7.8, fishCount: 298 },
  { month: 'Aug', temperature: 28.5, salinity: 34.9, ph: 7.9, fishCount: 276 },
  { month: 'Sep', temperature: 27.9, salinity: 35.0, ph: 8.0, fishCount: 245 },
  { month: 'Oct', temperature: 27.1, salinity: 35.2, ph: 8.1, fishCount: 213 },
  { month: 'Nov', temperature: 26.0, salinity: 35.3, ph: 8.2, fishCount: 178 },
  { month: 'Dec', temperature: 25.2, salinity: 35.4, ph: 8.1, fishCount: 156 }
];

const speciesDistribution = [
  { name: 'Sardinella longiceps', value: 35, count: 1247, color: '#0ea5e9' },
  { name: 'Rastrelliger kanagurta', value: 28, count: 986, color: '#10b981' },
  { name: 'Scomberomorus commerson', value: 18, count: 632, color: '#8b5cf6' },
  { name: 'Lutjanus argentimaculatus', value: 12, count: 421, color: '#f59e0b' },
  { name: 'Others', value: 7, count: 245, color: '#6b7280' }
];

const depthData = [
  { depth: '0-10m', temperature: 28.5, oxygen: 7.2, species: 12 },
  { depth: '10-20m', temperature: 27.8, oxygen: 6.8, species: 15 },
  { depth: '20-50m', temperature: 26.2, oxygen: 6.1, species: 18 },
  { depth: '50-100m', temperature: 23.9, oxygen: 5.4, species: 14 },
  { depth: '100-200m', temperature: 20.1, oxygen: 4.8, species: 9 },
  { depth: '>200m', temperature: 16.5, oxygen: 4.2, species: 6 }
];

const correlationData = [
  { temperature: 24.5, fishAbundance: 145 },
  { temperature: 25.1, fishAbundance: 162 },
  { temperature: 26.2, fishAbundance: 198 },
  { temperature: 27.8, fishAbundance: 234 },
  { temperature: 28.9, fishAbundance: 289 },
  { temperature: 29.2, fishAbundance: 312 },
  { temperature: 28.8, fishAbundance: 298 },
  { temperature: 28.5, fishAbundance: 276 },
  { temperature: 27.9, fishAbundance: 245 },
  { temperature: 27.1, fishAbundance: 213 },
  { temperature: 26.0, fishAbundance: 178 },
  { temperature: 25.2, fishAbundance: 156 }
];

const radarData = [
  { parameter: 'Temperature', value: 85, fullMark: 100 },
  { parameter: 'Salinity', value: 78, fullMark: 100 },
  { parameter: 'pH', value: 92, fullMark: 100 },
  { parameter: 'Oxygen', value: 73, fullMark: 100 },
  { parameter: 'Biodiversity', value: 68, fullMark: 100 },
  { parameter: 'Water Quality', value: 81, fullMark: 100 }
];

export default function DynamicDashboard() {
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [selectedComparison, setSelectedComparison] = useState('fishCount');
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate live data updates
  useEffect(() => {
    if (!isLiveMode) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In a real app, this would fetch new data
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const getParameterData = (param: string) => {
    switch (param) {
      case 'temperature':
        return temperatureData.map(d => ({ ...d, value: d.temperature }));
      case 'salinity':
        return temperatureData.map(d => ({ ...d, value: d.salinity }));
      case 'ph':
        return temperatureData.map(d => ({ ...d, value: d.ph }));
      case 'fishCount':
        return temperatureData.map(d => ({ ...d, value: d.fishCount }));
      default:
        return temperatureData;
    }
  };

  const getParameterColor = (param: string) => {
    const colors = {
      temperature: '#ef4444',
      salinity: '#06b6d4',
      ph: '#8b5cf6',
      fishCount: '#10b981'
    };
    return colors[param as keyof typeof colors] || '#6b7280';
  };

  const getParameterUnit = (param: string) => {
    const units = {
      temperature: '°C',
      salinity: 'PSU',
      ph: '',
      fishCount: 'count'
    };
    return units[param as keyof typeof units] || '';
  };

  const currentData = getParameterData(selectedParameter);
  const currentValue = currentData[currentData.length - 1]?.value || 0;
  const previousValue = currentData[currentData.length - 2]?.value || 0;
  const trend = currentValue > previousValue ? 'up' : 'down';
  const trendPercentage = ((currentValue - previousValue) / previousValue * 100).toFixed(1);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header with controls */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Dynamic Analytics Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Real-time marine data visualization and analysis
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant={isLiveMode ? "default" : "outline"}
              onClick={() => setIsLiveMode(!isLiveMode)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isLiveMode ? 'Live Mode ON' : 'Enable Live Mode'}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Real-time status */}
        {isLiveMode && (
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Live Data Stream Active</span>
                </div>
                <span className="text-sm text-slate-400">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Water Temperature</p>
                  <p className="text-3xl font-bold text-blue-400">28.5°C</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">+2.3%</span>
                  </div>
                </div>
                <Thermometer className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Fish Population</p>
                  <p className="text-3xl font-bold text-emerald-400">3,524</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">+12.5%</span>
                  </div>
                </div>
                <Fish className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">pH Level</p>
                  <p className="text-3xl font-bold text-purple-400">8.1</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">-0.8%</span>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Salinity</p>
                  <p className="text-3xl font-bold text-orange-400">34.8 PSU</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">+1.2%</span>
                  </div>
                </div>
                <Droplets className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Parameter Analysis */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Interactive Parameter Analysis
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="salinity">Salinity</SelectItem>
                      <SelectItem value="ph">pH Level</SelectItem>
                      <SelectItem value="fishCount">Fish Count</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  {currentValue.toFixed(1)} {getParameterUnit(selectedParameter)}
                  <span className={`ml-2 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {trend === 'up' ? '↗' : '↘'} {trendPercentage}%
                  </span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getParameterColor(selectedParameter)}
                    fill={getParameterColor(selectedParameter)}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Correlation Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Temperature vs Fish Abundance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="temperature" 
                      name="Temperature" 
                      unit="°C"
                      stroke="#9ca3af"
                    />
                    <YAxis 
                      dataKey="fishAbundance" 
                      name="Fish Count"
                      stroke="#9ca3af"
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Scatter dataKey="fishAbundance" fill="#10b981" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Species Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={speciesDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {speciesDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Depth Analysis and Environmental Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Waves className="w-5 h-5" />
                Depth Profile Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={depthData} layout="verseChart">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="depth" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="species" fill="#8b5cf6" name="Species Count" />
                    <Bar dataKey="temperature" fill="#ef4444" name="Temperature" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Environmental Health Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="parameter" className="text-slate-400" />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={false}
                    />
                    <Radar
                      name="Health Index"
                      dataKey="value"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Quick Actions</h3>
                <p className="text-slate-400">Analyze your data with advanced marine research tools</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-blue-500/30 hover:bg-blue-500/10">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Map
                </Button>
                <Button variant="outline" className="border-green-500/30 hover:bg-green-500/10">
                  <Fish className="w-4 h-4 mr-2" />
                  AI Classifier
                </Button>
                <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                  <Activity className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}