import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { useState } from 'react';
import { 
  Home, 
  Upload, 
  Search, 
  BarChart3, 
  Brain, 
  TreePine, 
  FileText, 
  Shield, 
  User, 
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'researcher'] },
  { path: '/upload', label: 'Upload Data', icon: Upload, roles: ['admin', 'researcher'] },
  { path: '/explorer', label: 'Data Explorer', icon: Search, roles: ['admin', 'researcher', 'policy_user', 'guest'] },
  { path: '/visualize', label: 'Visualizations', icon: BarChart3, roles: ['admin', 'researcher', 'policy_user'] },
  { path: '/ai-tools', label: 'AI Tools', icon: Brain, roles: ['admin', 'researcher'] },
  { path: '/taxonomy', label: 'Taxonomy', icon: TreePine, roles: ['admin', 'researcher', 'policy_user'] },
  { path: '/reports', label: 'Reports', icon: FileText, roles: ['admin', 'researcher', 'policy_user'] },
  { path: '/admin', label: 'Admin', icon: Shield, roles: ['admin'] },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [adminExpanded, setAdminExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);

  const visibleItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside 
      className={cn(
        "w-80 bg-card/80 backdrop-blur-xl border-r border-border/50 flex-shrink-0 transition-all duration-300 ease-in-out lg:translate-x-0 shadow-xl",
        collapsed && "sidebar-collapsed"
      )}
      data-testid="sidebar"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="hover-lift">
            <Logo size="md" showText={true} />
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium" data-testid="user-name">{user.name}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground capitalize" data-testid="user-role">
                    {user.role.replace('_', ' ')}
                  </span>
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" data-testid="nav-menu">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            const isAdmin = item.path === '/admin';
            const isReports = item.path === '/reports';
            
            return (
              <div key={item.path}>
                {isAdmin ? (
                  <button
                    onClick={() => setAdminExpanded(!adminExpanded)}
                    className={cn(
                      "nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden w-full text-left",
                      isActive 
                        ? "active text-white bg-gradient-to-r from-purple-500/90 to-pink-500/90 shadow-lg shadow-purple-500/25 scale-[1.02]" 
                        : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 backdrop-blur-sm border border-transparent hover:border-purple-400/30"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    
                    <div className="relative z-10 flex items-center gap-3 flex-1">
                      <div className={cn(
                        "p-1.5 rounded-lg transition-all duration-300",
                        isActive ? "bg-white/20" : "group-hover:bg-white/10"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    
                    {/* Expand/Collapse indicator */}
                    <div className="relative z-10">
                      {adminExpanded ? (
                        <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                      ) : (
                        <ChevronRight className="w-4 h-4 transition-transform duration-300" />
                      )}
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                ) : (
                  <Link 
                    href={item.path}
                    className={cn(
                      "nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                      isActive 
                        ? "active text-white bg-gradient-to-r from-blue-500/90 to-teal-500/90 shadow-lg shadow-blue-500/25 scale-[1.02]" 
                        : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-teal-500/20 backdrop-blur-sm border border-transparent hover:border-blue-400/30"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    
                    <div className="relative z-10 flex items-center gap-3">
                      <div className={cn(
                        "p-1.5 rounded-lg transition-all duration-300",
                        isActive ? "bg-white/20" : "group-hover:bg-white/10"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </Link>
                )}
                
                {/* Admin Sub-menu */}
                {isAdmin && user?.role === 'admin' && adminExpanded && (
                  <div className="ml-6 mt-2 space-y-2 border-l-2 border-gradient-to-b from-purple-400/50 to-pink-400/50 pl-4 pb-2">
                    <Link 
                      href="/profile" 
                      className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300 group border border-transparent hover:border-emerald-400/30"
                      data-testid="nav-profile"
                    >
                      <div className="p-1.5 rounded-md group-hover:bg-emerald-500/20 transition-all duration-300">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span>Settings</span>
                    </Link>
                    <button 
                      onClick={logout}
                      className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-rose-500/20 w-full text-left transition-all duration-300 group border border-transparent hover:border-red-400/30"
                      data-testid="button-logout"
                    >
                      <div className="p-1.5 rounded-md group-hover:bg-red-500/20 transition-all duration-300">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Standalone Logout Button for Researchers, Policy Users, and Guests */}
          {(user?.role === 'researcher' || user?.role === 'policy_user' || user?.role === 'guest') && (
            <div className="px-1 mt-2">
              <button 
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
                className="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden w-full text-left text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-rose-500/20 backdrop-blur-sm border border-transparent hover:border-red-400/30"
                data-testid="button-logout"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-1.5 rounded-lg group-hover:bg-red-500/20 transition-all duration-300">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Logout</span>
                </div>
              </button>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
