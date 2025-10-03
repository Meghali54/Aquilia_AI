import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { pdfGenerator, type ReportData } from '@/lib/simple-pdf-generator';
import { 
  FileText, 
  Download, 
  BarChart3, 
  Calendar, 
  FileSpreadsheet, 
  Settings,
  Share2,
  Eye,
  Microscope,
  TrendingUp,
  Database,
  Filter
} from 'lucide-react';

interface ReportConfig {
  type: string;
  title: string;
  description: string;
  datasets: string[];
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  includeRawData: boolean;
  includeAnalysis: boolean;
  format: 'pdf' | 'csv' | 'excel';
}

export default function Reports() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: '',
    title: '',
    description: '',
    datasets: [],
    dateRange: {
      start: '',
      end: '',
    },
    includeCharts: true,
    includeRawData: false,
    includeAnalysis: true,
    format: 'pdf',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [recentReports, setRecentReports] = useState<Array<{
    id: string;
    title: string;
    type: string;
    generatedAt: Date;
    status: string;
    format: string;
    size: string;
    pdfBlob?: Blob;
  }>>([
    {
      id: '1',
      title: 'Pacific Kelp Survey Analysis',
      type: 'Species Analysis',
      generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      format: 'pdf',
      size: '2.4 MB',
    },
    {
      id: '2',
      title: 'Monthly Biodiversity Summary',
      type: 'Biodiversity Report',
      generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      format: 'excel',
      size: '1.8 MB',
    },
    {
      id: '3',
      title: 'Temperature Trends Q3 2024',
      type: 'Environmental Report',
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      format: 'pdf',
      size: '3.1 MB',
    },
  ]);

  const { toast } = useToast();

  const reportTypes = [
    {
      id: 'species-analysis',
      name: 'Species Analysis',
      description: 'Comprehensive analysis of species distribution and abundance',
      icon: BarChart3,
    },
    {
      id: 'biodiversity',
      name: 'Biodiversity Report',
      description: 'Assessment of biodiversity indices and ecosystem health',
      icon: FileText,
    },
    {
      id: 'environmental',
      name: 'Environmental Report',
      description: 'Environmental conditions and oceanographic parameters',
      icon: Settings,
    },
    {
      id: 'custom',
      name: 'Custom Report',
      description: 'Build a custom report with selected datasets and parameters',
      icon: FileSpreadsheet,
    },
  ];

  const availableDatasets = [
    'Pacific Kelp Survey 2024',
    'Coral Reef eDNA Samples',
    'Salmon Migration Data',
    'Temperature Monitoring Network',
    'Plankton Distribution Study',
  ];

  const handleGenerateReport = async () => {
    if (!reportConfig.type || !reportConfig.title) {
      toast({
        title: "Missing required fields",
        description: "Please select a report type and enter a title.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Show progress steps
      const progressSteps = [
        { step: 'Collecting ocean data...', progress: 20 },
        { step: 'Processing datasets...', progress: 40 },
        { step: 'Generating analysis...', progress: 60 },
        { step: 'Creating PDF report...', progress: 80 },
        { step: 'Finalizing document...', progress: 100 },
      ];

      for (const { step, progress } of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(progress);
        
        if (progress < 100) {
          toast({
            title: step,
            description: `Report generation ${progress}% complete`,
          });
        }
      }

      // Generate actual PDF
      const reportData: ReportData = {
        title: reportConfig.title,
        type: reportTypes.find(t => t.id === reportConfig.type)?.name || 'Custom Report',
        description: reportConfig.description,
        dateRange: reportConfig.dateRange.start && reportConfig.dateRange.end ? reportConfig.dateRange : undefined,
        datasets: reportConfig.datasets,
        includeCharts: reportConfig.includeCharts,
        includeRawData: reportConfig.includeRawData,
        includeAnalysis: reportConfig.includeAnalysis,
      };

      // Create filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${reportConfig.title.replace(/\s+/g, '_')}_${timestamp}.pdf`;
      
      // Generate and download report (will open print dialog for PDF)
      const pdfBlob = await pdfGenerator.printToPDF(reportData, filename);

      // Add new report to recent reports with actual size
      const fileSizeKB = Math.round(pdfBlob.size / 1024);
      const fileSizeMB = fileSizeKB > 1024 ? `${(fileSizeKB / 1024).toFixed(1)} MB` : `${fileSizeKB} KB`;
      
      const newReport = {
        id: Date.now().toString(),
        title: reportConfig.title,
        type: reportTypes.find(t => t.id === reportConfig.type)?.name || 'Custom Report',
        generatedAt: new Date(),
        status: 'completed',
        format: reportConfig.format,
        size: fileSizeMB,
        pdfBlob: pdfBlob, // Store the blob for re-download
      };

      setRecentReports(prev => [newReport, ...prev]);

      toast({
        title: "Report generated successfully",
        description: `PDF report "${filename}" has been downloaded to your device.`,
      });

    } catch (error) {
      console.error('Report generation failed:', error);
      toast({
        title: "Report generation failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const report = recentReports.find(r => r.id === reportId);
      if (!report) return;

      // If we have the stored blob, use it
      if ((report as any).pdfBlob) {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${report.title.replace(/\s+/g, '_')}_${timestamp}.pdf`;
        pdfGenerator.downloadPDF((report as any).pdfBlob, filename);
        
        toast({
          title: "Download started",
          description: `Re-downloading "${report.title}" report.`,
        });
        return;
      }

      // Otherwise regenerate the report
      const reportData: ReportData = {
        title: report.title,
        type: report.type,
        description: `Re-generated report: ${report.title}`,
        datasets: availableDatasets.slice(0, 3), // Default datasets
        includeCharts: true,
        includeRawData: true,
        includeAnalysis: true,
      };

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${report.title.replace(/\s+/g, '_')}_${timestamp}.pdf`;
      
      await pdfGenerator.printToPDF(reportData, filename);

      toast({
        title: "Download started",
        description: `Downloading "${report.title}" PDF report.`,
      });

    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'generating':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const breadcrumbs = [
    { label: 'Reports' },
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
                  <FileText className="w-12 h-12 text-blue-400" />
                </div>
                <div className="text-left">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    Marine Reports
                  </h1>
                  <p className="text-xl text-slate-300">Advanced Research Data Generation System</p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 rounded-2xl px-6 py-3">
                  <Download className="w-5 h-5 mr-2" />
                  Export Reports
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-6 py-3">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Collection
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-6 py-3">
                  <Eye className="w-5 h-5 mr-2" />
                  Preview Mode
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl mb-4">
                    <Database className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">247</div>
                  <div className="text-sm text-slate-400">Generated Reports</div>
                  <div className="text-xs text-green-400 mt-1">+23 this month</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-xl mb-4">
                    <BarChart3 className="w-6 h-6 text-teal-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">89</div>
                  <div className="text-sm text-slate-400">Active Datasets</div>
                  <div className="text-xs text-blue-400 mt-1">Across 12 studies</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">156</div>
                  <div className="text-sm text-slate-400">Analysis Models</div>
                  <div className="text-xs text-purple-400 mt-1">Machine learning</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl mb-4">
                    <Microscope className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">1,847</div>
                  <div className="text-sm text-slate-400">Research Papers</div>
                  <div className="text-xs text-green-400 mt-1">Citations included</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Report Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* Report Type Selection */}
                <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl text-white flex items-center gap-3">
                      <Filter className="w-6 h-6 text-blue-400" />
                      Select Report Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div
                            key={type.id}
                            className={`p-6 border rounded-2xl cursor-pointer transition-all duration-300 ${
                              reportConfig.type === type.id
                                ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/25'
                                : 'border-white/20 bg-white/5 hover:border-blue-400/50 hover:bg-white/10'
                            }`}
                            onClick={() => setReportConfig(prev => ({ ...prev, type: type.id }))}
                            data-testid={`report-type-${type.id}`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl ${
                                reportConfig.type === type.id 
                                  ? 'bg-blue-500/30' 
                                  : 'bg-white/10'
                              }`}>
                                <Icon className={`w-6 h-6 ${
                                  reportConfig.type === type.id 
                                    ? 'text-blue-300' 
                                    : 'text-slate-400'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-white mb-2">{type.name}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{type.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Report Configuration */}
                {reportConfig.type && (
                  <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl text-white flex items-center gap-3">
                        <Settings className="w-6 h-6 text-teal-400" />
                        Report Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="report-title">Report Title</Label>
                      <Input
                        id="report-title"
                        value={reportConfig.title}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter report title"
                        data-testid="input-report-title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="report-format" className="text-slate-300">Output Format</Label>
                      <Select
                        value={reportConfig.format}
                        onValueChange={(value: 'pdf' | 'csv' | 'excel') => 
                          setReportConfig(prev => ({ ...prev, format: value }))
                        }
                      >
                        <SelectTrigger 
                          id="report-format" 
                          data-testid="select-report-format"
                          className="bg-white/5 border-white/10 text-white hover:bg-white/10 focus:border-blue-400/50 focus:ring-blue-400/20 rounded-xl mt-2 h-12"
                        >
                          <SelectValue className="text-white" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl">
                          <SelectItem value="pdf" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                            📄 PDF Report
                          </SelectItem>
                          <SelectItem value="excel" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                            📊 Excel Workbook
                          </SelectItem>
                          <SelectItem value="csv" className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg">
                            📋 CSV Data
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="report-description">Description (Optional)</Label>
                    <Textarea
                      id="report-description"
                      value={reportConfig.description}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the report purpose..."
                      rows={3}
                      data-testid="textarea-report-description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date-start">Start Date</Label>
                      <Input
                        id="date-start"
                        type="date"
                        value={reportConfig.dateRange.start}
                        onChange={(e) => setReportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                        data-testid="input-date-start"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-end">End Date</Label>
                      <Input
                        id="date-end"
                        type="date"
                        value={reportConfig.dateRange.end}
                        onChange={(e) => setReportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                        data-testid="input-date-end"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Datasets to Include</Label>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                      {availableDatasets.map((dataset) => (
                        <div key={dataset} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <Checkbox
                            id={`dataset-${dataset}`}
                            checked={reportConfig.datasets.includes(dataset)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setReportConfig(prev => ({
                                  ...prev,
                                  datasets: [...prev.datasets, dataset]
                                }));
                              } else {
                                setReportConfig(prev => ({
                                  ...prev,
                                  datasets: prev.datasets.filter(d => d !== dataset)
                                }));
                              }
                            }}
                            data-testid={`checkbox-dataset-${dataset.replace(/\s+/g, '-').toLowerCase()}`}
                            className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                          />
                          <Label htmlFor={`dataset-${dataset}`} className="text-sm text-slate-300 cursor-pointer">
                            {dataset}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Report Content</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-charts"
                          checked={reportConfig.includeCharts}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeCharts: !!checked }))
                          }
                          data-testid="checkbox-include-charts"
                        />
                        <Label htmlFor="include-charts">Include Charts and Visualizations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-analysis"
                          checked={reportConfig.includeAnalysis}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeAnalysis: !!checked }))
                          }
                          data-testid="checkbox-include-analysis"
                        />
                        <Label htmlFor="include-analysis">Include Statistical Analysis</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-raw-data"
                          checked={reportConfig.includeRawData}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeRawData: !!checked }))
                          }
                          data-testid="checkbox-include-raw-data"
                        />
                        <Label htmlFor="include-raw-data">Include Raw Data Tables</Label>
                      </div>
                    </div>
                  </div>

                  {isGenerating && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Generating report...</span>
                          <span className="text-sm text-muted-foreground">{generationProgress}%</span>
                        </div>
                        <Progress value={generationProgress} className="w-full" data-testid="progress-report-generation" />
                      </CardContent>
                    </Card>
                  )}

                  <Button 
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="w-full"
                    data-testid="button-generate-report"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating Report...' : 'Generate Report'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Reports */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div 
                    key={report.id} 
                    className="p-4 border border-border rounded-lg"
                    data-testid={`recent-report-${report.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1" data-testid={`report-title-${report.id}`}>
                          {report.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{report.type}</p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.generatedAt.toLocaleDateString()}
                      </span>
                      <span>{report.size}</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleDownloadReport(report.id)}
                      data-testid={`button-download-${report.id}`}
                    >
                      <Download className="w-3 h-3 mr-2" />
                      Download {report.format.toUpperCase()}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
