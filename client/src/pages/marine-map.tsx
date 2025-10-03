import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, Fish, Thermometer, Waves, Droplets, Activity,
  Filter, Layers, Satellite, Navigation, Info, TrendingUp,
  BarChart3, Eye, EyeOff, Zap, Wind, Sun, CloudRain,
  Globe, Anchor, Compass, Target, Radio, Wifi, Clock
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/styles/leaflet-custom.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom fish marker icon
const fishIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18.5 12 12 6.5 5.5 12 12 17.5z"/>
      <path d="M12 2v20"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

// Comprehensive marine research data for Indian EEZ
const fishDistributionData = [
  {
    id: 1,
    lat: 8.5241,
    lng: 76.9366,
    species: 'Sardinella longiceps',
    commonName: 'Indian Oil Sardine',
    abundance: 1247,
    temperature: 28.5,
    salinity: 34.8,
    ph: 8.1,
    depth: 45,
    location: 'Kerala Coast',
    season: 'Post-monsoon',
    biomass: '2.3 tons/km²',
    confidence: 95,
    lastSurvey: '2024-01-15',
    researchStation: 'CMFRI Kochi',
    ecosystemHealth: 'Excellent',
    migratory: true,
    threatened: false,
    economicValue: 'High',
    currentSpeed: 2.3,
    currentDirection: 'SW',
    turbidity: 'Low',
    oxygenSat: 98
  },
  {
    id: 2,
    lat: 11.0168,
    lng: 76.9558,
    species: 'Rastrelliger kanagurta',
    commonName: 'Indian Mackerel',
    abundance: 986,
    temperature: 29.2,
    salinity: 35.1,
    ph: 8.0,
    depth: 32,
    location: 'Tamil Nadu Coast',
    season: 'Pre-monsoon',
    biomass: '1.8 tons/km²',
    confidence: 92,
    lastSurvey: '2024-01-14',
    researchStation: 'CIFT Chennai',
    ecosystemHealth: 'Good',
    migratory: true,
    threatened: false,
    economicValue: 'Very High',
    currentSpeed: 1.8,
    currentDirection: 'NE',
    turbidity: 'Medium',
    oxygenSat: 94
  },
  {
    id: 3,
    lat: 15.2993,
    lng: 74.1240,
    species: 'Scomberomorus commerson',
    commonName: 'Spanish Mackerel',
    abundance: 632,
    temperature: 27.8,
    salinity: 35.3,
    ph: 8.2,
    depth: 85,
    location: 'Goa Waters',
    season: 'Winter',
    biomass: '1.2 tons/km²',
    confidence: 88,
    lastSurvey: '2024-01-13',
    researchStation: 'NIO Goa',
    ecosystemHealth: 'Good',
    migratory: true,
    threatened: true,
    economicValue: 'High',
    currentSpeed: 3.1,
    currentDirection: 'W',
    turbidity: 'Low',
    oxygenSat: 96
  },
  {
    id: 4,
    lat: 19.0760,
    lng: 72.8777,
    species: 'Lutjanus argentimaculatus',
    commonName: 'Mangrove Red Snapper',
    abundance: 421,
    temperature: 26.5,
    salinity: 34.5,
    ph: 8.0,
    depth: 65,
    location: 'Mumbai Coast',
    season: 'Monsoon',
    biomass: '0.9 tons/km²',
    confidence: 85,
    lastSurvey: '2024-01-12',
    researchStation: 'CIFE Mumbai',
    ecosystemHealth: 'Fair',
    migratory: false,
    threatened: true,
    economicValue: 'Medium',
    currentSpeed: 1.2,
    currentDirection: 'N',
    turbidity: 'High',
    oxygenSat: 91
  },
  {
    id: 5,
    lat: 13.0827,
    lng: 80.2707,
    species: 'Lates calcarifer',
    commonName: 'Asian Seabass',
    abundance: 234,
    temperature: 28.9,
    salinity: 32.1,
    ph: 7.9,
    depth: 28,
    location: 'Chennai Waters',
    season: 'Summer',
    biomass: '0.7 tons/km²',
    confidence: 90,
    lastSurvey: '2024-01-11',
    researchStation: 'CIFT Chennai',
    ecosystemHealth: 'Good',
    migratory: false,
    threatened: false,
    economicValue: 'High',
    currentSpeed: 0.8,
    currentDirection: 'SE',
    turbidity: 'Medium',
    oxygenSat: 89
  },
  // Adding more impressive data points
  {
    id: 6,
    lat: 21.1702,
    lng: 72.8311,
    species: 'Pomfret argenteus',
    commonName: 'Silver Pomfret',
    abundance: 567,
    temperature: 25.8,
    salinity: 35.4,
    ph: 8.1,
    depth: 120,
    location: 'Gujarat Coast',
    season: 'Post-monsoon',
    biomass: '1.1 tons/km²',
    confidence: 93,
    lastSurvey: '2024-01-10',
    researchStation: 'CIFT Veraval',
    ecosystemHealth: 'Excellent',
    migratory: true,
    threatened: false,
    economicValue: 'Very High',
    currentSpeed: 2.7,
    currentDirection: 'NW',
    turbidity: 'Low',
    oxygenSat: 97
  },
  {
    id: 7,
    lat: 17.6868,
    lng: 83.2185,
    species: 'Hilsa kelee',
    commonName: 'Kelee Shad',
    abundance: 789,
    temperature: 27.1,
    salinity: 33.8,
    ph: 8.0,
    depth: 42,
    location: 'Andhra Pradesh Coast',
    season: 'Winter',
    biomass: '1.5 tons/km²',
    confidence: 87,
    lastSurvey: '2024-01-09',
    researchStation: 'CMFRI Visakhapatnam',
    ecosystemHealth: 'Good',
    migratory: true,
    threatened: false,
    economicValue: 'Medium',
    currentSpeed: 1.9,
    currentDirection: 'E',
    turbidity: 'Medium',
    oxygenSat: 93
  },
  {
    id: 8,
    lat: 22.5726,
    lng: 88.3639,
    species: 'Tenualosa ilisha',
    commonName: 'Hilsa',
    abundance: 1123,
    temperature: 26.2,
    salinity: 31.5,
    ph: 7.8,
    depth: 35,
    location: 'West Bengal Coast',
    season: 'Monsoon',
    biomass: '2.1 tons/km²',
    confidence: 96,
    lastSurvey: '2024-01-08',
    researchStation: 'CIFRI Barrackpore',
    ecosystemHealth: 'Excellent',
    migratory: true,
    threatened: true,
    economicValue: 'Very High',
    currentSpeed: 1.5,
    currentDirection: 'NE',
    turbidity: 'High',
    oxygenSat: 88
  },
  // Additional impressive data points for demo
  {
    id: 9,
    lat: 16.5062,
    lng: 81.8040,
    species: 'Katsuwonus pelamis',
    commonName: 'Skipjack Tuna',
    abundance: 445,
    temperature: 28.1,
    salinity: 35.2,
    ph: 8.1,
    depth: 95,
    location: 'Andhra Pradesh Coast',
    season: 'Summer',
    biomass: '0.8 tons/km²',
    confidence: 91,
    lastSurvey: '2024-01-07',
    researchStation: 'FSI Visakhapatnam',
    ecosystemHealth: 'Good',
    migratory: true,
    threatened: false,
    economicValue: 'Very High',
    currentSpeed: 4.2,
    currentDirection: 'SW',
    turbidity: 'Low',
    oxygenSat: 95
  },
  {
    id: 10,
    lat: 10.7672,
    lng: 79.8449,
    species: 'Selar crumenophthalmus',
    commonName: 'Big-eye Scad',
    abundance: 734,
    temperature: 28.7,
    salinity: 34.9,
    ph: 8.0,
    depth: 58,
    location: 'Tamil Nadu Coast',
    season: 'Post-monsoon',
    biomass: '1.3 tons/km²',
    confidence: 89,
    lastSurvey: '2024-01-06',
    researchStation: 'CMFRI Mandapam',
    ecosystemHealth: 'Good',
    migratory: true,
    threatened: false,
    economicValue: 'Medium',
    currentSpeed: 2.1,
    currentDirection: 'SE',
    turbidity: 'Medium',
    oxygenSat: 92
  }
];

