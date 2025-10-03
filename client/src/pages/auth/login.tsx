import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/ui/logo';
import { loginSchema, type LoginData } from '@shared/schema';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      toast({
        title: "Login successful",
        description: "Welcome to Oceanus!",
      });
      
      // Redirect based on role
      const redirectPath = data.user.role === 'admin' ? '/admin' :
                          data.user.role === 'researcher' ? '/dashboard' :
                          data.user.role === 'policy_user' ? '/visualize' :
                          '/explorer';
      setLocation(redirectPath);
    },
    onError: (error: any) => {
      toast({
        title: "Login failed", 
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Ocean Wave Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="oceanWaves" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M0 60 Q30 30 60 60 T120 60" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                <path d="M0 80 Q30 50 60 80 T120 80" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2"/>
                <circle cx="20" cy="40" r="2" fill="currentColor" opacity="0.3"/>
                <circle cx="80" cy="100" r="1.5" fill="currentColor" opacity="0.2"/>
                <circle cx="100" cy="20" r="1" fill="currentColor" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#oceanWaves)" />
          </svg>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Features */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Logo and Main Heading */}
            <div className="space-y-6">
              <div className="inline-block">
                <Logo size="xl" showText={true} className="transform hover:scale-105 transition-transform duration-300" />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  Unlock the Secrets of{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent animate-pulse">
                    Marine Ecosystems
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Advanced AI-powered platform for oceanographic research, fisheries analysis, and molecular biodiversity insights.
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
              <div className="group flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 relative overflow-hidden">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                    <defs>
                      <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
                        <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.9"/>
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7"/>
                      </linearGradient>
                      <linearGradient id="dataGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="1"/>
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8"/>
                      </linearGradient>
                    </defs>
                    
                    {/* Ocean depth layers */}
                    <rect x="2" y="16" width="24" height="2" fill="url(#oceanGrad)" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;0.8;0.6" dur="3s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="2" y="19" width="24" height="2" fill="url(#oceanGrad)" opacity="0.4">
                      <animate attributeName="opacity" values="0.4;0.6;0.4" dur="2.5s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="2" y="22" width="24" height="2" fill="url(#oceanGrad)" opacity="0.3">
                      <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite"/>
                    </rect>
                    
                    {/* Temperature/salinity sensors */}
                    <circle cx="6" cy="12" r="1.5" fill="url(#dataGrad)">
                      <animate attributeName="r" values="1.5;2;1.5" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="14" cy="8" r="1.2" fill="url(#dataGrad)" opacity="0.8">
                      <animate attributeName="r" values="1.2;1.7;1.2" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="22" cy="10" r="1.8" fill="url(#dataGrad)" opacity="0.9">
                      <animate attributeName="r" values="1.8;2.3;1.8" dur="1.8s" repeatCount="indefinite"/>
                    </circle>
                    
                    {/* Data transmission lines */}
                    <path d="M6 12 Q10 6, 14 8 Q18 4, 22 10" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.7">
                      <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
                    </path>
                    
                    {/* Real-time data points */}
                    <circle cx="8" cy="6" r="0.6" fill="white" opacity="0.8">
                      <animateTransform attributeName="transform" type="translate" values="0,0;2,1;4,0;2,-1;0,0" dur="4s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="18" cy="14" r="0.8" fill="white" opacity="0.6">
                      <animateTransform attributeName="transform" type="translate" values="0,0;-1,2;0,4;1,2;0,0" dur="3.5s" repeatCount="indefinite"/>
                    </circle>
                    
                    {/* Measurement indicators */}
                    <rect x="4" y="4" width="2" height="1" fill="white" opacity="0.7">
                      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="20" y="6" width="2" height="1" fill="white" opacity="0.8">
                      <animate attributeName="opacity" values="0.8;1;0.8" dur="1.8s" repeatCount="indefinite"/>
                    </rect>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Real-time Analysis</h3>
                  <p className="text-xs text-muted-foreground">Oceanographic data</p>
                </div>
              </div>

              <div className="group flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 relative overflow-hidden">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                    <defs>
                      <linearGradient id="speciesGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
                        <stop offset="50%" stopColor="#f0fdfa" stopOpacity="0.9"/>
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8"/>
                      </linearGradient>
                      <radialGradient id="aiScanGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.2"/>
                      </radialGradient>
                    </defs>
                    
                    {/* Main fish being identified */}
                    <path d="M6 14 Q11 11, 16 14 Q18 16, 16 18 Q11 17, 6 14 Z" fill="url(#speciesGrad)">
                      <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite"/>
                    </path>
                    
                    {/* Fish tail */}
                    <path d="M16 14 L21 11 L21 17 Z" fill="url(#speciesGrad)" opacity="0.9"/>
                    
                    {/* Fish eye */}
                    <circle cx="10" cy="14" r="1" fill="#0891b2" opacity="0.9"/>
                    <circle cx="10" cy="14" r="0.5" fill="white"/>
                    
                    {/* AI scanning grid overlay */}
                    <g opacity="0.6">
                      <path d="M4 10 L24 10" stroke="#10b981" strokeWidth="0.5">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                      </path>
                      <path d="M4 14 L24 14" stroke="#10b981" strokeWidth="0.5">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite"/>
                      </path>
                      <path d="M4 18 L24 18" stroke="#10b981" strokeWidth="0.5">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite"/>
                      </path>
                    </g>
                    
                    {/* Species identification markers */}
                    <circle cx="8" cy="12" r="0.8" fill="none" stroke="#10b981" strokeWidth="1">
                      <animate attributeName="r" values="0.8;1.5;0.8" dur="3s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="18" cy="16" r="0.6" fill="none" stroke="#10b981" strokeWidth="1">
                      <animate attributeName="r" values="0.6;1.2;0.6" dur="2.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="1;0.4;1" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    
                    {/* AI classification indicators */}
                    <rect x="22" y="8" width="4" height="1" fill="#10b981" opacity="0.8">
                      <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="22" y="10" width="3" height="1" fill="#10b981" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="22" y="12" width="2" height="1" fill="#10b981" opacity="0.7">
                      <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                    </rect>
                    
                    {/* Scanning beam effect */}
                    <path d="M2 8 L26 20" stroke="url(#aiScanGlow)" strokeWidth="1" opacity="0.4">
                      <animateTransform attributeName="transform" type="translate" values="0,-10;0,0;0,10" dur="4s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite"/>
                    </path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI-Powered</h3>
                  <p className="text-xs text-muted-foreground">Species identification</p>
                </div>
              </div>

              <div className="group flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 relative overflow-hidden">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                    <defs>
                      <linearGradient id="biodiversityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
                        <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.8"/>
                      </linearGradient>
                      <radialGradient id="insightGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.3"/>
                      </radialGradient>
                    </defs>
                    
                    {/* Multiple species representing biodiversity */}
                    <g>
                      {/* Fish species 1 */}
                      <path d="M4 10 Q6 9, 8 10 Q6 11, 4 10" fill="url(#biodiversityGrad)" opacity="0.9">
                        <animateTransform attributeName="transform" type="translate" values="0,0;2,1;4,0;2,-1;0,0" dur="5s" repeatCount="indefinite"/>
                      </path>
                      
                      {/* Fish species 2 */}
                      <path d="M20 12 Q18 11, 16 12 Q18 13, 20 12" fill="url(#biodiversityGrad)" opacity="0.8">
                        <animateTransform attributeName="transform" type="translate" values="0,0;-1,2;-2,0;-1,-2;0,0" dur="6s" repeatCount="indefinite"/>
                      </path>
                      
                      {/* Coral/plant life */}
                      <path d="M8 20 Q9 18, 10 20 Q11 18, 12 20 V22 H8 Z" fill="url(#biodiversityGrad)">
                        <animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="3s" repeatCount="indefinite"/>
                      </path>
                      
                      {/* Seaweed/kelp */}
                      <path d="M2 22 Q3 18, 2 14 Q1 10, 2 6" stroke="url(#insightGlow)" strokeWidth="1.5" fill="none">
                        <animateTransform attributeName="transform" type="rotate" values="0 2 14;3 2 14;0 2 14;-3 2 14;0 2 14" dur="4s" repeatCount="indefinite"/>
                      </path>
                      <path d="M26 22 Q25 19, 26 16 Q27 13, 26 10" stroke="url(#insightGlow)" strokeWidth="1.5" fill="none">
                        <animateTransform attributeName="transform" type="rotate" values="0 26 16;-3 26 16;0 26 16;3 26 16;0 26 16" dur="3.5s" repeatCount="indefinite"/>
                      </path>
                    </g>
                    
                    {/* Data visualization nodes showing insights */}
                    <circle cx="14" cy="8" r="1.2" fill="url(#insightGlow)">
                      <animate attributeName="r" values="1.2;1.8;1.2" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="10" cy="14" r="0.8" fill="url(#insightGlow)" opacity="0.8">
                      <animate attributeName="r" values="0.8;1.3;0.8" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="18" cy="18" r="1" fill="url(#insightGlow)" opacity="0.9">
                      <animate attributeName="r" values="1;1.5;1" dur="1.8s" repeatCount="indefinite"/>
                    </circle>
                    
                    {/* Connection lines showing ecosystem relationships */}
                    <path d="M14 8 Q12 11, 10 14 Q14 16, 18 18" stroke="#34d399" strokeWidth="1" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
                    </path>
                    
                    {/* Biodiversity metrics */}
                    <g opacity="0.7">
                      <rect x="22" y="4" width="1" height="3" fill="#34d399">
                        <animate attributeName="height" values="3;5;3" dur="2s" repeatCount="indefinite"/>
                      </rect>
                      <rect x="24" y="6" width="1" height="2" fill="#34d399">
                        <animate attributeName="height" values="2;4;2" dur="2.5s" repeatCount="indefinite"/>
                      </rect>
                      <rect x="26" y="5" width="1" height="3" fill="#34d399">
                        <animate attributeName="height" values="3;6;3" dur="1.8s" repeatCount="indefinite"/>
                      </rect>
                    </g>
                    
                    {/* Floating insight particles */}
                    <circle cx="6" cy="6" r="0.4" fill="url(#insightGlow)">
                      <animateTransform attributeName="transform" type="translate" values="0,0;3,2;6,0;3,-2;0,0" dur="6s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="22" cy="22" r="0.5" fill="url(#insightGlow)">
                      <animateTransform attributeName="transform" type="translate" values="0,0;-2,1;-4,0;-2,-1;0,0" dur="5s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Comprehensive</h3>
                  <p className="text-xs text-muted-foreground">Biodiversity insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300">
                <CardHeader className="space-y-2 pb-4">
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Welcome back
                    </h2>
                    <p className="text-sm text-muted-foreground">Sign in to your Oceanus account</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                data-testid="input-email"
                                className="h-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your password"
                                data-testid="input-password"
                                className="h-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0 py-1">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-remember-me"
                                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              Remember me
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full h-10 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                        disabled={loginMutation.isPending}
                        data-testid="button-login"
                      >
                        {loginMutation.isPending ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Signing In...</span>
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Demo Credentials */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-slate-200/50 dark:border-slate-600/50">
                    <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">Demo Credentials:</p>
                    <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between items-center p-1.5 bg-white/50 dark:bg-slate-700/50 rounded">
                        <span className="font-medium">Admin:</span>
                        <span className="text-blue-600 dark:text-blue-400">admin@oceanus.com</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-white/50 dark:bg-slate-700/50 rounded">
                        <span className="font-medium">Researcher:</span>
                        <span className="text-cyan-600 dark:text-cyan-400">researcher@oceanus.com</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-white/50 dark:bg-slate-700/50 rounded">
                        <span className="font-medium">Policy User:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">policy@oceanus.com</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-white/50 dark:bg-slate-700/50 rounded">
                        <span className="font-medium">Guest:</span>
                        <span className="text-purple-600 dark:text-purple-400">guest@oceanus.com</span>
                      </div>
                      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                        Password: <span className="font-mono">password</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
