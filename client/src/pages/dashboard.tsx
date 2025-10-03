import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Database, Gauge, Dna, Brain, Upload, FileText, Zap, TrendingUp, Activity, Waves } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';

interface DashboardData {
  datasets: number;
  sensors: number;
  ednaSamples: number;
  aiAnalyses: number;
  recentUploads: Array<{
    id: string;
    name: string;
    type: string;
    location: string;
    date: Date;
    status: string;
  }>;
}

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard/summary'],
  });

  const metrics = [
    {
      title: 'Total Datasets',
      value: dashboardData?.datasets?.toLocaleString() || '0',
      change: '+12.3%',
      description: '+142 this month',
      icon: Database,
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Active Gauge', 
      value: dashboardData?.sensors?.toLocaleString() || '0',
      change: '+8.7%',
      description: '87% operational',
      icon: Gauge,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'eDNA Samples',
      value: dashboardData?.ednaSamples?.toLocaleString() || '0', 
      change: '+24.1%',
      description: 'Processing queue: 47',
      icon: Dna,
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'AI Analyses',
      value: dashboardData?.aiAnalyses?.toLocaleString() || '0',
      change: '+5.2%', 
      description: '94% accuracy rate',
      icon: Brain,
      color: 'text-orange-400',
      bgGradient: 'from-orange-500/20 to-yellow-500/20',
      borderColor: 'border-orange-500/30',
    },
  ];

  const quickActions = [
    {
      title: 'Upload Data',
      description: 'Add new datasets',
      icon: Upload,
      href: '/upload',
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Run Analysis', 
      description: 'AI-powered insights',
      icon: Brain,
      href: '/ai-tools',
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Generate Report',
      description: 'Export findings',
      icon: FileText,
      href: '/reports',
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20',
    },
  ];

  const systemStatus = [
    { service: 'API Services', status: 'Operational', color: 'bg-emerald-400', textColor: 'text-emerald-400' },
    { service: 'Data Processing', status: 'Online', color: 'bg-emerald-400', textColor: 'text-emerald-400' },
    { service: 'AI Models', status: 'Updating', color: 'bg-yellow-400', textColor: 'text-yellow-400' },
    { service: 'Storage', status: '78% Used', color: 'bg-emerald-400', textColor: 'text-emerald-400' },
  ];

  const breadcrumbs = [
    { label: 'Dashboard' },
    { label: 'Overview' },
  ];

  if (isLoading) {
    return (
      <Layout breadcrumbs={breadcrumbs}>
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gradient-to-r from-slate-800/50 to-slate-700/50 animate-pulse rounded-xl border border-slate-700/50" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-8 relative">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Enhanced Welcome Section */}
        <div className="relative bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 overflow-hidden group hover:border-slate-600/50 transition-all duration-300">
          {/* Ocean Wave Animation */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
              <path d="M0 100 Q100 80, 200 100 T400 100 V200 H0 Z" fill="url(#waveGrad1)">
                <animate attributeName="d" values="M0 100 Q100 80, 200 100 T400 100 V200 H0 Z;M0 100 Q100 120, 200 100 T400 100 V200 H0 Z;M0 100 Q100 80, 200 100 T400 100 V200 H0 Z" dur="6s" repeatCount="indefinite"/>
              </path>
              <path d="M0 120 Q150 100, 300 120 T400 120 V200 H0 Z" fill="url(#waveGrad2)" opacity="0.7">
                <animate attributeName="d" values="M0 120 Q150 100, 300 120 T400 120 V200 H0 Z;M0 120 Q150 140, 300 120 T400 120 V200 H0 Z;M0 120 Q150 100, 300 120 T400 120 V200 H0 Z" dur="8s" repeatCount="indefinite"/>
              </path>
              <defs>
                <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <Waves className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Welcome back!</h2>
                <p className="text-slate-400">Your latest marine research data awaits analysis.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Link href="/ai-tools">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid="button-start-analysis">
                  <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Start New Analysis
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" className="border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300" data-testid="button-view-reports">
                  <FileText className="w-4 h-4 mr-2" />
                  View Recent Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className={`metric-card cursor-pointer bg-gradient-to-br ${metric.bgGradient} backdrop-blur-sm border ${metric.borderColor} hover:border-opacity-60 transition-all duration-300 hover:scale-105 hover:shadow-xl group relative overflow-hidden`} data-testid={`metric-${metric.title.toLowerCase().replace(' ', '-')}`}>
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${metric.bgGradient} rounded-xl flex items-center justify-center border ${metric.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${metric.color} group-hover:animate-pulse`} />
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 transition-colors duration-300">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {metric.change}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">{metric.title}</h3>
                  <p className="text-4xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300" data-testid={`value-${metric.title.toLowerCase().replace(' ', '-')}`}>
                    {metric.value}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Recent Data Uploads */}
          <div className="lg:col-span-2">
            <Card className="data-table bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Recent Data Uploads</CardTitle>
                  <Link href="/explorer" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300 flex items-center gap-1">
                    View all
                    <TrendingUp className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-800/50 to-slate-700/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-slate-400">Dataset</th>
                        <th className="text-left p-4 text-sm font-medium text-slate-400">Type</th>
                        <th className="text-left p-4 text-sm font-medium text-slate-400">Location</th>
                        <th className="text-left p-4 text-sm font-medium text-slate-400">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recentUploads?.map((upload, index) => (
                        <tr key={upload.id} className="border-b border-slate-700/30 hover:bg-gradient-to-r hover:from-slate-800/30 hover:to-slate-700/30 transition-all duration-300 group" data-testid={`upload-row-${upload.id}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                <Database className="w-5 h-5 text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium text-white group-hover:text-blue-400 transition-colors duration-300" data-testid={`upload-name-${upload.id}`}>{upload.name}</p>
                                <p className="text-sm text-slate-500">2.4 GB</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 transition-colors duration-300" data-testid={`upload-type-${upload.id}`}>
                              {upload.type}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-slate-300" data-testid={`upload-location-${upload.id}`}>{upload.location}</td>
                          <td className="p-4 text-sm text-slate-400">
                            {format(new Date(upload.date), 'MMM dd, HH:mm')}
                          </td>
                          <td className="p-4">
                            <Badge 
                              className={upload.status === 'processed' 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              }
                              data-testid={`upload-status-${upload.id}`}
                            >
                              {upload.status}
                            </Badge>
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">
                            No recent uploads
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Actions & System Status */}
          <div className="space-y-6">
            {/* Enhanced Quick Actions */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.title} href={action.href}>
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 h-auto p-4 hover:bg-gradient-to-r ${action.bgGradient} border ${action.borderColor} hover:border-opacity-60 transition-all duration-300 group hover:scale-105`}
                        data-testid={`button-${action.title.toLowerCase().replace(' ', '-')}`}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${action.bgGradient} rounded-xl flex items-center justify-center border ${action.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-5 h-5 ${action.color} group-hover:animate-pulse`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">{action.title}</p>
                          <p className="text-sm text-slate-400">{action.description}</p>
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            {/* Enhanced System Status */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {systemStatus.map((status, index) => (
                  <div key={status.service} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${status.color} rounded-full animate-pulse shadow-lg`} style={{boxShadow: `0 0 10px ${status.color.replace('bg-', '').replace('-400', '')}`}}></div>
                      <span className="text-sm text-white group-hover:text-blue-400 transition-colors duration-300">{status.service}</span>
                    </div>
                    <span className={`text-sm font-medium ${status.textColor}`}>
                      {status.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
