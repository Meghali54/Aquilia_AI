import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Download, Play, Eye, Calendar, MapPin, Database, Fish, Dna, FileText, Waves, Sparkles, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface Dataset {
  id: string;
  name: string;
  type: string;
  location: string;
  size: string;
  status: string;
  createdAt: Date;
  metadata?: any;
}

export default function Explorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  const { data: datasets, isLoading } = useQuery<Dataset[]>({
    queryKey: ['/api/datasets'],
  });

  const filteredDatasets = datasets?.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || dataset.type === filterType;
    const matchesStatus = filterStatus === 'all' || dataset.status === filterStatus;
    const matchesLocation = filterLocation === 'all' || dataset.location.includes(filterLocation);
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  }) || [];

  const handleDownload = (dataset: Dataset) => {
    // In a real app, this would trigger actual download
    console.log('Downloading dataset:', dataset.id);
  };

  const handleAnalyze = (dataset: Dataset) => {
    // In a real app, this would redirect to analysis page
    console.log('Analyzing dataset:', dataset.id);
  };

  const handleView = (dataset: Dataset) => {
    // In a real app, this would open dataset details
    console.log('Viewing dataset:', dataset.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Ocean Data':
        return <Database className="w-6 h-6 text-blue-400" />;
      case 'Fish Data':
        return <Fish className="w-6 h-6 text-emerald-400" />;
      case 'eDNA':
        return <Dna className="w-6 h-6 text-orange-400" />;
      case 'Otolith Data':
        return <FileText className="w-6 h-6 text-purple-400" />;
      default:
        return <Database className="w-6 h-6 text-slate-400" />;
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'Ocean Data':
        return 'from-blue-500/20 to-cyan-500/20';
      case 'Fish Data':
        return 'from-emerald-500/20 to-teal-500/20';
      case 'eDNA':
        return 'from-orange-500/20 to-yellow-500/20';
      case 'Otolith Data':
        return 'from-purple-500/20 to-pink-500/20';
      default:
        return 'from-slate-500/20 to-slate-400/20';
    }
  };

  const breadcrumbs = [
    { label: 'Explorer' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-8 relative">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Enhanced Header Section */}
        <div className="relative">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 overflow-hidden group hover:border-slate-600/50 transition-all duration-300">
            {/* Ocean Wave Animation */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
                <path d="M0 100 Q100 80, 200 100 T400 100 V200 H0 Z" fill="url(#explorerWaveGrad1)">
                  <animate attributeName="d" values="M0 100 Q100 80, 200 100 T400 100 V200 H0 Z;M0 100 Q100 120, 200 100 T400 100 V200 H0 Z;M0 100 Q100 80, 200 100 T400 100 V200 H0 Z" dur="6s" repeatCount="indefinite"/>
                </path>
                <path d="M0 120 Q150 100, 300 120 T400 120 V200 H0 Z" fill="url(#explorerWaveGrad2)" opacity="0.7">
                  <animate attributeName="d" values="M0 120 Q150 100, 300 120 T400 120 V200 H0 Z;M0 120 Q150 140, 300 120 T400 120 V200 H0 Z;M0 120 Q150 100, 300 120 T400 120 V200 H0 Z" dur="8s" repeatCount="indefinite"/>
                </path>
                <defs>
                  <linearGradient id="explorerWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1"/>
                  </linearGradient>
                  <linearGradient id="explorerWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                <Search className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">Data Explorer</h1>
                <p className="text-slate-400 text-lg">
                  Browse and analyze marine research datasets
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                <Filter className="w-5 h-5 text-purple-400" />
              </div>
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search datasets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 focus:border-blue-400 text-white placeholder:text-slate-500 backdrop-blur-sm transition-all duration-300"
                    data-testid="input-search-datasets"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 focus:border-blue-400 text-white backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/50 hover:border-blue-300" data-testid="select-filter-type">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800/95 border-slate-600 backdrop-blur-md shadow-2xl">
                    <SelectItem value="all" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-blue-600/20 focus:to-emerald-600/20 transition-all duration-300">All Types</SelectItem>
                    <SelectItem value="Ocean Data" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-blue-600/20 focus:to-cyan-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        Ocean Data
                      </div>
                    </SelectItem>
                    <SelectItem value="Fish Data" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-emerald-600/20 focus:to-teal-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <Fish className="w-4 h-4 text-emerald-400" />
                        Fish Data
                      </div>
                    </SelectItem>
                    <SelectItem value="eDNA" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-orange-600/20 focus:to-yellow-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <Dna className="w-4 h-4 text-orange-400" />
                        eDNA
                      </div>
                    </SelectItem>
                    <SelectItem value="Otolith Data" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-purple-600/20 focus:to-pink-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" />
                        Otolith Data
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 focus:border-blue-400 text-white backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/50 hover:border-blue-300" data-testid="select-filter-status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800/95 border-slate-600 backdrop-blur-md shadow-2xl">
                    <SelectItem value="all" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-blue-600/20 focus:to-emerald-600/20 transition-all duration-300">All Statuses</SelectItem>
                    <SelectItem value="processed" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-emerald-600/20 focus:to-green-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        Processed
                      </div>
                    </SelectItem>
                    <SelectItem value="processing" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-yellow-600/20 focus:to-orange-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        Processing
                      </div>
                    </SelectItem>
                    <SelectItem value="pending" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-blue-600/20 focus:to-cyan-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="failed" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-red-600/20 focus:to-pink-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        Failed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Location</label>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 focus:border-blue-400 text-white backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/50 hover:border-blue-300" data-testid="select-filter-location">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800/95 border-slate-600 backdrop-blur-md shadow-2xl">
                    <SelectItem value="all" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-blue-600/20 focus:to-emerald-600/20 transition-all duration-300">All Locations</SelectItem>
                    <SelectItem value="California" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-blue-600/20 focus:to-cyan-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        California Coast
                      </div>
                    </SelectItem>
                    <SelectItem value="Great Barrier Reef" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-emerald-600/20 focus:to-teal-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        Great Barrier Reef
                      </div>
                    </SelectItem>
                    <SelectItem value="Alaska" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-cyan-600/20 focus:to-blue-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        Alaska Peninsula
                      </div>
                    </SelectItem>
                    <SelectItem value="Pacific" className="text-slate-200 hover:bg-slate-700/50 hover:text-white focus:bg-gradient-to-r focus:from-purple-600/20 focus:to-blue-600/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        Pacific Ocean
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full border-slate-600 hover:border-blue-400 bg-slate-800/50 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-emerald-600/20 backdrop-blur-sm transition-all duration-300"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterStatus('all');
                    setFilterLocation('all');
                  }}
                  data-testid="button-clear-filters"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Results */}
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          <CardHeader className="border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                Dataset Results ({filteredDatasets.length} found)
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-slate-600 hover:border-emerald-400 bg-slate-800/50 hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-teal-600/20 backdrop-blur-sm transition-all duration-300"
                  data-testid="button-export-results"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 bg-gradient-to-r from-slate-800/50 to-slate-700/50 animate-pulse rounded-xl border border-slate-700/50" />
                ))}
              </div>
            ) : filteredDatasets.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-600/50">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-xl font-semibold text-white mb-2">No datasets found</p>
                <p className="text-slate-400">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDatasets.map((dataset, index) => (
                  <div 
                    key={dataset.id} 
                    className={`bg-gradient-to-r ${getTypeGradient(dataset.type)} backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden`}
                    data-testid={`dataset-${dataset.id}`}
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl flex items-center justify-center border border-slate-600/50 group-hover:scale-110 transition-transform duration-300">
                            {getTypeIcon(dataset.type)}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300" data-testid={`dataset-name-${dataset.id}`}>
                              {dataset.name}
                            </h3>
                            <div className="flex items-center gap-6 text-sm text-slate-400 mt-1">
                              <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {dataset.location}
                              </span>
                              <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(dataset.createdAt), 'MMM dd, yyyy')}
                              </span>
                              <span className="font-medium">{dataset.size}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-4">
                          <Badge 
                            variant="outline" 
                            className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 transition-colors duration-300"
                            data-testid={`dataset-type-${dataset.id}`}
                          >
                            {dataset.type}
                          </Badge>
                          <Badge 
                            className={`${getStatusColor(dataset.status)} hover:scale-105 transition-transform duration-300`}
                            data-testid={`dataset-status-${dataset.id}`}
                          >
                            {dataset.status}
                          </Badge>
                        </div>

                        {dataset.metadata && (
                          <div className="text-sm text-slate-400 bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                            {Object.entries(dataset.metadata).map(([key, value]) => (
                              <span key={key} className="mr-6 inline-block">
                                <span className="font-medium text-slate-300">{key}:</span> {String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 hover:scale-110"
                          onClick={() => handleView(dataset)}
                          data-testid={`button-view-${dataset.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-300 hover:scale-110"
                          onClick={() => handleDownload(dataset)}
                          data-testid={`button-download-${dataset.id}`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {dataset.status === 'processed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-300 hover:scale-110"
                            onClick={() => handleAnalyze(dataset)}
                            data-testid={`button-analyze-${dataset.id}`}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