// Marine Protected Areas data
const marineProtectedAreas = [
  {
    id: 'mpa1',
    name: 'Gulf of Mannar Marine National Park',
    coordinates: [[8.7, 78.1], [9.3, 79.3], [8.9, 79.5], [8.5, 78.3]],
    established: '1986',
    area: '560 km²',
    protectionLevel: 'Strict Nature Reserve',
    biodiversity: 'High',
    coralCover: '65%'
  },
  {
    id: 'mpa2', 
    name: 'Mahatma Gandhi Marine National Park',
    coordinates: [[11.5, 92.6], [11.8, 93.1], [11.3, 93.2], [11.1, 92.7]],
    established: '1983',
    area: '281 km²',
    protectionLevel: 'National Park',
    biodiversity: 'Very High',
    coralCover: '78%'
  }
];

// Ocean current simulation data
const oceanCurrents = [
  { lat: 8.0, lng: 77.0, direction: 45, speed: 2.1, name: 'Southwest Monsoon Current' },
  { lat: 12.0, lng: 80.0, direction: 135, speed: 1.8, name: 'East India Coastal Current' },
  { lat: 16.0, lng: 82.0, direction: 90, speed: 2.5, name: 'Equatorial Counter Current' },
  { lat: 20.0, lng: 70.0, direction: 225, speed: 1.9, name: 'Arabian Sea Current' }
];

