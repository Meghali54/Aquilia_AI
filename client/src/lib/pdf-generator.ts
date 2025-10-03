// Simple PDF report generator using HTML and browser printing
export interface ReportData {
  title: string;
  type: string;
  description?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  datasets: string[];
  includeCharts: boolean;
  includeRawData: boolean;
  includeAnalysis: boolean;
}

export interface OceanDataPoint {
  id: string;
  location: string;
  temperature: number;
  salinity: number;
  ph: number;
  oxygen: number;
  depth: number;
  turbidity: number;
  nutrients: number;
  fishCount: number;
  speciesCount: number;
  biomass: number;
  date: string;
}

// Mock ocean dataset for report generation
const mockOceanData: OceanDataPoint[] = [
  {
    id: '1',
    location: 'Pacific Coast - Station A',
    temperature: 18.5,
    salinity: 34.2,
    ph: 8.1,
    oxygen: 7.2,
    depth: 25,
    turbidity: 2.1,
    nutrients: 45.3,
    fishCount: 127,
    speciesCount: 23,
    biomass: 342.5,
    date: '2024-09-01'
  },
  {
    id: '2',
    location: 'Pacific Coast - Station B',
    temperature: 19.2,
    salinity: 33.8,
    ph: 8.0,
    oxygen: 6.9,
    depth: 18,
    turbidity: 1.8,
    nutrients: 38.7,
    fishCount: 89,
    speciesCount: 18,
    biomass: 256.8,
    date: '2024-09-02'
  },
  {
    id: '3',
    location: 'Coral Reef - Station C',
    temperature: 26.1,
    salinity: 35.1,
    ph: 8.3,
    oxygen: 8.1,
    depth: 12,
    turbidity: 0.9,
    nutrients: 52.1,
    fishCount: 203,
    speciesCount: 34,
    biomass: 567.2,
    date: '2024-09-03'
  },
  {
    id: '4',
    location: 'Deep Ocean - Station D',
    temperature: 4.2,
    salinity: 34.7,
    ph: 7.8,
    oxygen: 5.5,
    depth: 150,
    turbidity: 0.3,
    nutrients: 28.9,
    fishCount: 45,
    speciesCount: 12,
    biomass: 123.4,
    date: '2024-09-04'
  },
  {
    id: '5',
    location: 'Kelp Forest - Station E',
    temperature: 15.8,
    salinity: 33.5,
    ph: 8.2,
    oxygen: 9.1,
    depth: 8,
    turbidity: 1.2,
    nutrients: 67.8,
    fishCount: 156,
    speciesCount: 28,
    biomass: 445.6,
    date: '2024-09-05'
  }
];

