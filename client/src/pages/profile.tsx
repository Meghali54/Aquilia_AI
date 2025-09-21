import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Settings, 
  Key, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw,
  Save,
  Mail,
  Phone
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    organization: '',
    bio: '',
    location: '',
    timezone: 'UTC',
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    datasetAlerts: true,
    analysisComplete: true,
    systemMaintenance: false,
    weeklyReports: false,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '1h',
    loginAlerts: true,
  });

  const [apiKey] = useState('oc_1234567890abcdef1234567890abcdef12345678');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved.",
    });
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const handleRegenerateApiKey = () => {
    toast({
      title: "API key regenerated",
      description: "A new API key has been generated. Update your applications accordingly.",
      variant: "destructive",
    });
  };

  const breadcrumbs = [
    { label: 'Profile Settings' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 p-6 space-y-8 max-w-6xl mx-auto">
          {/* Hero Header */}
          <div className="text-center space-y-6 py-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                <User className="w-12 h-12 text-blue-400" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-4">
                Profile Settings
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Manage your account, preferences, and security settings
              </p>
            </div>
          </div>

          {/* User Info Header */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{user?.name || 'Admin User'}</h2>
                <p className="text-slate-400 text-lg mb-3">{user?.email || 'admin@oceanus.com'}</p>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 capitalize px-4 py-2 text-sm">
                  {user?.role?.replace('_', ' ') || 'Admin'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <Card className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5 text-blue-400" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      data-testid="input-profile-name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20 rounded-xl mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      data-testid="input-profile-email"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20 rounded-xl mt-2"
                    />
                  </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    data-testid="input-profile-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={profile.organization}
                    onChange={(e) => setProfile(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="Marine Research Institute"
                    data-testid="input-profile-organization"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="San Francisco, CA"
                    data-testid="input-profile-location"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger 
                      id="timezone" 
                      data-testid="select-profile-timezone"
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 focus:border-blue-400/50 focus:ring-blue-400/20 rounded-xl mt-2 h-12"
                    >
                      <SelectValue className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl">
                      <SelectItem value="UTC" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        🌍 UTC (Coordinated Universal Time)
                      </SelectItem>
                      <SelectItem value="EST" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        🇺🇸 EST (Eastern Time)
                      </SelectItem>
                      <SelectItem value="PST" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        🇺🇸 PST (Pacific Time)
                      </SelectItem>
                      <SelectItem value="CET" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        🇪🇺 CET (Central European Time)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about your research interests and background..."
                  rows={3}
                  data-testid="textarea-profile-bio"
                />
              </div>

                <Button 
                  onClick={handleSaveProfile} 
                  data-testid="button-save-profile"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-6 py-2 transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
            </CardContent>
          </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Datasets Uploaded</span>
                  <span className="font-medium text-blue-400">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">AI Analyses Run</span>
                  <span className="font-medium text-teal-400">34</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Reports Generated</span>
                  <span className="font-medium text-purple-400">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Member Since</span>
                  <span className="font-medium text-slate-300">Jan 2024</span>
                </div>
              </CardContent>
            </Card>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Preferences */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Email Updates</Label>
                      <p className="text-sm text-slate-400">Receive email notifications for important updates</p>
                    </div>
                    <Switch
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailUpdates: checked }))}
                      data-testid="switch-email-updates"
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dataset Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new datasets are available</p>
                  </div>
                  <Switch
                    checked={notifications.datasetAlerts}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, datasetAlerts: checked }))}
                    data-testid="switch-dataset-alerts"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analysis Complete</Label>
                    <p className="text-sm text-muted-foreground">Notifications when AI analysis is complete</p>
                  </div>
                  <Switch
                    checked={notifications.analysisComplete}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, analysisComplete: checked }))}
                    data-testid="switch-analysis-complete"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Maintenance</Label>
                    <p className="text-sm text-muted-foreground">Alerts about scheduled maintenance</p>
                  </div>
                  <Switch
                    checked={notifications.systemMaintenance}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, systemMaintenance: checked }))}
                    data-testid="switch-system-maintenance"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly activity summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                    data-testid="switch-weekly-reports"
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} data-testid="button-save-notifications">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>

            {/* Security Settings */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-green-400" />
                  Security Settings
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }))}
                    data-testid="switch-two-factor"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginAlerts: checked }))}
                    data-testid="switch-login-alerts"
                  />
                </div>

                <div>
                  <Label htmlFor="session-timeout" className="text-slate-300">Session Timeout</Label>
                  <Select 
                    value={security.sessionTimeout} 
                    onValueChange={(value) => setSecurity(prev => ({ ...prev, sessionTimeout: value }))}
                  >
                    <SelectTrigger 
                      id="session-timeout" 
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 focus:border-green-400/50 focus:ring-green-400/20 rounded-xl mt-2 h-12" 
                      data-testid="select-session-timeout"
                    >
                      <SelectValue className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl">
                      <SelectItem value="30m" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        ⏱️ 30 minutes
                      </SelectItem>
                      <SelectItem value="1h" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        🕐 1 hour
                      </SelectItem>
                      <SelectItem value="2h" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        🕑 2 hours
                      </SelectItem>
                      <SelectItem value="4h" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        🕓 4 hours
                      </SelectItem>
                      <SelectItem value="8h" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                        🕗 8 hours
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveSecurity} data-testid="button-save-security">
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>

          {/* API Key Management */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Key className="w-5 h-5 text-purple-400" />
                API Key Management
              </CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Your API Key</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Use this key to authenticate API requests. Keep it secure and never share it publicly.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={showApiKey ? apiKey : '•'.repeat(apiKey.length)}
                    readOnly
                    className="font-mono pr-10"
                    data-testid="input-api-key"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowApiKey(!showApiKey)}
                    data-testid="button-toggle-api-key"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <Button variant="outline" onClick={handleCopyApiKey} data-testid="button-copy-api-key">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={handleRegenerateApiKey} data-testid="button-regenerate-api-key">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">API Usage</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">This Month</p>
                  <p className="font-medium">1,247 requests</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rate Limit</p>
                  <p className="font-medium">1,000/hour</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Used</p>
                  <p className="font-medium">2 hours ago</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </Layout>
  );
}
