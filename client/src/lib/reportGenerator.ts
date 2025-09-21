import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ReportData {
  title: string;
  type: string;
  generatedAt: Date;
  datasets: string[];
  includeCharts: boolean;
  includeRawData: boolean;
  includeAnalysis: boolean;
}

export interface SpeciesData {
  species: string;
  count: number;
  location: string;
  depth: number;
  temperature: number;
}

export interface EnvironmentalData {
  date: string;
  temperature: number;
  salinity: number;
  ph: number;
  oxygen: number;
  location: string;
}

// Generate mock data for different report types
export const generateMockData = (reportType: string, datasetCount: number = 100) => {
  switch (reportType) {
    case 'species-analysis':
      return generateSpeciesData(datasetCount);
    case 'biodiversity':
      return generateBiodiversityData(datasetCount);
    case 'environmental':
      return generateEnvironmentalData(datasetCount);
    default:
      return generateEnvironmentalData(datasetCount);
  }
};

const generateSpeciesData = (count: number): SpeciesData[] => {
  const comprehensiveSpecies = [
    { name: 'Gadus morhua', common: 'Atlantic Cod', habitat: 'Demersal', conservation: 'Vulnerable' },
    { name: 'Pleuronectes platessa', common: 'European Plaice', habitat: 'Benthic', conservation: 'Least Concern' },
    { name: 'Solea solea', common: 'Common Sole', habitat: 'Benthic', conservation: 'Near Threatened' },
    { name: 'Merlangius merlangus', common: 'Whiting', habitat: 'Demersal', conservation: 'Least Concern' },
    { name: 'Scomber scombrus', common: 'Atlantic Mackerel', habitat: 'Pelagic', conservation: 'Least Concern' },
    { name: 'Clupea harengus', common: 'Atlantic Herring', habitat: 'Pelagic', conservation: 'Least Concern' },
    { name: 'Pollachius virens', common: 'Saithe', habitat: 'Demersal', conservation: 'Least Concern' },
    { name: 'Melanogrammus aeglefinus', common: 'Haddock', habitat: 'Demersal', conservation: 'Least Concern' },
    { name: 'Trisopterus esmarkii', common: 'Norway Pout', habitat: 'Demersal', conservation: 'Least Concern' },
    { name: 'Sprattus sprattus', common: 'European Sprat', habitat: 'Pelagic', conservation: 'Least Concern' },
    { name: 'Limanda limanda', common: 'Common Dab', habitat: 'Benthic', conservation: 'Least Concern' },
    { name: 'Microstomus kitt', common: 'Lemon Sole', habitat: 'Benthic', conservation: 'Least Concern' }
  ];
  
  const researchLocations = [
    { name: 'North Atlantic Survey Zone A', coords: '59°12\'N, 2°18\'W', depth_range: '45-95m' },
    { name: 'Baltic Sea Research Station', coords: '55°28\'N, 15°42\'E', depth_range: '20-65m' },
    { name: 'English Channel Transect', coords: '50°15\'N, 1°30\'W', depth_range: '15-45m' },
    { name: 'North Sea Deep Water', coords: '54°35\'N, 4°22\'E', depth_range: '80-150m' },
    { name: 'Norwegian Coastal Zone', coords: '62°18\'N, 5°45\'E', depth_range: '25-85m' },
    { name: 'Barents Sea Station', coords: '70°25\'N, 30°15\'E', depth_range: '120-200m' }
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const species = comprehensiveSpecies[Math.floor(Math.random() * comprehensiveSpecies.length)];
    const location = researchLocations[Math.floor(Math.random() * researchLocations.length)];
    const baseDepth = parseInt(location.depth_range.split('-')[0]);
    const maxDepth = parseInt(location.depth_range.split('-')[1]);
    
    return {
      species: `${species.name} (${species.common})`,
      count: Math.floor(Math.random() * 120) + 5,
      location: `${location.name} (${location.coords})`,
      depth: Math.floor(Math.random() * (maxDepth - baseDepth)) + baseDepth,
      temperature: 8 + Math.random() * 12 // More realistic North Atlantic temperatures
    };
  });
};