export class PDFReportGenerator {
  private generateHTMLReport(reportData: ReportData): string {
    // Filter data based on selected datasets
    const filteredData = mockOceanData.filter(point => 
      reportData.datasets.some(dataset => 
        dataset.toLowerCase().includes('pacific') && point.location.includes('Pacific') ||
        dataset.toLowerCase().includes('coral') && point.location.includes('Coral') ||
        dataset.toLowerCase().includes('kelp') && point.location.includes('Kelp') ||
        dataset.toLowerCase().includes('deep') && point.location.includes('Deep') ||
        reportData.datasets.length === 0
      )
    );

    const dataToUse = filteredData.length > 0 ? filteredData : mockOceanData;

    // Calculate statistics
    const avgTemp = dataToUse.reduce((sum, d) => sum + d.temperature, 0) / dataToUse.length;
    const avgSalinity = dataToUse.reduce((sum, d) => sum + d.salinity, 0) / dataToUse.length;
    const avgPH = dataToUse.reduce((sum, d) => sum + d.ph, 0) / dataToUse.length;
    const totalFish = dataToUse.reduce((sum, d) => sum + d.fishCount, 0);
    const totalSpecies = dataToUse.reduce((sum, d) => sum + d.speciesCount, 0);
    const totalBiomass = dataToUse.reduce((sum, d) => sum + d.biomass, 0);

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${reportData.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a, #0891b2);
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e3a8a;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #1e3a8a;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-card {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #1e3a8a;
        }
        .stat-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #1e3a8a;
        }
        .analysis {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #0891b2;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #64748b;
            text-align: center;
        }
        @media print {
            body { margin: 0; }
            .header { break-inside: avoid; }
            .section { break-inside: avoid-page; }
            table { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">AQUILA Marine Data Platform</div>
        <div class="subtitle">${reportData.type}</div>
        <h1>${reportData.title}</h1>
    </div>

    ${reportData.description ? `
    <div class="section">
        <div class="section-title">Description</div>
        <p>${reportData.description}</p>
    </div>
    ` : ''}

    <div class="section">
        <div class="section-title">Report Information</div>
        <p><strong>Report Type:</strong> ${reportData.type}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p><strong>Datasets Included:</strong> ${reportData.datasets.length > 0 ? reportData.datasets.join(', ') : 'All available datasets'}</p>
        ${reportData.dateRange?.start && reportData.dateRange?.end ? `
        <p><strong>Date Range:</strong> ${reportData.dateRange.start} to ${reportData.dateRange.end}</p>
        ` : ''}
    </div>

    <div class="section">
        <div class="section-title">Summary Statistics</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Average Temperature</div>
                <div class="stat-value">${avgTemp.toFixed(1)}°C</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Average Salinity</div>
                <div class="stat-value">${avgSalinity.toFixed(1)} PSU</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Average pH</div>
                <div class="stat-value">${avgPH.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Fish Count</div>
                <div class="stat-value">${totalFish.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Species</div>
                <div class="stat-value">${totalSpecies}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Biomass</div>
                <div class="stat-value">${totalBiomass.toFixed(1)} kg</div>
            </div>
        </div>
    </div>

    ${reportData.includeRawData ? `
    <div class="section">
        <div class="section-title">Raw Data</div>
        <table>
            <thead>
                <tr>
                    <th>Location</th>
                    <th>Temp (°C)</th>
                    <th>Salinity</th>
                    <th>pH</th>
                    <th>O₂ (mg/L)</th>
                    <th>Depth (m)</th>
                    <th>Fish Count</th>
                    <th>Species</th>
                    <th>Biomass (kg)</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${dataToUse.map(point => `
                <tr>
                    <td>${point.location}</td>
                    <td>${point.temperature}</td>
                    <td>${point.salinity}</td>
                    <td>${point.ph}</td>
                    <td>${point.oxygen}</td>
                    <td>${point.depth}</td>
                    <td>${point.fishCount}</td>
                    <td>${point.speciesCount}</td>
                    <td>${point.biomass}</td>
                    <td>${point.date}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}

    ${reportData.includeAnalysis ? `
    <div class="section">
        <div class="section-title">Analysis & Insights</div>
        <div class="analysis">
            <h3>${reportData.type} Analysis</h3>
            ${this.generateAnalysisText(reportData.type, dataToUse)}
        </div>
    </div>
    ` : ''}

    ${reportData.includeCharts ? `
    <div class="section">
        <div class="section-title">Data Visualizations</div>
        <p><strong>Note:</strong> In a production system, this section would include:</p>
        <ul>
            <li>Temperature trend charts</li>
            <li>Species distribution maps</li>
            <li>Biomass vs. environmental parameter correlations</li>
            <li>Seasonal variation plots</li>
            <li>Comparative analysis between sampling stations</li>
        </ul>
    </div>
    ` : ''}

    <div class="footer">
        <p>Generated by AQUILA Marine Data Platform | ${new Date().toLocaleDateString()} | Page 1</p>
    </div>
</body>
</html>
    `;

    return html;
  }

  private generateAnalysisText(reportType: string, data: OceanDataPoint[]): string {
    switch (reportType) {
      case 'Species Analysis':
        return `
        <p>The marine ecosystem shows diverse species composition across different habitats. Coral reef stations demonstrate the highest biodiversity with significant species richness.</p>
        
        <h4>Key Findings:</h4>
        <ul>
            <li>Coral reef environments support higher species diversity than coastal areas</li>
            <li>Deep ocean stations show lower diversity but unique species composition</li>
            <li>Kelp forests provide critical habitat for juvenile fish populations</li>
            <li>Temperature and oxygen levels are primary drivers of species distribution</li>
        </ul>
        
        <h4>Conservation Recommendations:</h4>
        <ul>
            <li>Protect coral reef areas as biodiversity hotspots</li>
            <li>Monitor temperature changes affecting species migration patterns</li>
            <li>Implement sustainable fishing practices in high-biomass areas</li>
        </ul>
        `;
        
      case 'Biodiversity Report':
        const avgBiodiversity = data.reduce((sum, d) => sum + d.speciesCount, 0) / data.length;
        return `
        <p>Marine biodiversity index shows healthy ecosystem conditions with an average of ${avgBiodiversity.toFixed(1)} species per sampling station.</p>
        
        <h4>Ecosystem Health Indicators:</h4>
        <ul>
            <li>Species richness: High in shallow coastal waters</li>
            <li>Evenness: Balanced distribution across trophic levels</li>
            <li>Biomass distribution: Concentrated in productive zones</li>
            <li>Endemic species: Protected status monitoring required</li>
        </ul>
        
        <h4>Biodiversity Trends:</h4>
        <ul>
            <li>Seasonal variation in species composition observed</li>
            <li>Climate adaptation patterns emerging in temperature-sensitive species</li>
            <li>Habitat connectivity supporting migration corridors</li>
        </ul>
        `;
        
      case 'Environmental Report':
        const tempRange = Math.max(...data.map(d => d.temperature)) - Math.min(...data.map(d => d.temperature));
        return `
        <p>Oceanographic parameters indicate diverse marine environments with temperature variations of ${tempRange.toFixed(1)}°C reflecting different water masses.</p>
        
        <h4>Environmental Parameters:</h4>
        <ul>
            <li>Water temperature: Optimal ranges for most marine species</li>
            <li>Salinity levels: Within normal oceanic values (33.5-35.1 PSU)</li>
            <li>pH conditions: Slightly alkaline, supporting healthy marine life</li>
            <li>Dissolved oxygen: Adequate levels for aerobic marine organisms</li>
        </ul>
        
        <h4>Climate Impact Assessment:</h4>
        <ul>
            <li>Ocean acidification trends within acceptable limits</li>
            <li>Temperature stability supporting marine food webs</li>
            <li>Nutrient levels supporting primary productivity</li>
        </ul>
        `;
        
      default:
        return `
        <p>This comprehensive report provides insights into marine ecosystem conditions based on multi-parameter oceanographic monitoring.</p>
        <p>Data collected across various marine habitats demonstrates the complexity and richness of ocean environments, informing conservation and management strategies.</p>
        `;
    }
  }

  public async generateReport(reportData: ReportData): Promise<Blob> {
    const htmlContent = this.generateHTMLReport(reportData);
    
    // Create a blob with HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return blob;
  }

  public downloadPDF(blob: Blob, filename: string) {
    // For HTML reports, we'll download as HTML and user can print to PDF
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.pdf', '.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Open in new window for printing to PDF
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    }
  }

  public async printToPDF(reportData: ReportData, filename: string) {
    const htmlContent = this.generateHTMLReport(reportData);
    
    // Create a new window with the report content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger print dialog
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Don't close the window automatically so user can see the report
        }, 1000);
      };
    }
    
    // Also create downloadable HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.pdf', '.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return blob;
  }
}

export const pdfGenerator = new PDFReportGenerator();