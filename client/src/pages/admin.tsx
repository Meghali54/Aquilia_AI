import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Database, 
  Activity, 
  Shield, 
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  UserPlus,
  Settings,
  Share2,
  Eye,
  TrendingUp,
  Microscope,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date | null;
  createdAt: Date;
}

interface Dataset {
  id: string;
  name: string;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  size: string;
  uploadedAt: Date;
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  ip: string;
}

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [datasetFilter, setDatasetFilter] = useState('pending');
  const { toast } = useToast();

  // Mock data
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      email: 'res@oceanus',
      role: 'researcher',
      status: 'active',
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Policy Analyst',
      email: 'policy@oceanus',
      role: 'policy_user',
      status: 'active',
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Guest User',
      email: 'guest@oceanus',
      role: 'guest',
      status: 'inactive',
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      name: 'Dr. John Marine',
      email: 'john@marine.org',
      role: 'researcher',
      status: 'pending',
      lastLogin: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [datasets] = useState<Dataset[]>([
    {
      id: '1',
      name: 'Deep Sea Coral Survey',
      uploadedBy: 'Dr. Marine Research',
      status: 'pending',
      size: '3.2 GB',
      uploadedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Arctic Plankton Distribution',
      uploadedBy: 'Research Institute',
      status: 'pending',
      size: '1.8 GB',
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Coastal Water Quality',
      uploadedBy: 'Environmental Agency',
      status: 'approved',
      size: '850 MB',
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      user: 'Dr. Sarah Chen',
      action: 'Dataset Upload',
      target: 'Pacific Kelp Survey 2024',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      ip: '192.168.1.100',
    },
    {
      id: '2',
      user: 'Admin User',
      action: 'User Role Change',
      target: 'policy@oceanus',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ip: '192.168.1.50',
    },
    {
      id: '3',
      user: 'Policy Analyst',
      action: 'Report Generation',
      target: 'Monthly Biodiversity Summary',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      ip: '192.168.1.120',
    },
    {
      id: '4',
      user: 'Dr. Sarah Chen',
      action: 'AI Analysis',
      target: 'Species Identification',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      ip: '192.168.1.100',
    },
  ]);

  const handleApproveDataset = (datasetId: string) => {
    toast({
      title: "Dataset approved",
      description: "The dataset has been approved and is now available.",
    });
  };

  const handleRejectDataset = (datasetId: string) => {
    toast({
      title: "Dataset rejected",
      description: "The dataset has been rejected and removed from the queue.",
      variant: "destructive",
    });
  };

  const handleUserStatusChange = (userId: string, newStatus: string) => {
    toast({
      title: "User status updated",
      description: `User status has been changed to ${newStatus}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'inactive':
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-400';
      case 'researcher':
        return 'bg-blue-500/20 text-blue-400';
      case 'policy_user':
        return 'bg-orange-500/20 text-orange-400';
      case 'guest':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = userFilter === 'all' || user.status === userFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = datasetFilter === 'all' || dataset.status === datasetFilter;
    return matchesSearch && matchesFilter;
  });

  const systemStats = [
    { label: 'Total Users', value: users.length, icon: Users, change: '+3 this week' },
    { label: 'Pending Approvals', value: datasets.filter(d => d.status === 'pending').length, icon: Clock, change: '2 new today' },
    { label: 'Active Datasets', value: datasets.filter(d => d.status === 'approved').length, icon: Database, change: '+5 this month' },
    { label: 'System Health', value: '99.9%', icon: Activity, change: 'All systems operational' },
  ];

  const breadcrumbs = [
    { label: 'Administration' },
  ];

  // Custom CSS for enhanced scrollbar and animations
  const customStyles = `
    .floating-animation {
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    .pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes pulse-glow {
      from { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
      to { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
    }
  `;

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <style>{customStyles}</style>
      
      {/* Full Screen Advanced Layout */}
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl floating-animation" />
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-3xl floating-animation" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl floating-animation" style={{animationDelay: '4s'}} />
        </div>
        
        {/* Hero Header */}
        <div className="relative z-10 px-8 pt-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-2xl backdrop-blur-xl border border-white/10 pulse-glow">
                  <Shield className="w-12 h-12 text-blue-400" />
                </div>
                <div className="text-left">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    System Administration
                  </h1>
                  <p className="text-xl text-slate-300">Advanced User & Dataset Management System</p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 rounded-2xl px-6 py-3" data-testid="button-add-user">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add User
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-6 py-3">
                  <Share2 className="w-5 h-5 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-6 py-3">
                  <Eye className="w-5 h-5 mr-2" />
                  System Monitor
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {systemStats.map((stat) => {
                const Icon = stat.icon;
                const colorMap: Record<string, string> = {
                  'Total Users': 'from-blue-500/20 to-blue-600/20 text-blue-400',
                  'Pending Approvals': 'from-yellow-500/20 to-yellow-600/20 text-yellow-400',
                  'Active Datasets': 'from-teal-500/20 to-teal-600/20 text-teal-400',
                  'System Health': 'from-green-500/20 to-green-600/20 text-green-400'
                };
                return (
                  <Card key={stat.label} className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10 transition-all duration-300" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${colorMap[stat.label]?.split(' text-')[0] || 'from-blue-500/20 to-blue-600/20'} rounded-xl mb-4`}>
                        <Icon className={`w-6 h-6 ${colorMap[stat.label]?.split(' ')[1] || 'text-blue-400'}`} />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                      <div className="text-xs text-blue-400 mt-1">{stat.change}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="users" className="w-full" data-testid="tabs-admin">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-2xl border-white/10 rounded-2xl p-2">
                <TabsTrigger value="users" data-testid="tab-users" className="text-white data-[state=active]:bg-blue-500/30 data-[state=active]:text-white rounded-xl">
                  <Users className="w-4 h-4 mr-2" />
                  User Management
                </TabsTrigger>
                <TabsTrigger value="datasets" data-testid="tab-datasets" className="text-white data-[state=active]:bg-teal-500/30 data-[state=active]:text-white rounded-xl">
                  <Database className="w-4 h-4 mr-2" />
                  Dataset Approvals
                </TabsTrigger>
                <TabsTrigger value="logs" data-testid="tab-logs" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white rounded-xl">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity Logs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl text-white flex items-center gap-3">
                        <Users className="w-6 h-6 text-blue-400" />
                        User Management
                      </CardTitle>
                      <div className="flex gap-4">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                          <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 w-64 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                            data-testid="input-search-users"
                          />
                    </div>
                        <Select value={userFilter} onValueChange={setUserFilter}>
                          <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-all duration-200 rounded-xl" data-testid="select-user-filter">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-xl">
                            <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10">All Status</SelectItem>
                            <SelectItem value="active" className="text-green-400 hover:bg-green-500/20 focus:bg-green-500/20">Active</SelectItem>
                            <SelectItem value="inactive" className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20">Inactive</SelectItem>
                            <SelectItem value="pending" className="text-yellow-400 hover:bg-yellow-500/20 focus:bg-yellow-500/20">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Login</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition-colors" data-testid={`user-row-${user.id}`}>
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-white" data-testid={`user-name-${user.id}`}>{user.name}</p>
                                <p className="text-sm text-slate-400">{user.email}</p>
                              </div>
                            </td>
                          <td className="p-4">
                            <Badge className={getRoleColor(user.role)} data-testid={`user-role-${user.id}`}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(user.status)} data-testid={`user-status-${user.id}`}>
                              {user.status}
                            </Badge>
                          </td>
                            <td className="p-4 text-sm text-slate-400">
                              {user.lastLogin ? format(user.lastLogin, 'MMM dd, HH:mm') : 'Never'}
                            </td>
                          <td className="p-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                                data-testid={`button-user-actions-${user.id}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datasets" className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Database className="w-6 h-6 text-teal-400" />
                    Dataset Approvals
                  </CardTitle>
                  <Select value={datasetFilter} onValueChange={setDatasetFilter}>
                    <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-all duration-200 rounded-xl" data-testid="select-dataset-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-xl">
                      <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10">All Status</SelectItem>
                      <SelectItem value="pending" className="text-yellow-400 hover:bg-yellow-500/20 focus:bg-yellow-500/20">Pending</SelectItem>
                      <SelectItem value="approved" className="text-green-400 hover:bg-green-500/20 focus:bg-green-500/20">Approved</SelectItem>
                      <SelectItem value="rejected" className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredDatasets.map((dataset) => (
                    <div 
                      key={dataset.id} 
                      className="p-6 border border-white/20 bg-white/5 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
                      data-testid={`dataset-${dataset.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2" data-testid={`dataset-name-${dataset.id}`}>
                            {dataset.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                            <span>Uploaded by: {dataset.uploadedBy}</span>
                            <span>Size: {dataset.size}</span>
                            <span>{format(dataset.uploadedAt, 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                          <Badge className={getStatusColor(dataset.status)} data-testid={`dataset-status-${dataset.id}`}>
                            {dataset.status}
                          </Badge>
                        </div>
                        
                            {dataset.status === 'pending' && (
                              <div className="flex gap-3">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                                  onClick={() => handleApproveDataset(dataset.id)}
                                  data-testid={`button-approve-${dataset.id}`}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                                  onClick={() => handleRejectDataset(dataset.id)}
                                  data-testid={`button-reject-${dataset.id}`}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

              <TabsContent value="logs" className="space-y-4">
                <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl text-white flex items-center gap-3">
                      <Activity className="w-6 h-6 text-purple-400" />
                      Activity Logs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/5 backdrop-blur-xl">
                          <tr>
                            <th className="text-left p-4 text-sm font-medium text-slate-300">User</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-300">Action</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-300">Target</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-300">Timestamp</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-300">IP Address</th>
                          </tr>
                        </thead>
                    <tbody>
                      {activityLogs.map((log) => (
                          <tr key={log.id} className="border-b border-white/10 hover:bg-white/5 transition-colors" data-testid={`log-${log.id}`}>
                            <td className="p-4 font-medium text-white">{log.user}</td>
                            <td className="p-4 text-slate-300">{log.action}</td>
                            <td className="p-4 text-slate-400">{log.target}</td>
                            <td className="p-4 text-sm text-slate-400">
                              {format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                            </td>
                            <td className="p-4 text-sm font-mono text-slate-400">{log.ip}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
