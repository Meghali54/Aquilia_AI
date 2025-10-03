import { Bell, Menu, Moon, Sun, ChevronRight, Waves } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSidebarToggle: () => void;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ onSidebarToggle, breadcrumbs = [] }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-slate-900/95 via-blue-900/20 to-slate-900/95 backdrop-blur-xl border-b border-blue-500/20 px-6 py-4 flex items-center justify-between shadow-lg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-24 h-1 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent animate-pulse delay-1000"></div>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="lg:hidden hover:bg-white/10 transition-all duration-300"
          data-testid="button-sidebar-toggle"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-slate-300" />
        </Button>
        
        {/* Enhanced Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1" data-testid="breadcrumbs">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-blue-400/60" />
                )}
                {crumb.href ? (
                  <a 
                    href={crumb.href} 
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-blue-400/30"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-teal-500/20 backdrop-blur-sm border border-blue-400/30 shadow-lg">
                    <Waves className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-semibold text-sm bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                      {crumb.label}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3 relative z-10">
        {/* Dark Theme Indicator */}
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden group hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 border border-transparent hover:border-blue-400/30 rounded-xl cursor-default"
          data-testid="button-theme-indicator"
          aria-label="Dark theme active"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          <Moon className="w-5 h-5 text-blue-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </Button>

        {/* Enhanced Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden group hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 border border-transparent hover:border-purple-400/30 rounded-xl"
          data-testid="button-notifications"
          aria-label="Notifications"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          <Bell className="w-5 h-5 text-slate-300 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></span>
        </Button>
      </div>
    </header>
  );
}