const generateBiodiversityData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    location: `Site ${i + 1}`,
    speciesCount: Math.floor(Math.random() * 30) + 5,
    shannonIndex: 1.5 + Math.random() * 2,
    simpsonIndex: 0.3 + Math.random() * 0.6,
    evenness: 0.4 + Math.random() * 0.5,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
  }));
};

const generateEnvironmentalData = (count: number): EnvironmentalData[] => {
  const researchStations = [
    { name: 'Atlantic Deep Water Station', coords: '59°N, 2°W', type: 'Deep Water' },
    { name: 'Baltic Sea Monitoring Point', coords: '55°N, 15°E', type: 'Brackish Water' },
    { name: 'North Sea Central Platform', coords: '54°N, 4°E', type: 'Continental Shelf' },
    { name: 'Norwegian Fjord Station', coords: '62°N, 5°E', type: 'Coastal' },
    { name: 'Barents Sea Research Base', coords: '70°N, 30°E', type: 'Arctic Waters' },
    { name: 'English Channel Transect', coords: '50°N, 1°W', type: 'Shallow Coastal' }
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const station = researchStations[Math.floor(Math.random() * researchStations.length)];
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    
    // Generate realistic seasonal temperature variations
    const baseTemp = station.type === 'Arctic Waters' ? 2 : 
                    station.type === 'Brackish Water' ? 8 :
                    station.type === 'Deep Water' ? 6 : 12;
    const seasonalAdjust = Math.sin((month - 3) * Math.PI / 6) * 8; // Seasonal variation
    
    return {
      date: new Date(2025, month, day).toISOString().split('T')[0],
      temperature: Math.max(0, baseTemp + seasonalAdjust + (Math.random() - 0.5) * 4),
      salinity: station.type === 'Brackish Water' ? 7 + Math.random() * 3 :
                station.type === 'Arctic Waters' ? 34.5 + Math.random() * 0.8 :
                33.8 + Math.random() * 1.5,
      ph: 7.9 + Math.random() * 0.3, // Realistic ocean pH range
      oxygen: 6.5 + Math.random() * 2.5, // Dissolved oxygen in mg/L
      location: `${station.name} (${station.coords}) - ${station.type}`
    };
  });
};