// Shipping routes data
const shippingRoutes = [
  {
    id: 'route1',
    name: 'Mumbai-Kochi Trade Route',
    coordinates: [[19.0760, 72.8777], [8.5241, 76.9366]],
    traffic: 'High',
    vesselCount: 156
  },
  {
    id: 'route2', 
    name: 'Chennai-Kolkata Coastal Route',
    coordinates: [[13.0827, 80.2707], [22.5726, 88.3639]],
    traffic: 'Medium',
    vesselCount: 89
  }
];

// Indian EEZ boundary (simplified)
const indianEEZ: [number, number][] = [
  [6.0, 68.0],
  [6.0, 97.0],
  [37.0, 97.0],
  [37.0, 68.0],
  [6.0, 68.0]
];

interface MapFilters {
  species: string;
  season: string;
  minAbundance: string;
  showTemperature: boolean;
  showDepth: boolean;
  showBiomass: boolean;
  showCurrents: boolean;
  showMPA: boolean;
  showShipping: boolean;
  realTimeMode: boolean;
}

// Custom Map Effects Component
function MapEffects({ filters }: { filters: MapFilters }) {
  const map = useMap();
  
  useEffect(() => {
    if (filters.realTimeMode) {
      const interval = setInterval(() => {
        // Simulate real-time data updates with subtle map animations
        map.invalidateSize();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [filters.realTimeMode, map]);

  return null;
}

// Weather overlay component
function WeatherOverlay() {
  const [weatherData, setWeatherData] = useState({
    windSpeed: 12.5,
    windDirection: 'SW',
    waveHeight: 1.8,
    visibility: 'Good',
    seaState: 'Moderate'
  });

  useEffect(() => {
    // Simulate weather updates
    const interval = setInterval(() => {
      setWeatherData(prev => ({
        ...prev,
        windSpeed: prev.windSpeed + (Math.random() - 0.5) * 2,
        waveHeight: prev.waveHeight + (Math.random() - 0.5) * 0.5
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 min-w-64">
      <h3 className="text-white font-bold mb-3 flex items-center gap-2">
        <CloudRain className="w-4 h-4 text-blue-400" />
        Live Weather Conditions
      </h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Wind className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-300">Wind: {weatherData.windSpeed.toFixed(1)} kts {weatherData.windDirection}</span>
        </div>
        <div className="flex items-center gap-2">
          <Waves className="w-3 h-3 text-blue-400" />
          <span className="text-slate-300">Waves: {weatherData.waveHeight.toFixed(1)}m</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-3 h-3 text-green-400" />
          <span className="text-slate-300">Visibility: {weatherData.visibility}</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-purple-400" />
          <span className="text-slate-300">Sea: {weatherData.seaState}</span>
        </div>
      </div>
    </div>
  );
}

export default function MarineMapPage() {
  const [filters, setFilters] = useState<MapFilters>({
    species: 'all',
    season: 'all',
    minAbundance: '0',
    showTemperature: true,
    showDepth: false,
    showBiomass: false,
    showCurrents: false,
    showMPA: false,
    showShipping: false,
    realTimeMode: false
  });
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'ocean'>('ocean');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [dataRefreshProgress, setDataRefreshProgress] = useState(0);
  const [activeResearchVessels, setActiveResearchVessels] = useState(12);
  const [lastDataUpdate, setLastDataUpdate] = useState(new Date());

  // Simulate initial loading with progress
  useEffect(() => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
    
    return () => clearInterval(progressInterval);
  }, []);

  // Real-time data simulation
  useEffect(() => {
    if (filters.realTimeMode) {
      const interval = setInterval(() => {
        setDataRefreshProgress(prev => {
          if (prev >= 100) {
            setLastDataUpdate(new Date());
            setActiveResearchVessels(prev => prev + Math.floor(Math.random() * 3) - 1);
            return 0;
          }
          return prev + 20;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [filters.realTimeMode]);

  const filteredData = fishDistributionData.filter(point => {
    const speciesMatch = filters.species === 'all' || point.species === filters.species;
    const seasonMatch = filters.season === 'all' || point.season === filters.season;
    const abundanceMatch = point.abundance >= parseInt(filters.minAbundance);
    return speciesMatch && seasonMatch && abundanceMatch;
  });

  const uniqueSpecies = Array.from(new Set(fishDistributionData.map(d => d.species)));
  const uniqueSeasons = Array.from(new Set(fishDistributionData.map(d => d.season)));

  const getAbundanceColor = (abundance: number) => {
    if (abundance >= 1000) return '#10b981'; // Green
    if (abundance >= 500) return '#f59e0b';  // Yellow
    if (abundance >= 200) return '#ef4444';  // Red
    return '#6b7280'; // Gray
  };

  const getMarkerSize = (abundance: number) => {
    if (abundance >= 1000) return 15;
    if (abundance >= 500) return 12;
    if (abundance >= 200) return 9;
    return 6;
  };

  const getTileLayerUrl = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'ocean':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const createCustomMarker = (point: any) => {
    const color = getAbundanceColor(point.abundance);
    const size = getMarkerSize(point.abundance);
    
    return new L.Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${size * 2}" height="${size * 2}" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="${color}" fill-opacity="0.8" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="white"/>
        </svg>
      `)}`,
      iconSize: [size * 2, size * 2],
      iconAnchor: [size, size],
      popupAnchor: [0, -size],
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-emerald-900/20">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <Globe className="absolute inset-0 m-auto w-12 h-12 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Loading Marine Data Platform</h2>
              <p className="text-slate-400">Connecting to satellite feeds and research stations...</p>
            </div>
            <div className="w-64 mx-auto">
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/5 via-transparent to-emerald-900/5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                  <Globe className="w-10 h-10 text-blue-400 animate-spin" style={{ animationDuration: '10s' }} />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <Wifi className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                  AQUILA Marine Intelligence
                </h1>
                <p className="text-slate-300 text-xl flex items-center gap-2">
                  <Radio className="w-5 h-5 text-green-400 animate-pulse" />
                  Real-time Marine Ecosystem Monitoring • Indian EEZ
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {activeResearchVessels} Active Vessels
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    Live Data Stream
                  </span>
                  <span>Last Update: {lastDataUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant={filters.realTimeMode ? "default" : "outline"}
                onClick={() => setFilters(prev => ({ ...prev, realTimeMode: !prev.realTimeMode }))}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                <Zap className={`w-4 h-4 mr-2 ${filters.realTimeMode ? 'animate-pulse' : ''}`} />
                {filters.realTimeMode ? 'LIVE MODE' : 'Enable Live'}
              </Button>
              
              {filters.realTimeMode && (
                <div className="bg-slate-800/50 rounded-lg p-3 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Data Refresh</span>
                  </div>
                  <Progress value={dataRefreshProgress} className="w-24 h-1" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          {/* Advanced Controls Panel */}
          <Card className="lg:col-span-1 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-400" />
                Mission Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Map Style */}
              <div className="space-y-3">
                <Label className="text-slate-300 font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Map Visualization
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    size="sm"
                    variant={mapStyle === 'ocean' ? 'default' : 'outline'}
                    onClick={() => setMapStyle('ocean')}
                    className="justify-start bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border-blue-500/30"
                  >
                    <Waves className="w-4 h-4 mr-2" />
                    Ocean View
                  </Button>
                  <Button
                    size="sm"
                    variant={mapStyle === 'satellite' ? 'default' : 'outline'}
                    onClick={() => setMapStyle('satellite')}
                    className="justify-start"
                  >
                    <Satellite className="w-4 h-4 mr-2" />
                    Satellite
                  </Button>
                  <Button
                    size="sm"
                    variant={mapStyle === 'streets' ? 'default' : 'outline'}
                    onClick={() => setMapStyle('streets')}
                    className="justify-start"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Nautical
                  </Button>
                </div>
              </div>

              {/* Species Filter */}
              <div className="space-y-3">
                <Label className="text-slate-300 font-medium flex items-center gap-2">
                  <Fish className="w-4 h-4" />
                  Target Species
                </Label>
                <Select value={filters.species} onValueChange={(value) => setFilters(prev => ({ ...prev, species: value }))}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 hover:border-slate-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">🐟 All Species</SelectItem>
                    {uniqueSpecies.map(species => (
                      <SelectItem key={species} value={species}>
                        🐠 {species.split(' ').pop()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Season Filter */}
              <div className="space-y-3">
                <Label className="text-slate-300 font-medium flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Seasonal Pattern
                </Label>
                <Select value={filters.season} onValueChange={(value) => setFilters(prev => ({ ...prev, season: value }))}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 hover:border-slate-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">🌍 All Seasons</SelectItem>
                    {uniqueSeasons.map(season => (
                      <SelectItem key={season} value={season}>
                        {season === 'Summer' ? '☀️' : season === 'Winter' ? '❄️' : season === 'Monsoon' ? '🌧️' : '🍂'} {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Abundance Filter */}
              <div className="space-y-3">
                <Label className="text-slate-300 font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Population Threshold
                </Label>
                <Select value={filters.minAbundance} onValueChange={(value) => setFilters(prev => ({ ...prev, minAbundance: value }))}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 hover:border-slate-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="0">📊 All Populations</SelectItem>
                    <SelectItem value="200">📈 200+ (Low Density)</SelectItem>
                    <SelectItem value="500">📊 500+ (Medium Density)</SelectItem>
                    <SelectItem value="1000">🔥 1000+ (High Density)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Data Overlays */}
              <div className="space-y-4">
                <Label className="text-slate-300 font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Data Layer Controls
                </Label>
                <div className="space-y-3 bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between group hover:bg-slate-800/50 rounded p-2 transition-colors">
                    <Label htmlFor="temp-overlay" className="text-sm text-slate-400 flex items-center gap-2 group-hover:text-slate-300">
                      <Thermometer className="w-3 h-3 text-red-400" />
                      Temperature Zones
                    </Label>
                    <Switch
                      id="temp-overlay"
                      checked={filters.showTemperature}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showTemperature: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between group hover:bg-slate-800/50 rounded p-2 transition-colors">
                    <Label htmlFor="currents-overlay" className="text-sm text-slate-400 flex items-center gap-2 group-hover:text-slate-300">
                      <Wind className="w-3 h-3 text-cyan-400" />
                      Ocean Currents
                    </Label>
                    <Switch
                      id="currents-overlay"
                      checked={filters.showCurrents}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showCurrents: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between group hover:bg-slate-800/50 rounded p-2 transition-colors">
                    <Label htmlFor="mpa-overlay" className="text-sm text-slate-400 flex items-center gap-2 group-hover:text-slate-300">
                      <Anchor className="w-3 h-3 text-green-400" />
                      Protected Areas
                    </Label>
                    <Switch
                      id="mpa-overlay"
                      checked={filters.showMPA}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showMPA: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between group hover:bg-slate-800/50 rounded p-2 transition-colors">
                    <Label htmlFor="shipping-overlay" className="text-sm text-slate-400 flex items-center gap-2 group-hover:text-slate-300">
                      <Navigation className="w-3 h-3 text-orange-400" />
                      Shipping Routes
                    </Label>
                    <Switch
                      id="shipping-overlay"
                      checked={filters.showShipping}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showShipping: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between group hover:bg-slate-800/50 rounded p-2 transition-colors">
                    <Label htmlFor="depth-overlay" className="text-sm text-slate-400 flex items-center gap-2 group-hover:text-slate-300">
                      <Waves className="w-3 h-3 text-blue-400" />
                      Depth Contours
                    </Label>
                    <Switch
                      id="depth-overlay"
                      checked={filters.showDepth}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showDepth: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Legend */}
              <div className="space-y-3">
                <Label className="text-slate-300 font-medium flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Population Legend
                </Label>
                <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-400/30"></div>
                    <span className="text-slate-300 text-sm">Excellent (1000+)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-yellow-400/30"></div>
                    <span className="text-slate-300 text-sm">Good (500-999)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-full shadow-lg shadow-red-400/30"></div>
                    <span className="text-slate-300 text-sm">Moderate (200-499)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="text-slate-400 text-sm">Low (&lt;200)</span>
                  </div>
                </div>
              </div>

              {/* Research Stations */}
              <div className="space-y-3">
                <Label className="text-slate-300 font-medium flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  Active Stations
                </Label>
                <div className="bg-slate-900/50 rounded-lg p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">CMFRI Network</span>
                    <span className="text-green-400">●●●● Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">INCOIS Buoys</span>
                    <span className="text-green-400">●●●○ 75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Research Vessels</span>
                    <span className="text-yellow-400">●●○○ {activeResearchVessels}/24</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Interactive Map */}
          <Card className="lg:col-span-3 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-cyan-500/10 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-md border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="relative">
                    <Waves className="w-6 h-6 text-cyan-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  Live Marine Ecosystem Monitor
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs animate-pulse">
                    LIVE
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">{filteredData.length} Active Stations</span>
                  </div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-400/30">
                    📍 {filteredData.length} locations
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="border-slate-600 hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300">
                      <Layers className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600 hover:border-green-400 hover:bg-green-400/10 transition-all duration-300">
                      <Compass className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Real-time Status Bar */}
              <div className="flex items-center justify-between text-sm pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">Last Updated: </span>
                    <span className="text-cyan-400 font-mono">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Satellite Link Active</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Map Style:</span>
                  <Select value={mapStyle} onValueChange={(value) => setMapStyle(value as 'streets' | 'satellite' | 'ocean')}>
                    <SelectTrigger className="w-32 h-7 bg-slate-800/50 border-slate-600 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="ocean">🌊 Ocean</SelectItem>
                      <SelectItem value="satellite">🛰️ Satellite</SelectItem>
                      <SelectItem value="nautical">⚓ Nautical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 relative">
              {/* Enhanced Loading Screen */}
              {isLoading && (
                <div className="absolute inset-0 z-50 bg-gradient-to-br from-slate-950/98 to-slate-900/98 backdrop-blur-xl flex items-center justify-center">
                  <div className="text-center space-y-8">
                    {/* Animated Marine Scene */}
                    <div className="relative">
                      <div className="relative mx-auto w-32 h-32">
                        <Waves className="w-32 h-32 text-cyan-400 animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Loading Text */}
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
                        Initializing Marine Intelligence
                      </h3>
                      <p className="text-slate-300 text-lg">Connecting to INCOIS & CMFRI networks...</p>
                    </div>

                    {/* Advanced Multi-Layer Progress */}
                    <div className="w-96 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-cyan-400 font-medium">System Integration</span>
                          <span className="text-slate-300 font-mono">{loadingProgress}%</span>
                        </div>
                        <div className="relative bg-slate-800 rounded-full overflow-hidden h-4 shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-300 ease-out shadow-lg shadow-cyan-500/30 relative"
                            style={{ width: `${loadingProgress}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Loading Steps */}
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${loadingProgress > 20 ? 'bg-green-500/10 text-green-400' : 'bg-slate-800/50 text-slate-500'}`}>
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${loadingProgress > 20 ? 'bg-green-400 shadow-lg shadow-green-400/30' : 'bg-slate-600'}`}></div>
                        <div>
                          <div className="font-medium">Satellite Data</div>
                          <div className="text-xs opacity-80">ISRO INSAT feeds</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${loadingProgress > 40 ? 'bg-green-500/10 text-green-400' : 'bg-slate-800/50 text-slate-500'}`}>
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${loadingProgress > 40 ? 'bg-green-400 shadow-lg shadow-green-400/30' : 'bg-slate-600'}`}></div>
                        <div>
                          <div className="font-medium">Ocean Data</div>
                          <div className="text-xs opacity-80">Temperature & currents</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${loadingProgress > 60 ? 'bg-green-500/10 text-green-400' : 'bg-slate-800/50 text-slate-500'}`}>
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${loadingProgress > 60 ? 'bg-green-400 shadow-lg shadow-green-400/30' : 'bg-slate-600'}`}></div>
                        <div>
                          <div className="font-medium">Species Data</div>
                          <div className="text-xs opacity-80">CMFRI databases</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${loadingProgress > 80 ? 'bg-green-500/10 text-green-400' : 'bg-slate-800/50 text-slate-500'}`}>
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${loadingProgress > 80 ? 'bg-green-400 shadow-lg shadow-green-400/30' : 'bg-slate-600'}`}></div>
                        <div>
                          <div className="font-medium">AI Models</div>
                          <div className="text-xs opacity-80">Neural networks ready</div>
                        </div>
                      </div>
                    </div>

                    {/* Network Status */}
                    <div className="flex items-center justify-center gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400">INCOIS Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400">CMFRI Connected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-yellow-400">Vessels: {activeResearchVessels}/24</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="h-[500px] lg:h-[650px] relative bg-gradient-to-br from-slate-900 to-slate-800">
                <MapContainer
                  center={[15.0, 75.0]}
                  zoom={6}
                  className="h-full w-full"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  <TileLayer
                    url={getTileLayerUrl()}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Indian EEZ Boundary */}
                  <Polygon
                    positions={indianEEZ}
                    pathOptions={{
                      color: '#3b82f6',
                      weight: 2,
                      opacity: 0.8,
                      fillOpacity: 0.1
                    }}
                  />

                  {/* Fish Distribution Points */}
                  {filteredData.map(point => (
                    <Marker
                      key={point.id}
                      position={[point.lat, point.lng]}
                      icon={createCustomMarker(point)}
                    >
                      <Popup className="custom-popup">
                        <div className="p-2 min-w-64">
                          <h3 className="font-bold text-lg mb-1">{point.commonName}</h3>
                          <p className="text-sm italic text-gray-600 mb-3">{point.species}</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Fish className="w-3 h-3 text-blue-500" />
                                <span className="font-medium">Abundance:</span>
                              </div>
                              <span className="text-lg font-bold text-green-600">{point.abundance.toLocaleString()}</span>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <BarChart3 className="w-3 h-3 text-purple-500" />
                                <span className="font-medium">Biomass:</span>
                              </div>
                              <span className="font-semibold">{point.biomass}</span>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Thermometer className="w-3 h-3 text-red-500" />
                                <span className="font-medium">Temperature:</span>
                              </div>
                              <span>{point.temperature}°C</span>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Droplets className="w-3 h-3 text-blue-500" />
                                <span className="font-medium">Salinity:</span>
                              </div>
                              <span>{point.salinity} PSU</span>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Activity className="w-3 h-3 text-green-500" />
                                <span className="font-medium">pH:</span>
                              </div>
                              <span>{point.ph}</span>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Waves className="w-3 h-3 text-cyan-500" />
                                <span className="font-medium">Depth:</span>
                              </div>
                              <span>{point.depth}m</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-2 border-t">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>📍 {point.location}</span>
                              <span>🗓️ {point.season}</span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Temperature Zones (if enabled) */}
                  {filters.showTemperature && filteredData.map(point => (
                    <Circle
                      key={`temp-${point.id}`}
                      center={[point.lat, point.lng]}
                      radius={5000}
                      pathOptions={{
                        color: point.temperature > 28 ? '#ef4444' : point.temperature > 26 ? '#f59e0b' : '#3b82f6',
                        weight: 1,
                        opacity: 0.6,
                        fillOpacity: 0.1
                      }}
                    />
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Locations</p>
                  <p className="text-3xl font-bold text-blue-400">{filteredData.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Fish Count</p>
                  <p className="text-3xl font-bold text-green-400">
                    {filteredData.reduce((sum, point) => sum + point.abundance, 0).toLocaleString()}
                  </p>
                </div>
                <Fish className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Species Count</p>
                  <p className="text-3xl font-bold text-purple-400">{uniqueSpecies.length}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg Temperature</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {(filteredData.reduce((sum, point) => sum + point.temperature, 0) / filteredData.length).toFixed(1)}°C
                  </p>
                </div>
                <Thermometer className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}