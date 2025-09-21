import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronDown, 
  ChevronRight, 
  TreePine, 
  Search, 
  Filter,
  Fish,
  Download,
  Layers,
  Zap,
  Eye,
  Microscope,
  Share2,
  Camera,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Layout } from '@/components/layout/Layout';

// Custom CSS for enhanced scrollbar and animations
const customStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.5) rgba(30, 41, 59, 0.3);
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.3);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(59, 130, 246, 0.6), rgba(16, 185, 129, 0.6));
    border-radius: 4px;
    border: 1px solid rgba(71, 85, 105, 0.3);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(16, 185, 129, 0.8));
  }
  
  .ocean-gradient {
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.1) 0%, 
      rgba(16, 185, 129, 0.1) 25%, 
      rgba(139, 92, 246, 0.1) 50%, 
      rgba(236, 72, 153, 0.1) 75%, 
      rgba(251, 146, 60, 0.1) 100%);
  }
  
  .floating-animation {
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes pulse-glow {
    from { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    to { box-shadow: 0 0 30px rgba(16, 185, 129, 0.4); }
  }
`;

interface TaxonomyNode {
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  species?: string[];
  children?: TaxonomyNode[];
}

interface SpeciesProfile {
  scientificName: string;
  commonName: string;
  habitat: string;
  distribution: string;
  conservation: string;
  description: string;
  characteristics: string[];
  imageUrl?: string;
}

export default function Taxonomy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [conservationFilter, setConservationFilter] = useState('all');
  const [habitatFilter, setHabitatFilter] = useState('all');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

  // Comprehensive mock taxonomy data with full species information
  const mockTaxonomyTree: TaxonomyNode = {
    kingdom: 'Animalia',
    children: [
      {
        phylum: 'Chordata',
        children: [
          {
            class: 'Actinopterygii',
            children: [
              {
                order: 'Perciformes',
                children: [
                  {
                    family: 'Scombridae',
                    species: [
                      'Thunnus thynnus',
                      'Thunnus albacares',
                      'Katsuwonus pelamis',
                      'Scomber scombrus'
                    ]
                  },
                  {
                    family: 'Carangidae',
                    species: [
                      'Seriola dumerili',
                      'Caranx hippos',
                      'Trachurus trachurus',
                      'Alectis ciliaris'
                    ]
                  },
                  {
                    family: 'Lutjanidae',
                    species: [
                      'Lutjanus campechanus',
                      'Lutjanus sebae',
                      'Ocyurus chrysurus'
                    ]
                  }
                ]
              },
              {
                order: 'Gadiformes',
                children: [
                  {
                    family: 'Gadidae',
                    species: [
                      'Gadus morhua',
                      'Pollachius virens',
                      'Melanogrammus aeglefinus'
                    ]
                  }
                ]
              },
              {
                order: 'Pleuronectiformes',
                children: [
                  {
                    family: 'Pleuronectidae',
                    species: [
                      'Hippoglossus hippoglossus',
                      'Pleuronectes platessa',
                      'Limanda limanda'
                    ]
                  }
                ]
              }
            ]
          },
          {
            class: 'Chondrichthyes',
            children: [
              {
                order: 'Carcharhiniformes',
                children: [
                  {
                    family: 'Carcharhinidae',
                    species: [
                      'Carcharhinus leucas',
                      'Carcharhinus plumbeus',
                      'Prionace glauca'
                    ]
                  }
                ]
              },
              {
                order: 'Rajiformes',
                children: [
                  {
                    family: 'Rajidae',
                    species: [
                      'Raja clavata',
                      'Raja brachyura',
                      'Leucoraja naevus'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        phylum: 'Mollusca',
        children: [
          {
            class: 'Cephalopoda',
            children: [
              {
                order: 'Octopoda',
                children: [
                  {
                    family: 'Octopodidae',
                    species: [
                      'Octopus vulgaris',
                      'Octopus dofleini',
                      'Octopus cyanea'
                    ]
                  }
                ]
              },
              {
                order: 'Teuthida',
                children: [
                  {
                    family: 'Loliginidae',
                    species: [
                      'Loligo vulgaris',
                      'Loligo pealei',
                      'Doryteuthis plei'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        phylum: 'Arthropoda',
        children: [
          {
            class: 'Malacostraca',
            children: [
              {
                order: 'Decapoda',
                children: [
                  {
                    family: 'Nephropidae',
                    species: [
                      'Homarus americanus',
                      'Homarus gammarus',
                      'Nephrops norvegicus'
                    ]
                  },
                  {
                    family: 'Cancridae',
                    species: [
                      'Cancer pagurus',
                      'Cancer borealis',
                      'Cancer magister'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const { data: taxonomyTree, isLoading } = useQuery<TaxonomyNode>({
    queryKey: ['/api/taxonomy/tree'],
    queryFn: () => {
      // Return mock data for now since API might not be available
      return Promise.resolve(mockTaxonomyTree);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Enhanced species profiles with comprehensive data
  const getSpeciesProfile = (species: string): SpeciesProfile => {
    const profiles: Record<string, SpeciesProfile> = {
      'Thunnus thynnus': {
        scientificName: 'Thunnus thynnus',
        commonName: 'Atlantic Bluefin Tuna',
        habitat: 'Pelagic, open ocean',
        distribution: 'North Atlantic Ocean, Mediterranean Sea',
        conservation: 'Endangered',
        description: 'The Atlantic bluefin tuna is a species of tuna native to both the western and eastern Atlantic Ocean, as well as the Mediterranean Sea. It is one of the largest bony fish and can reach lengths of over 4 meters.',
        characteristics: [
          'Large size up to 4.6m length',
          'Dark blue dorsally, silver ventrally',
          'Highly migratory species',
          'Warm-blooded (endothermic)',
          'Fast swimmer up to 70 km/h',
          'Commercial importance'
        ],
        imageUrl: '/images/species/bluefin-tuna.jpg'
      },
      'Thunnus albacares': {
        scientificName: 'Thunnus albacares',
        commonName: 'Yellowfin Tuna',
        habitat: 'Epipelagic and mesopelagic zones',
        distribution: 'Tropical and subtropical oceans worldwide',
        conservation: 'Near Threatened',
        description: 'Yellowfin tuna is a species of tuna found in pelagic waters of tropical and subtropical oceans worldwide.',
        characteristics: [
          'Distinctive yellow fins',
          'Size up to 2.4m length',
          'Schooling behavior',
          'Fast growth rate',
          'Important commercial species'
        ],
      },
      'Katsuwonus pelamis': {
        scientificName: 'Katsuwonus pelamis',
        commonName: 'Skipjack Tuna',
        habitat: 'Epipelagic zone of tropical and warm-temperate oceans',
        distribution: 'Worldwide in tropical and subtropical waters',
        conservation: 'Least Concern',
        description: 'The skipjack tuna is a medium-sized perciform fish in the tuna family Scombridae. It is an important commercial fish species.',
        characteristics: [
          'Streamlined body shape',
          'Dark horizontal stripes on lower sides',
          'Size typically 40-100cm',
          'Schooling behavior',
          'Important commercial species'
        ],
      },
      'Scomber scombrus': {
        scientificName: 'Scomber scombrus',
        commonName: 'Atlantic Mackerel',
        habitat: 'Coastal and shelf waters',
        distribution: 'North Atlantic Ocean',
        conservation: 'Least Concern',
        description: 'Atlantic mackerel is a pelagic schooling species found in the temperate waters of the North Atlantic Ocean.',
        characteristics: [
          'Distinctive wavy lines on back',
          'Schooling fish',
          'Size 30-50cm typically',
          'Seasonal migrations',
          'Important food source'
        ],
      },
      'Seriola dumerili': {
        scientificName: 'Seriola dumerili',
        commonName: 'Greater Amberjack',
        habitat: 'Reef-associated, pelagic-neritic',
        distribution: 'Western and Eastern Atlantic, Mediterranean',
        conservation: 'Near Threatened',
        description: 'The greater amberjack is a jack of the genus Seriola. It is found in temperate, subtropical, and tropical seas around the world.',
        characteristics: [
          'Robust, elongated body',
          'Bronze-olive coloration',
          'Can reach 1.9m in length',
          'Predatory behavior',
          'Popular sport fish'
        ],
      },
      'Caranx hippos': {
        scientificName: 'Caranx hippos',
        commonName: 'Crevalle Jack',
        habitat: 'Coastal waters, estuaries',
        distribution: 'Western Atlantic from Nova Scotia to Uruguay',
        conservation: 'Least Concern',
        description: 'The crevalle jack is a common species of large marine fish classified within the jack family, Carangidae.',
        characteristics: [
          'Deep, compressed body',
          'Golden-yellow to silvery coloration',
          'Size up to 1.2m length',
          'Aggressive predator',
          'Forms large schools'
        ],
      },
      'Carcharhinus leucas': {
        scientificName: 'Carcharhinus leucas',
        commonName: 'Bull Shark',
        habitat: 'Coastal waters, rivers, lakes',
        distribution: 'Warm coastal areas worldwide',
        conservation: 'Near Threatened',
        description: 'The bull shark is a requiem shark commonly found worldwide in warm, shallow waters along coasts and in rivers.',
        characteristics: [
          'Ability to tolerate freshwater',
          'Robust, stocky build',
          'Aggressive behavior',
          'Size up to 3.5m length',
          'Apex predator'
        ],
      },
      'Octopus vulgaris': {
        scientificName: 'Octopus vulgaris',
        commonName: 'Common Octopus',
        habitat: 'Rocky reefs, sandy bottoms',
        distribution: 'Tropical and temperate waters worldwide',
        conservation: 'Least Concern',
        description: 'The common octopus is a mollusk belonging to the class Cephalopoda. It is the most studied of all octopus species.',
        characteristics: [
          'Eight arms with suckers',
          'Highly intelligent',
          'Color-changing ability',
          'Problem-solving skills',
          'Short lifespan (1-2 years)'
        ],
      },
      'Homarus americanus': {
        scientificName: 'Homarus americanus',
        commonName: 'American Lobster',
        habitat: 'Rocky bottoms, coastal waters',
        distribution: 'Northwest Atlantic Ocean',
        conservation: 'Least Concern',
        description: 'The American lobster is a species of lobster found on the Atlantic coast of North America.',
        characteristics: [
          'Large claws (chelae)',
          'Blue-green to brown coloration',
          'Can live over 100 years',
          'Important commercial species',
          'Nocturnal behavior'
        ],
      }
    };

    return profiles[species] || {
      scientificName: species,
      commonName: species.split(' ')[1] || 'Unknown Species',
      habitat: 'Marine environment',
      distribution: 'Various locations',
      conservation: 'Not Assessed',
      description: `${species} is a marine species found in ocean environments. Detailed information is currently being compiled.`,
      characteristics: ['Information pending', 'Under research'],
    };
  };

  // Filter taxonomy tree based on search term and filters
  const filterTaxonomyTree = (node: TaxonomyNode, searchTerm: string): TaxonomyNode | null => {
    if (!node) return null;

    const search = searchTerm.toLowerCase();
    
    // Check if current node matches search
    const nodeMatches = 
      node.kingdom?.toLowerCase().includes(search) ||
      node.phylum?.toLowerCase().includes(search) ||
      node.class?.toLowerCase().includes(search) ||
      node.order?.toLowerCase().includes(search) ||
      node.family?.toLowerCase().includes(search);

    // Check if any species in this node matches
    const matchingSpecies = node.species?.filter(species => {
      const profile = getSpeciesProfile(species);
      const speciesMatches = 
        species.toLowerCase().includes(search) ||
        profile.commonName.toLowerCase().includes(search) ||
        profile.habitat.toLowerCase().includes(search) ||
        profile.distribution.toLowerCase().includes(search);
      
      // Apply conservation filter
      const conservationMatches = 
        conservationFilter === 'all' ||
        (conservationFilter === 'endangered' && profile.conservation.includes('Endangered')) ||
        (conservationFilter === 'threatened' && profile.conservation.includes('Threatened')) ||
        (conservationFilter === 'concern' && profile.conservation.includes('Least Concern'));
      
      // Apply habitat filter
      const habitatMatches = 
        habitatFilter === 'all' ||
        (habitatFilter === 'reef' && profile.habitat.toLowerCase().includes('reef')) ||
        (habitatFilter === 'deep' && profile.habitat.toLowerCase().includes('deep')) ||
        (habitatFilter === 'coastal' && profile.habitat.toLowerCase().includes('coastal')) ||
        (habitatFilter === 'pelagic' && profile.habitat.toLowerCase().includes('pelagic'));

      return speciesMatches && conservationMatches && habitatMatches;
    }) || [];

    // Filter children recursively
    const filteredChildren = node.children?.map(child => 
      filterTaxonomyTree(child, searchTerm)
    ).filter((child): child is TaxonomyNode => child !== null) || [];

    // Include node if it matches, has matching species, or has matching children
    if (nodeMatches || matchingSpecies.length > 0 || filteredChildren.length > 0) {
      return {
        ...node,
        species: matchingSpecies.length > 0 ? matchingSpecies : node.species,
        children: filteredChildren.length > 0 ? filteredChildren : node.children
      };
    }

    return null;
  };

  // Get filtered taxonomy tree
  const filteredTaxonomyTree = useMemo(() => {
    if (!taxonomyTree) return null;
    if (!searchTerm && conservationFilter === 'all' && habitatFilter === 'all') {
      return taxonomyTree;
    }
    return filterTaxonomyTree(taxonomyTree, searchTerm);
  }, [taxonomyTree, searchTerm, conservationFilter, habitatFilter]);

  // Auto-expand nodes when searching
  const updateExpandedNodesForSearch = (node: TaxonomyNode, path: string = '') => {
    const newExpanded = new Set(expandedNodes);
    
    if (node.kingdom) newExpanded.add(`${path}/kingdom/${node.kingdom}`);
    if (node.phylum) newExpanded.add(`${path}/phylum/${node.phylum}`);
    if (node.class) newExpanded.add(`${path}/class/${node.class}`);
    if (node.order) newExpanded.add(`${path}/order/${node.order}`);
    if (node.family) newExpanded.add(`${path}/family/${node.family}`);
    
    if (node.children) {
      node.children.forEach(child => {
        const childPath = node.kingdom ? `${path}/kingdom/${node.kingdom}` : 
                         node.phylum ? `${path}/phylum/${node.phylum}` :
                         node.class ? `${path}/class/${node.class}` :
                         node.order ? `${path}/order/${node.order}` :
                         node.family ? `${path}/family/${node.family}` : path;
        updateExpandedNodesForSearch(child, childPath);
      });
    }
    
    setExpandedNodes(newExpanded);
  };

  // Expand all matching nodes when search term changes
  useEffect(() => {
    if (searchTerm && filteredTaxonomyTree) {
      updateExpandedNodesForSearch(filteredTaxonomyTree);
    }
  }, [searchTerm, filteredTaxonomyTree]);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTaxonomyLevel = (
    node: TaxonomyNode, 
    level: number = 0, 
    parentPath: string = ''
  ): React.ReactNode => {
    if (!node) return null;

    const entries = [
      node.kingdom && { type: 'kingdom', value: node.kingdom },
      node.phylum && { type: 'phylum', value: node.phylum },
      node.class && { type: 'class', value: node.class },
      node.order && { type: 'order', value: node.order },
      node.family && { type: 'family', value: node.family },
    ].filter(Boolean);

    const getTaxonomyColor = (type: string) => {
      switch (type) {
        case 'kingdom': return 'from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/30';
        case 'phylum': return 'from-blue-500/20 to-blue-600/20 text-blue-300 border-blue-500/30';
        case 'class': return 'from-emerald-500/20 to-emerald-600/20 text-emerald-300 border-emerald-500/30';
        case 'order': return 'from-yellow-500/20 to-yellow-600/20 text-yellow-300 border-yellow-500/30';
        case 'family': return 'from-red-500/20 to-red-600/20 text-red-300 border-red-500/30';
        default: return 'from-slate-500/20 to-slate-600/20 text-slate-300 border-slate-500/30';
      }
    };

    return (
      <div>
        {entries.map((entry, index) => {
          if (!entry) return null;
          
          const nodePath = `${parentPath}/${entry.type}/${entry.value}`;
          const isExpanded = expandedNodes.has(nodePath);
          const hasChildren = node.children && node.children.length > 0;
          const hasSpecies = node.species && node.species.length > 0;
          const colorClasses = getTaxonomyColor(entry.type);

          return (
            <div key={nodePath} style={{ marginLeft: `${level * 16}px` }}>
              <div 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border",
                  "hover:bg-white/10 hover:scale-105 hover:shadow-lg",
                  `bg-gradient-to-r ${colorClasses}`,
                  isExpanded && "bg-white/10 shadow-md"
                )}
                onClick={() => toggleNode(nodePath)}
                data-testid={`taxonomy-node-${entry.type}-${entry.value}`}
              >
                <div className="flex items-center gap-2 flex-1">
                  {(hasChildren || hasSpecies) && (
                    <div className="transition-transform duration-200">
                      {isExpanded ? 
                        <ChevronDown className="w-4 h-4 text-white" /> : 
                        <ChevronRight className="w-4 h-4 text-white" />
                      }
                    </div>
                  )}
                  <div className="p-1 bg-white/20 rounded">
                    <TreePine className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold capitalize text-white text-sm">{entry.type}</span>
                  <span className="italic font-medium">{entry.value}</span>
                </div>
                {(hasChildren || hasSpecies) && (
                  <div className="text-xs bg-white/20 px-2 py-1 rounded-full text-white">
                    {hasChildren ? node.children?.length : node.species?.length}
                  </div>
                )}
              </div>

              {isExpanded && hasChildren && (
                <div className="mt-2 space-y-1">
                  {node.children?.map((child, childIndex) => (
                    <div key={childIndex}>
                      {renderTaxonomyLevel(child, level + 1, nodePath)}
                    </div>
                  ))}
                </div>
              )}

              {isExpanded && hasSpecies && (
                <div className="mt-2 space-y-1" style={{ marginLeft: `${(level + 1) * 16}px` }}>
                  {node.species?.map((species, speciesIndex) => (
                    <div 
                      key={speciesIndex}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 border border-white/10",
                        "bg-gradient-to-r from-teal-500/10 to-blue-500/10 hover:from-teal-500/20 hover:to-blue-500/20",
                        "hover:scale-105 hover:shadow-lg"
                      )}
                      data-testid={`species-${species.replace(' ', '-')}`}
                    >
                      <div className="p-1 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded">
                        <Fish className="w-4 h-4 text-teal-300" />
                      </div>
                      <span className="italic text-teal-300 font-medium flex-1">{species}</span>
                      <Eye className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const breadcrumbs = [
    { label: 'Taxonomy Browser' },
  ];

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
                  <Microscope className="w-12 h-12 text-blue-400" />
                </div>
                <div className="text-left">
                  <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                    Marine Taxonomy
                  </h1>
                  <p className="text-2xl text-slate-300 font-light">
                    Advanced Species Classification System
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-4 text-lg">
                  <Download className="w-5 h-5 mr-3" />
                  Export Database
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl px-8 py-4 text-lg">
                  <Share2 className="w-5 h-5 mr-3" />
                  Share Collection
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl px-8 py-4 text-lg">
                  <Camera className="w-5 h-5 mr-3" />
                  Gallery View
                </Button>
              </div>
              
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-2xl rounded-3xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 pulse-glow">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl mb-4">
                      <Fish className="w-10 h-10 text-blue-400" />
                    </div>
                    <p className="text-blue-300 text-lg font-semibold mb-2">Marine Species</p>
                    <p className="text-4xl font-black text-white">2,847</p>
                    <p className="text-blue-400/70 text-sm mt-1">+127 this month</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 backdrop-blur-2xl rounded-3xl p-8 border border-teal-500/20 hover:border-teal-400/40 transition-all duration-300 pulse-glow" style={{animationDelay: '0.5s'}}>
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-2xl mb-4">
                      <TreePine className="w-10 h-10 text-teal-400" />
                    </div>
                    <p className="text-teal-300 text-lg font-semibold mb-2">Families</p>
                    <p className="text-4xl font-black text-white">156</p>
                    <p className="text-teal-400/70 text-sm mt-1">Across 8 kingdoms</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-2xl rounded-3xl p-8 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 pulse-glow" style={{animationDelay: '1s'}}>
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl mb-4">
                      <Globe className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-emerald-300 text-lg font-semibold mb-2">Ecosystems</p>
                    <p className="text-4xl font-black text-white">89</p>
                    <p className="text-emerald-400/70 text-sm mt-1">Global coverage</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-2xl rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 pulse-glow" style={{animationDelay: '1.5s'}}>
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl mb-4">
                      <Layers className="w-10 h-10 text-purple-400" />
                    </div>
                    <p className="text-purple-300 text-lg font-semibold mb-2">Research</p>
                    <p className="text-4xl font-black text-white">1,234</p>
                    <p className="text-purple-400/70 text-sm mt-1">Active studies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Search Bar */}
        <div className="relative z-10 px-8 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                <div className="flex-1 relative min-w-0">
                  <Search className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search marine species..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-2xl w-full"
                    data-testid="input-search-taxonomy"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 lg:gap-3">
                  <Select onValueChange={setConservationFilter} defaultValue="all">
                    <SelectTrigger className="w-full sm:w-48 h-14 bg-white/5 border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-all duration-200 rounded-2xl">
                      <SelectValue placeholder="Conservation Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-xl">
                      <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10">All Status</SelectItem>
                      <SelectItem value="endangered" className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Endangered
                        </div>
                      </SelectItem>
                      <SelectItem value="threatened" className="text-orange-400 hover:bg-orange-500/20 focus:bg-orange-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Near Threatened
                        </div>
                      </SelectItem>
                      <SelectItem value="concern" className="text-green-400 hover:bg-green-500/20 focus:bg-green-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Least Concern
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select onValueChange={setHabitatFilter} defaultValue="all">
                    <SelectTrigger className="w-full sm:w-48 h-14 bg-white/5 border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-all duration-200 rounded-2xl">
                      <SelectValue placeholder="Habitat Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-xl">
                      <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10">All Habitats</SelectItem>
                      <SelectItem value="reef" className="text-blue-400 hover:bg-blue-500/20 focus:bg-blue-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Coral Reef
                        </div>
                      </SelectItem>
                      <SelectItem value="deep" className="text-purple-400 hover:bg-purple-500/20 focus:bg-purple-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Deep Sea
                        </div>
                      </SelectItem>
                      <SelectItem value="coastal" className="text-teal-400 hover:bg-teal-500/20 focus:bg-teal-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          Coastal Waters
                        </div>
                      </SelectItem>
                      <SelectItem value="pelagic" className="text-cyan-400 hover:bg-cyan-500/20 focus:bg-cyan-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                          Pelagic Zone
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={() => {
                      // Force re-render of filtered results
                      if (searchTerm || conservationFilter !== 'all' || habitatFilter !== 'all') {
                        // Auto-expand search results
                        if (filteredTaxonomyTree) {
                          updateExpandedNodesForSearch(filteredTaxonomyTree);
                        }
                      }
                    }}
                    className="h-14 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 rounded-2xl text-lg font-semibold px-8 whitespace-nowrap"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    {searchTerm || conservationFilter !== 'all' || habitatFilter !== 'all' ? 'Apply Filters' : 'Search'}
                  </Button>
                  
                  {(searchTerm || conservationFilter !== 'all' || habitatFilter !== 'all') && (
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setConservationFilter('all');
                        setHabitatFilter('all');
                      }}
                      variant="outline"
                      className="h-14 border-white/20 text-white hover:bg-white/10 rounded-2xl text-lg font-semibold px-6 whitespace-nowrap"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 px-8 pb-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Ultra-Modern Taxonomy Tree */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl">
                        <TreePine className="w-8 h-8 text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Taxonomic Explorer</h2>
                        <p className="text-slate-300">Interactive classification tree</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Layers className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/10 rounded-lg animate-pulse" />
                            <div className="h-3 bg-white/5 rounded-lg animate-pulse w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredTaxonomyTree ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                      {searchTerm && (
                        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <p className="text-blue-300 text-sm">
                            Showing results for: <span className="font-semibold">"{searchTerm}"</span>
                          </p>
                        </div>
                      )}
                      {renderTaxonomyLevel(filteredTaxonomyTree)}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl" />
                        </div>
                        <div className="relative z-10">
                          <TreePine className="w-20 h-20 text-slate-400 mx-auto mb-6" />
                          <h3 className="text-2xl font-bold text-white mb-3">
                            {searchTerm ? 'No Results Found' : 'No Data Available'}
                          </h3>
                          <p className="text-slate-400 max-w-md mx-auto">
                            {searchTerm 
                              ? `No species or taxonomy found matching "${searchTerm}". Try adjusting your search or filters.`
                              : 'Taxonomy data is currently being loaded or unavailable'
                            }
                          </p>
                          {searchTerm && (
                            <Button 
                              onClick={() => {
                                setSearchTerm('');
                                setConservationFilter('all');
                                setHabitatFilter('all');
                              }}
                              className="mt-4 bg-blue-600 hover:bg-blue-700"
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