// PDF Generation
export const generatePDFReport = async (reportData: ReportData): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Oceanus Marine Research Platform', 20, 30);
  
  pdf.setFontSize(16);
  pdf.setTextColor(60, 60, 60);
  pdf.text(reportData.title, 20, 45);
  
  // Report metadata
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Report Type: ${reportData.type}`, 20, 60);
  pdf.text(`Generated: ${reportData.generatedAt.toLocaleString()}`, 20, 70);
  pdf.text(`Datasets: ${reportData.datasets.join(', ')}`, 20, 80);
  
  // Content sections
  let yPosition = 100;
  
  // Executive Summary
  pdf.setFontSize(14);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Executive Summary', 20, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);
  const summary = generateExecutiveSummary(reportData.type);
  const summaryLines = pdf.splitTextToSize(summary, pageWidth - 40);
  pdf.text(summaryLines, 20, yPosition);
  yPosition += summaryLines.length * 5 + 10;
  
  // Data Analysis Section
  if (reportData.includeAnalysis) {
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Data Analysis', 20, yPosition);
    yPosition += 15;
    
    const mockData = generateMockData(reportData.type, 20);
    const analysisText = generateAnalysisText(reportData.type, mockData);
    const analysisLines = pdf.splitTextToSize(analysisText, pageWidth - 40);
    pdf.text(analysisLines, 20, yPosition);
    yPosition += analysisLines.length * 5 + 10;
  }
  
  // Raw Data Table
  if (reportData.includeRawData) {
    // Add new page for data table
    pdf.addPage();
    yPosition = 30;
    
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Comprehensive Marine Survey Data', 20, yPosition);
    yPosition += 20;
    
    // Survey Methodology Section
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Survey Methodology & Equipment', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    const methodology = [
      'Vessel: RV Oceanus Explorer (Length: 65m, Research Classification: A1)',
      'Survey Type: Multi-beam acoustic trawl survey with CTD profiling',
      'Trawl Net: Pelagic trawl (Mesh: 120mm cod-end, 80mm body)',
      'Sampling Frequency: Every 2 nautical miles along predetermined transects',
      'CTD Equipment: SeaBird SBE 911plus with dissolved oxygen sensor',
      'Fish Identification: On-deck sorting with digital photography for verification',
      'Quality Control: Double-blind species identification by two certified marine biologists'
    ];
    
    methodology.forEach(line => {
      pdf.text(`• ${line}`, 25, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
    
    // Environmental Conditions Section
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Environmental Conditions During Survey', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(9);
    const conditions = [
      'Sea State: Moderate (Wave height 1-2m, Beaufort Scale 3-4)',
      'Wind: Southwest 15-20 knots, gusting to 25 knots',
      'Weather: Partly cloudy, visibility 8-10 nautical miles',
      'Tidal Conditions: Spring tide cycle, tidal range 3.2m',
      'Survey Duration: 72 hours (September 19-21, 2025)',
      'Total Survey Distance: 245 nautical miles across 6 transect lines'
    ];
    
    conditions.forEach(line => {
      pdf.text(`• ${line}`, 25, yPosition);
      yPosition += 7;
    });
    yPosition += 15;
    
    // Species Data Table
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Species Abundance Data (Sample of 20 most significant catches)', 20, yPosition);
    yPosition += 15;
    
    const mockData = generateMockData(reportData.type, 10);
    addDataTable(pdf, mockData, 20, yPosition, reportData.type);
    
    // Add third page for additional data
    pdf.addPage();
    yPosition = 30;
    
    // Statistical Summary
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Statistical Analysis Summary', 20, yPosition);
    yPosition += 20;
    
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    const statsData = [
      ['Total Sampling Stations:', '24 stations'],
      ['Total Specimens Collected:', '1,247 individuals'],
      ['Species Identified:', '18 species (confirmed), 3 species (pending genetic confirmation)'],
      ['Average Catch Per Unit Effort (CPUE):', '52.8 individuals/hour'],
      ['Biodiversity Index (Shannon H\'):', '2.47 ± 0.23'],
      ['Simpson\'s Diversity Index:', '0.16 ± 0.08'],
      ['Species Evenness (Pielou\'s J):', '0.82 ± 0.15'],
      ['Temperature Range Recorded:', '4.2°C - 18.7°C'],
      ['Salinity Range:', '32.1 - 35.8 PSU'],
      ['Depth Range Surveyed:', '15m - 185m'],
      ['Data Quality Score:', '94.7% (Excellent)'],
      ['GPS Accuracy:', '±2.5m (DGPS corrected)']
    ];
    
    statsData.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label, 25, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, 120, yPosition);
      yPosition += 8;
    });
    
    yPosition += 15;
    
    // Key Findings Section
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Key Scientific Findings', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(9);
    const findings = [
      'Significant increase in Atlantic Cod juvenile recruitment (Age 1-2) compared to 2024 survey',
      'Herring spawning aggregations observed in expected seasonal locations',
      'Water temperature anomaly (+1.8°C above historical average) recorded in Zone B',
      'Microplastic particles detected in 23% of fish stomach content samples',
      'Dissolved oxygen levels remain within optimal ranges across all survey areas',
      'Three potential new fishing grounds identified based on fish density mapping',
      'Seasonal migration patterns consistent with historical oceanographic models'
    ];
    
    findings.forEach(finding => {
      pdf.text(`• ${finding}`, 25, yPosition);
      yPosition += 7;
    });
    
    yPosition += 15;
    
    // Recommendations Section
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Management Recommendations', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(9);
    const recommendations = [
      'Continue monthly monitoring of temperature anomaly in Zone B through winter season',
      'Implement seasonal fishing closure in herring spawning areas (March 15 - May 30)',
      'Increase microplastic monitoring frequency to quarterly assessments',
      'Establish Marine Protected Area boundaries around newly identified cod nursery zones',
      'Collaborate with regional fisheries for sustainable quota adjustments based on recruitment data',
      'Deploy additional CTD monitoring stations in areas of high biodiversity'
    ];
    
    recommendations.forEach(rec => {
      pdf.text(`• ${rec}`, 25, yPosition);
      yPosition += 7;
    });
  }
  
  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${i} of ${totalPages + 1} - Oceanus Marine Research Platform - Generated ${new Date().toLocaleDateString()}`, 
             20, pageHeight - 10);
  }
  
  // Add Team Credits Page
  pdf.addPage();
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  // Background design elements
  pdf.setFillColor(15, 23, 42); // Dark blue background
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Decorative circles
  pdf.setFillColor(59, 130, 246); // Blue
  pdf.circle(50, 50, 20, 'F');
  pdf.setFillColor(16, 185, 129); // Green  
  pdf.circle(pageWidth - 50, 50, 15, 'F');
  pdf.setFillColor(251, 146, 60); // Orange
  pdf.circle(50, pageHeight - 50, 18, 'F');
  pdf.setFillColor(168, 85, 247); // Purple
  pdf.circle(pageWidth - 50, pageHeight - 50, 12, 'F');
  
  // Main title with heart emoji effect
  pdf.setFontSize(32);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Created with ❤️', centerX, centerY - 60, { align: 'center' });
  
  // Team name
  pdf.setFontSize(28);
  pdf.setTextColor(59, 130, 246); // Blue accent
  pdf.text('Team Nexora', centerX, centerY - 20, { align: 'center' });
  
  // Subtitle
  pdf.setFontSize(16);
  pdf.setTextColor(148, 163, 184); // Light gray
  pdf.setFont('helvetica', 'normal');
  pdf.text('Advancing Marine Research Through AI Innovation', centerX, centerY + 5, { align: 'center' });
  
  // Developer role
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AI/ML Developer', centerX, centerY + 40, { align: 'center' });
  
  // Developer name
  pdf.setFontSize(24);
  pdf.setTextColor(16, 185, 129); // Green accent
  pdf.text('Meghali Dutta', centerX, centerY + 60, { align: 'center' });
  
  // Platform info
  pdf.setFontSize(12);
  pdf.setTextColor(148, 163, 184);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Oceanus Marine Data Platform', centerX, centerY + 85, { align: 'center' });
  pdf.text('Powered by Advanced Machine Learning & Computer Vision', centerX, centerY + 100, { align: 'center' });
  
  // Technology stack
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Technologies: React • TypeScript • TensorFlow • OpenCV • Node.js • jsPDF', centerX, centerY + 125, { align: 'center' });
  
  // Copyright and generation info
  pdf.setFontSize(10);
  pdf.setTextColor(71, 85, 105);
  const currentYear = new Date().getFullYear();
  pdf.text(`© ${currentYear} Team Nexora. All rights reserved.`, centerX, pageHeight - 40, { align: 'center' });
  
  const generationDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  pdf.text(`Generated on ${generationDate}`, centerX, pageHeight - 25, { align: 'center' });
  
  // Final footer update for all pages
  const finalTotalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= finalTotalPages - 1; i++) { // Exclude credits page from numbering
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    // Clear previous footer
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    // Add updated footer
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${i} of ${finalTotalPages - 1} - Oceanus Marine Research Platform - Generated ${new Date().toLocaleDateString()}`, 
             20, pageHeight - 10);
  }
  
  // Save the PDF
  const fileName = `${reportData.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  pdf.save(fileName);
};

// Excel Generation
export const generateExcelReport = async (reportData: ReportData): Promise<void> => {
  const workbook = XLSX.utils.book_new();
  
  // Summary Sheet
  const summaryData = [
    ['Report Title', reportData.title],
    ['Report Type', reportData.type],
    ['Generated Date', reportData.generatedAt.toLocaleString()],
    ['Datasets', reportData.datasets.join(', ')],
    [''],
    ['Executive Summary'],
    [generateExecutiveSummary(reportData.type)]
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Raw Data Sheet
  if (reportData.includeRawData) {
    const mockData = generateMockData(reportData.type, 100);
    const dataSheet = XLSX.utils.json_to_sheet(mockData);
    XLSX.utils.book_append_sheet(workbook, dataSheet, 'Raw Data');
  }
  
  // Analysis Sheet
  if (reportData.includeAnalysis) {
    const analysisData = generateAnalysisDataForExcel(reportData.type);
    const analysisSheet = XLSX.utils.json_to_sheet(analysisData);
    XLSX.utils.book_append_sheet(workbook, analysisSheet, 'Analysis');
  }
  
  // Save the Excel file
  const fileName = `${reportData.title.replace(/\s+/g, '_')}_${Date.now()}.xlsx`;
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
};

// CSV Generation
export const generateCSVReport = async (reportData: ReportData): Promise<void> => {
  const mockData = generateMockData(reportData.type, 200);
  const csv = convertToCSV(mockData);
  
  const fileName = `${reportData.title.replace(/\s+/g, '_')}_${Date.now()}.csv`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};

// Helper Functions
const generateExecutiveSummary = (reportType: string): string => {
  switch (reportType) {
    case 'species-analysis':
      return 'This comprehensive species analysis report examines the distribution and abundance of marine species across multiple survey locations. Key findings include seasonal migration patterns, depth preferences, and species interaction dynamics. The data reveals significant biodiversity hotspots and provides recommendations for conservation efforts.';
    case 'biodiversity':
      return 'The biodiversity assessment reveals healthy ecosystem diversity across survey sites with Shannon diversity indices ranging from 2.1 to 3.4. Simpson indices indicate moderate to high species dominance patterns. Recommendations include continued monitoring and habitat protection measures.';
    case 'environmental':
      return 'Environmental monitoring data shows stable oceanographic conditions with temperature ranges consistent with seasonal expectations. pH levels remain within optimal ranges for marine life, while dissolved oxygen concentrations indicate healthy water quality across all monitoring stations.';
    default:
      return 'This custom report provides comprehensive analysis of selected marine datasets with detailed insights and recommendations for ongoing research and conservation efforts.';
  }
};

const generateAnalysisText = (reportType: string, data: any[]): string => {
  const dataCount = data.length;
  switch (reportType) {
    case 'species-analysis':
      const uniqueSpecies = new Set(data.map((d: SpeciesData) => d.species)).size;
      return `Analysis of ${dataCount} observations revealed ${uniqueSpecies} distinct species. Average depth distribution: ${Math.round(data.reduce((sum: number, d: SpeciesData) => sum + d.depth, 0) / dataCount)}m. Temperature preferences show clear thermal stratification patterns.`;
    case 'environmental':
      const avgTemp = (data.reduce((sum: number, d: EnvironmentalData) => sum + d.temperature, 0) / dataCount).toFixed(1);
      return `Environmental analysis of ${dataCount} measurements shows average temperature of ${avgTemp}°C. Salinity levels remain stable across locations with minimal variation. pH and oxygen levels indicate healthy marine conditions.`;
    default:
      return `Comprehensive analysis of ${dataCount} data points reveals significant patterns and trends worthy of continued investigation and monitoring.`;
  }
};

const generateAnalysisDataForExcel = (reportType: string) => {
  switch (reportType) {
    case 'species-analysis':
      return [
        { Metric: 'Total Species Observed', Value: 45, Unit: 'species' },
        { Metric: 'Average Depth', Value: 78.5, Unit: 'meters' },
        { Metric: 'Temperature Range', Value: '12.3 - 19.8', Unit: '°C' },
        { Metric: 'Most Common Species', Value: 'Kelp Bass', Unit: '' }
      ];
    case 'biodiversity':
      return [
        { Metric: 'Shannon Diversity Index', Value: 2.67, Unit: '' },
        { Metric: 'Simpson Index', Value: 0.78, Unit: '' },
        { Metric: 'Species Evenness', Value: 0.82, Unit: '' },
        { Metric: 'Total Sites Surveyed', Value: 15, Unit: 'sites' }
      ];
    default:
      return [
        { Metric: 'Data Points Analyzed', Value: 250, Unit: 'records' },
        { Metric: 'Quality Score', Value: 94.2, Unit: '%' },
        { Metric: 'Completeness', Value: 98.7, Unit: '%' }
      ];
  }
};

const addDataTable = (pdf: jsPDF, data: any[], x: number, y: number, reportType: string) => {
  pdf.setFontSize(8);
  pdf.setTextColor(40, 40, 40);
  
  if (reportType === 'species-analysis') {
    const headers = ['Scientific Name', 'Count', 'Location & Coordinates', 'Depth', 'Temp', 'Status'];
    let currentY = y;
    
    // Headers with background
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(240, 240, 240);
    pdf.rect(x, currentY - 6, 170, 8, 'F');
    headers.forEach((header, i) => {
      const xPos = x + 2 + (i * 28);
      pdf.text(header, xPos, currentY);
    });
    currentY += 10;
    
    // Data rows with alternating backgrounds
    pdf.setFont('helvetica', 'normal');
    data.slice(0, 15).forEach((row: SpeciesData, index) => {
      if (index % 2 === 0) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(x, currentY - 6, 170, 7, 'F');
      }
      
      // Truncate and format data for display
      const species = row.species.split('(')[0].trim().substring(0, 15);
      const location = row.location.split('(')[0].trim().substring(0, 12);
      const coords = row.location.includes('(') ? row.location.split('(')[1].split(')')[0].substring(0, 12) : '';
      
      pdf.text(species, x + 2, currentY);
      pdf.text(row.count.toString(), x + 30, currentY);
      pdf.text(location, x + 44, currentY);
      pdf.text(coords, x + 72, currentY);
      pdf.text(`${row.depth}m`, x + 100, currentY);
      pdf.text(`${row.temperature.toFixed(1)}°C`, x + 116, currentY);
      
      // Status based on count
      const status = row.count > 80 ? 'Abundant' : row.count > 40 ? 'Common' : row.count > 15 ? 'Moderate' : 'Rare';
      const statusColor: [number, number, number] = row.count > 80 ? [0, 120, 0] : row.count > 40 ? [0, 80, 0] : row.count > 15 ? [200, 120, 0] : [120, 0, 0];
      pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      pdf.text(status, x + 140, currentY);
      pdf.setTextColor(40, 40, 40);
      
      currentY += 7;
      
      if (currentY > 260) { // Add page break if needed
        pdf.addPage();
        currentY = 30;
      }
    });
    
    // Add summary statistics below table
    currentY += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Survey Summary Statistics:', x, currentY);
    currentY += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const totalCount = data.reduce((sum, row) => sum + row.count, 0);
    const avgDepth = (data.reduce((sum, row) => sum + row.depth, 0) / data.length).toFixed(1);
    const avgTemp = (data.reduce((sum, row) => sum + row.temperature, 0) / data.length).toFixed(2);
    const uniqueLocations = new Set(data.map(row => row.location.split('(')[0].trim())).size;
    
    pdf.text(`Total Individuals Caught: ${totalCount}`, x + 5, currentY);
    currentY += 6;
    pdf.text(`Average Survey Depth: ${avgDepth}m`, x + 5, currentY);
    currentY += 6;
    pdf.text(`Average Water Temperature: ${avgTemp}°C`, x + 5, currentY);
    currentY += 6;
    pdf.text(`Survey Locations: ${uniqueLocations} distinct areas`, x + 5, currentY);
    currentY += 6;
    pdf.text(`Species Diversity: ${data.length} species recorded`, x + 5, currentY);
  }
};

const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};