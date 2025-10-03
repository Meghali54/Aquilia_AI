import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronDown, 
  ChevronRight, 
  TreePine, 
  Search, 
  Filter,
  BookOpen,
  Globe,
  Eye,
  BarChart3,
  Info,
  MapPin,
  Waves,
  Fish,
  Heart,
  Shield,
  AlertTriangle,
  Download,
  Share2,
  Grid3X3,
  Star,
  Microscope,
  Camera,
  Layers,
  Zap,
  Target,
  TrendingUp,
  Brain,
  Sparkles,
  Activity,
  Database,
  Compass,
  Award,
  FileText,
  Users,
  Clock,
  Bookmark,
  Play,
  ArrowRight,
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { cn } from '../lib/utils';

interface TaxonomyNode {
  id: string;
  name: string;
  rank: string;
  description: string;
  imageUrl?: string;
  conservationStatus?: string;
  habitat?: string;
  distribution?: string;
  characteristics?: string[];
  commonName?: string;
  scientificClassification?: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  children?: TaxonomyNode[];
}

// Enhanced mock data with stunning marine life taxonomy
const mockTaxonomyData: TaxonomyNode = {
  id: 'marine-life',
  name: 'Marine Life Kingdom',
  rank: 'domain',
  description: 'The magnificent realm of ocean life - from microscopic plankton to colossal whales',
  imageUrl: '/api/placeholder/800/600',
  conservationStatus: 'stable',
  habitat: 'All marine environments across the globe',
  distribution: 'Global ocean coverage - Atlantic, Pacific, Indian, Arctic, Southern',
  characteristics: ['Biodiversity Hotspot', 'Adaptive Evolution', 'Complex Ecosystems', 'Interconnected Food Webs'],
  children: [
    {
      id: 'vertebrates',
      name: 'Marine Vertebrates',
      rank: 'supergroup',
      description: 'The ocean\'s most intelligent and charismatic inhabitants',
      imageUrl: '/api/placeholder/600/400',
      conservationStatus: 'varies',
      habitat: 'From surface waters to deep ocean trenches',
      distribution: 'Global marine distribution',
      characteristics: ['Complex Nervous Systems', 'Advanced Behaviors', 'Sophisticated Communication', 'Parental Care'],
      children: [
        {
          id: 'marine-mammals',
          name: 'Marine Mammals',
          rank: 'class',
          description: 'Whales, dolphins, seals - the ocean\'s gentle giants and acrobats',
          imageUrl: '/api/placeholder/500/350',
          conservationStatus: 'threatened',
          habitat: 'Surface waters, deep diving zones, polar regions',
          distribution: 'All oceans from Arctic to Antarctic',
          characteristics: ['Warm-blooded', 'Air-breathing', 'Live birth', 'Complex social behaviors', 'Echolocation'],
          children: [
            {
              id: 'cetaceans',
              name: 'Cetaceans (Whales & Dolphins)',
              rank: 'order',
              description: 'The ocean\'s most intelligent beings - masters of sound and society',
              imageUrl: '/api/placeholder/450/300',
              conservationStatus: 'varies',
              habitat: 'Open ocean, coastal waters, deep sea canyons',
              distribution: 'All world oceans',
              characteristics: ['Advanced Intelligence', 'Echolocation', 'Complex Songs', 'Pod Structures', 'Cultural Learning'],
              children: [
                {
                  id: 'blue-whale',
                  name: 'Balaenoptera musculus',
                  rank: 'species',
                  description: 'Blue Whale - The largest animal ever known to have lived on Earth',
                  imageUrl: '/api/placeholder/400/250',
                  conservationStatus: 'endangered',
                  habitat: 'Open ocean, feeding in polar waters',
                  distribution: 'All oceans, migrate between feeding and breeding grounds',
                  characteristics: ['Up to 30m length', '200 ton weight', 'Heart size of small car', 'Songs travel 1000 miles'],
                  commonName: 'Blue Whale',
                  scientificClassification: {
                    kingdom: 'Animalia',
                    phylum: 'Chordata',
                    class: 'Mammalia',
                    order: 'Cetacea',
                    family: 'Balaenopteridae',
                    genus: 'Balaenoptera',
                    species: 'B. musculus'
                  }
                },
                {
                  id: 'orca',
                  name: 'Orcinus orca',
                  rank: 'species',
                  description: 'Orca - The apex predator with extraordinary intelligence',
                  imageUrl: '/api/placeholder/400/250',
                  conservationStatus: 'stable',
                  habitat: 'All marine environments from polar to tropical',
                  distribution: 'Global distribution in all oceans',
                  characteristics: ['Matriarchal societies', 'Cultural traditions', 'Cooperative hunting', 'Dialect communication'],
                  commonName: 'Killer Whale / Orca',
                  scientificClassification: {
                    kingdom: 'Animalia',
                    phylum: 'Chordata',
                    class: 'Mammalia',
                    order: 'Cetacea',
                    family: 'Delphinidae',
                    genus: 'Orcinus',
                    species: 'O. orca'
                  }
                }
              ]
            }
          ]
        },
        {
          id: 'marine-fish',
          name: 'Marine Fish',
          rank: 'class',
          description: 'The most diverse group of vertebrates - masters of aquatic life',
          imageUrl: '/api/placeholder/500/350',
          conservationStatus: 'stable',
          habitat: 'All marine environments from tide pools to abyssal plains',
          distribution: 'Global ocean distribution',
          characteristics: ['Gills for breathing', 'Streamlined bodies', 'Fins for propulsion', 'Lateral line system'],
          children: [
            {
              id: 'sharks-rays',
              name: 'Elasmobranchii (Sharks & Rays)',
              rank: 'class',
              description: 'Ancient predators with cartilaginous skeletons - 400 million years of evolution',
              imageUrl: '/api/placeholder/450/300',
              conservationStatus: 'threatened',
              habitat: 'All marine environments from shallows to deep sea',
              distribution: 'Global distribution in all oceans',
              characteristics: ['Cartilaginous skeleton', 'Multiple gill slits', 'Electroreception', 'Placoid scales'],
              children: [
                {
                  id: 'great-white',
                  name: 'Carcharodon carcharias',
                  rank: 'species',
                  description: 'Great White Shark - The ocean\'s most efficient predator',
                  imageUrl: '/api/placeholder/400/250',
                  conservationStatus: 'vulnerable',
                  habitat: 'Coastal and offshore waters, temperate seas',
                  distribution: 'Temperate coastal waters worldwide',
                  characteristics: ['6m maximum length', 'Powerful bite force', 'Excellent vision', 'Counter-current heating'],
                  commonName: 'Great White Shark',
                  scientificClassification: {
                    kingdom: 'Animalia',
                    phylum: 'Chordata',
                    class: 'Elasmobranchii',
                    order: 'Lamniformes',
                    family: 'Lamnidae',
                    genus: 'Carcharodon',
                    species: 'C. carcharias'
                  }
                },
                {
                  id: 'manta-ray',
                  name: 'Mobula birostris',
                  rank: 'species',
                  description: 'Giant Manta Ray - Gentle giant of the open ocean',
                  imageUrl: '/api/placeholder/400/250',
                  conservationStatus: 'vulnerable',
                  habitat: 'Open ocean, coastal waters, cleaning stations',
                  distribution: 'Tropical and subtropical waters worldwide',
                  characteristics: ['7m wingspan', 'Filter feeding', 'Acrobatic jumps', 'High intelligence'],
                  commonName: 'Giant Manta Ray',
                  scientificClassification: {
                    kingdom: 'Animalia',
                    phylum: 'Chordata',
                    class: 'Elasmobranchii',
                    order: 'Myliobatiformes',
                    family: 'Mobulidae',
                    genus: 'Mobula',
                    species: 'M. birostris'
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'invertebrates',
      name: 'Marine Invertebrates',
      rank: 'supergroup',
      description: 'The foundation of marine life - incredible diversity without backbones',
      imageUrl: '/api/placeholder/600/400',
      conservationStatus: 'stable',
      habitat: 'Every marine environment from surface to deepest trenches',
      distribution: 'Universal marine distribution',
      characteristics: ['Incredible Diversity', 'Unique Body Plans', 'Ecosystem Engineers', 'Ancient Lineages'],
      children: [
        {
          id: 'cnidarians',
          name: 'Cnidarians',
          rank: 'phylum',
          description: 'Corals, jellyfish, anemones - builders and drifters of the sea',
          imageUrl: '/api/placeholder/500/350',
          conservationStatus: 'threatened',
          habitat: 'All marine environments, coral reefs, open ocean',
          distribution: 'Worldwide marine distribution',
          characteristics: ['Stinging cells', 'Radial symmetry', 'Two body forms', 'Reef builders'],
          children: [
            {
              id: 'hard-corals',
              name: 'Scleractinia (Hard Corals)',
              rank: 'order',
              description: 'The architects of the most biodiverse marine ecosystems',
              imageUrl: '/api/placeholder/450/300',
              conservationStatus: 'critically-endangered',
              habitat: 'Shallow tropical waters with high light penetration',
              distribution: 'Tropical coral reef regions worldwide',
              characteristics: ['Calcium carbonate skeletons', 'Zooxanthellae symbiosis', 'Colonial growth', 'Reef construction'],
              children: [
                {
                  id: 'staghorn-coral',
                  name: 'Acropora cervicornis',
                  rank: 'species',
                  description: 'Staghorn Coral - Fast-growing reef pioneer',
                  imageUrl: '/api/placeholder/400/250',
                  conservationStatus: 'critically-endangered',
                  habitat: 'Shallow reef environments, 1-30m depth',
                  distribution: 'Caribbean Sea and western Atlantic',
                  characteristics: ['Branching growth form', 'Rapid growth rate', 'Fragmentation reproduction', 'Bleaching sensitive'],
                  commonName: 'Staghorn Coral',
                  scientificClassification: {
                    kingdom: 'Animalia',
                    phylum: 'Cnidaria',
                    class: 'Anthozoa',
                    order: 'Scleractinia',
                    family: 'Acroporidae',
                    genus: 'Acropora',
                    species: 'A. cervicornis'
                  }
                }
              ]
            }
          ]
        },
        {
          id: 'mollusks',
          name: 'Mollusks',
          rank: 'phylum',
          description: 'Soft-bodied masters - from tiny snails to giant squids',
          imageUrl: '/api/placeholder/500/350',
          conservationStatus: 'stable',
          habitat: 'All marine environments',
          distribution: 'Global marine distribution',
          characteristics: ['Soft bodies', 'Muscular foot', 'Mantle cavity', 'Shell diversity'],
          children: [
            {
              id: 'cephalopods',
              name: 'Cephalopods',
              rank: 'class',
              description: 'Octopuses, squids, cuttlefish - the ocean\'s most intelligent invertebrates',
              imageUrl: '/api/placeholder/450/300',
              conservationStatus: 'stable',
              habitat: 'Benthic and pelagic environments',
              distribution: 'All oceans',
              characteristics: ['Advanced intelligence', 'Chromatophores', 'Jet propulsion', 'Problem-solving'],
              children: [
                {
                  id: 'giant-pacific-octopus',
                  name: 'Enteroctopus dofleini',
                  rank: 'species',
                  description: 'Giant Pacific Octopus - Largest octopus species',
                  imageUrl: '/api/placeholder/400/250',
                  conservationStatus: 'stable',
                  habitat: 'Rocky reefs and soft sediments, 0-2000m',
                  distribution: 'North Pacific Ocean',
                  characteristics: ['9m arm span', 'Exceptional intelligence', 'Tool use', 'Individual personalities'],
                  commonName: 'Giant Pacific Octopus',
                  scientificClassification: {
                    kingdom: 'Animalia',
                    phylum: 'Mollusca',
                    class: 'Cephalopoda',
                    order: 'Octopoda',
                    family: 'Enteroctopodidae',
                    genus: 'Enteroctopus',
                    species: 'E. dofleini'
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'marine-plants',
      name: 'Marine Flora',
      rank: 'kingdom',
      description: 'The ocean\'s primary producers - from microscopic algae to giant kelp forests',
      imageUrl: '/api/placeholder/600/400',
      conservationStatus: 'stable',
      habitat: 'Photic zones of oceans, coastal waters',
      distribution: 'Global distribution where light penetrates',
      characteristics: ['Primary production', 'Oxygen generation', 'Carbon sequestration', 'Habitat creation'],
      children: [
        {
          id: 'kelp-forests',
          name: 'Kelp Forests',
          rank: 'ecosystem',
          description: 'Underwater forests - the redwoods of the sea',
          imageUrl: '/api/placeholder/500/350',
          conservationStatus: 'stable',
          habitat: 'Cold, nutrient-rich coastal waters',
          distribution: 'Temperate coasts worldwide',
          characteristics: ['Rapid growth', 'Complex structure', 'High biodiversity', 'Carbon storage'],
          children: [
            {
              id: 'giant-kelp',
              name: 'Macrocystis pyrifera',
              rank: 'species',
              description: 'Giant Kelp - The tallest marine organism',
              imageUrl: '/api/placeholder/400/250',
              conservationStatus: 'stable',
              habitat: 'Rocky subtidal zones, 6-40m depth',
              distribution: 'Pacific coasts, Australia, South America',
              characteristics: ['60m maximum length', 'Fastest growing organism', 'Gas-filled floats', 'Biodiversity support'],
              commonName: 'Giant Kelp',
              scientificClassification: {
                kingdom: 'Chromista',
                phylum: 'Ochrophyta',
                class: 'Phaeophyceae',
                order: 'Laminariales',
                family: 'Laminariaceae',
                genus: 'Macrocystis',
                species: 'M. pyrifera'
              }
            }
          ]
        }
      ]
    }
  ]
};

// Custom styles for enhanced animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(1deg); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3); }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes cascade {
    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  
  .floating-animation {
    animation: float 6s ease-in-out infinite;
  }
  
  .pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }
  
  .shimmer-bg {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
  
  .cascade-enter {
    animation: cascade 0.6s ease-out forwards;
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(59, 130, 246, 0.6), rgba(37, 99, 235, 0.8));
    border-radius: 3px;
  }
  
  .species-card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .species-card-hover:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2);
  }
  
  .interactive-node {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .interactive-node:hover {
    transform: translateX(8px) scale(1.02);
  }
  
  .conservation-indicator {
    position: relative;
    overflow: hidden;
  }
  
  .conservation-indicator::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  .conservation-indicator:hover::before {
    left: 100%;
  }
`;

export function TaxonomyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['marine-life']));
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'detailed'>('tree');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulate loading state
  const { data: taxonomyTree, isLoading } = useQuery({
    queryKey: ['taxonomy-data'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      return mockTaxonomyData;
    }
  });

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getConservationColor = (status: string) => {
    switch (status) {
      case 'critically-endangered':
        return { bg: 'from-red-500/20 to-red-600/10', text: 'text-red-400', border: 'border-red-500/30' };
      case 'endangered':
        return { bg: 'from-orange-500/20 to-orange-600/10', text: 'text-orange-400', border: 'border-orange-500/30' };
      case 'vulnerable':
        return { bg: 'from-yellow-500/20 to-yellow-600/10', text: 'text-yellow-400', border: 'border-yellow-500/30' };
      case 'threatened':
        return { bg: 'from-amber-500/20 to-amber-600/10', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'stable':
        return { bg: 'from-green-500/20 to-green-600/10', text: 'text-green-400', border: 'border-green-500/30' };
      default:
        return { bg: 'from-blue-500/20 to-blue-600/10', text: 'text-blue-400', border: 'border-blue-500/30' };
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'domain':
      case 'kingdom':
        return <Globe className="w-5 h-5" />;
      case 'phylum':
        return <TreePine className="w-5 h-5" />;
      case 'class':
        return <Layers className="w-5 h-5" />;
      case 'order':
        return <Target className="w-5 h-5" />;
      case 'family':
        return <Users className="w-5 h-5" />;
      case 'genus':
        return <Fish className="w-5 h-5" />;
      case 'species':
        return <Star className="w-5 h-5" />;
      default:
        return <Microscope className="w-5 h-5" />;
    }
  };

  const renderEnhancedNode = (node: TaxonomyNode, level: number = 0): React.ReactNode => {
    if (!node) return null;

    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const conservationColors = getConservationColor(node.conservationStatus || 'stable');
    const rankIcon = getRankIcon(node.rank);

    return (
      <div key={node.id} className="cascade-enter" style={{ animationDelay: `${level * 0.1}s` }}>
        <div 
          className={cn(
            "interactive-node group p-6 rounded-2xl cursor-pointer border backdrop-blur-xl",
            "bg-gradient-to-r", conservationColors.bg, conservationColors.border,
            "hover:shadow-2xl hover:shadow-blue-500/20",
            isExpanded && "shadow-lg ring-1 ring-white/10"
          )}
          onClick={() => hasChildren && toggleNode(node.id)}
          style={{ marginLeft: `${level * 24}px` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {hasChildren && (
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {isExpanded ? 
                    <ChevronDown className="w-5 h-5 text-white" /> : 
                    <ChevronRight className="w-5 h-5 text-white" />
                  }
                </div>
              )}
              
              <div className={cn(
                "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                conservationColors.bg
              )}>
                {rankIcon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                    {node.rank}
                  </span>
                  <div className={cn(
                    "conservation-indicator px-3 py-1 rounded-full text-xs font-semibold",
                    conservationColors.bg, conservationColors.text
                  )}>
                    {node.conservationStatus?.replace('-', ' ').toUpperCase() || 'STABLE'}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {node.name}
                </h3>
                
                <p className="text-slate-300 text-sm line-clamp-2 mb-2">
                  {node.description}
                </p>
                
                {node.characteristics && (
                  <div className="flex flex-wrap gap-2">
                    {node.characteristics.slice(0, 3).map((char, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-1 bg-white/10 text-white rounded-lg"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {hasChildren && (
                <div className="text-xs bg-white/20 px-3 py-1 rounded-full text-white font-semibold">
                  {node.children?.length} items
                </div>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSpecies(node.id);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="mt-4 space-y-3">
            {node.children?.map((child) => renderEnhancedNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSpeciesProfile = () => {
    if (!selectedSpecies) {
      return (
        <div className="text-center py-20">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <Fish className="w-24 h-24 text-slate-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">Select a Species</h3>
              <p className="text-slate-400 max-w-md mx-auto text-lg">
                Click on any taxonomic group to explore detailed species information
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Find the selected node in the tree
    const findNode = (node: TaxonomyNode, id: string): TaxonomyNode | null => {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child, id);
          if (found) return found;
        }
      }
      return null;
    };

    const species = taxonomyTree ? findNode(taxonomyTree, selectedSpecies) : null;
    if (!species) return null;

    const conservationColors = getConservationColor(species.conservationStatus || 'stable');

    return (
      <div className="space-y-6">
        {/* Species Header */}
        <div className={cn(
          "relative overflow-hidden rounded-3xl p-8 border",
          "bg-gradient-to-br", conservationColors.bg, conservationColors.border
        )}>
          <div className="absolute inset-0 shimmer-bg opacity-20" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    conservationColors.bg
                  )}>
                    {getRankIcon(species.rank)}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                      {species.rank}
                    </span>
                  </div>
                </div>
                
                <h1 className="text-4xl font-black text-white mb-2">
                  {species.commonName || species.name}
                </h1>
                
                <p className="text-xl italic text-slate-300 mb-4">
                  {species.name}
                </p>
                
                <p className="text-slate-300 text-lg leading-relaxed">
                  {species.description}
                </p>
              </div>
              
              <div className="ml-6">
                <img 
                  src={species.imageUrl || '/api/placeholder/300/200'}
                  alt={species.name}
                  className="w-48 h-32 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center">
                <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-1">Conservation</p>
                <p className={cn("text-sm font-bold", conservationColors.text)}>
                  {species.conservationStatus?.replace('-', ' ').toUpperCase() || 'STABLE'}
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center">
                <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-1">Habitat</p>
                <p className="text-sm font-bold text-white truncate">
                  {species.habitat || 'Marine'}
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center">
                <Globe className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-1">Distribution</p>
                <p className="text-sm font-bold text-white truncate">
                  Global
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-1">Rank</p>
                <p className="text-sm font-bold text-white capitalize">
                  {species.rank}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Information Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Characteristics */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl">
                <Microscope className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Characteristics</h3>
            </div>
            
            <div className="space-y-3">
              {species.characteristics?.map((char, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all species-card-hover"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-white font-medium">{char}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scientific Classification */}
          {species.scientificClassification && (
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl">
                  <TreePine className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Classification</h3>
              </div>
              
              <div className="space-y-3">
                {Object.entries(species.scientificClassification).map(([rank, value]) => (
                  <div 
                    key={rank}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all species-card-hover"
                  >
                    <span className="text-slate-400 capitalize font-medium">{rank}:</span>
                    <span className="text-white font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const breadcrumbs = [
    { label: 'Enhanced Taxonomy Explorer' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <style>{customStyles}</style>
      
      {/* Full Screen Layout */}
      <div className={cn(
        "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 relative overflow-hidden",
        isFullscreen && "fixed inset-0 z-50"
      )}>
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-3xl floating-animation" />
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-teal-500/30 to-transparent rounded-full blur-3xl floating-animation" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-3xl floating-animation" style={{animationDelay: '4s'}} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl floating-animation" style={{animationDelay: '6s'}} />
        </div>
        
        {/* Header Section */}
        <div className="relative z-10 px-8 pt-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-3xl backdrop-blur-xl border border-white/10 pulse-glow">
                  <Microscope className="w-16 h-16 text-blue-400" />
                </div>
                <div className="text-left">
                  <h1 className="text-7xl font-black bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                    Marine Taxonomy
                  </h1>
                  <p className="text-3xl text-slate-300 font-light">
                    Interactive Species Classification & Discovery Platform
                  </p>
                </div>
              </div>
              
              {/* Advanced Control Panel */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <Button 
                  size="lg" 
                  variant={viewMode === 'tree' ? 'default' : 'outline'}
                  className={cn(
                    "px-6 py-3 text-base rounded-2xl transition-all duration-300",
                    viewMode === 'tree' ? 
                    "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-2xl" :
                    "border-white/30 text-white hover:bg-white/10 backdrop-blur-xl"
                  )}
                  onClick={() => setViewMode('tree')}
                >
                  <TreePine className="w-5 h-5 mr-2" />
                  Tree View
                </Button>
                
                <Button 
                  size="lg" 
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  className={cn(
                    "px-6 py-3 text-base rounded-2xl transition-all duration-300",
                    viewMode === 'grid' ? 
                    "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-2xl" :
                    "border-white/30 text-white hover:bg-white/10 backdrop-blur-xl"
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-5 h-5 mr-2" />
                  Grid View
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl px-6 py-3 text-base rounded-2xl"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5 mr-2" /> : <Maximize2 className="w-5 h-5 mr-2" />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl px-6 py-3 text-base rounded-2xl"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export Data
                </Button>
              </div>
              
              {/* Enhanced Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-2xl rounded-2xl p-6 border border-blue-500/20 pulse-glow">
                  <div className="text-center">
                    <Fish className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <p className="text-blue-300 font-semibold mb-1">Species</p>
                    <p className="text-2xl font-black text-white">2,847</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 backdrop-blur-2xl rounded-2xl p-6 border border-teal-500/20 pulse-glow" style={{animationDelay: '0.5s'}}>
                  <div className="text-center">
                    <TreePine className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                    <p className="text-teal-300 font-semibold mb-1">Families</p>
                    <p className="text-2xl font-black text-white">156</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-2xl rounded-2xl p-6 border border-emerald-500/20 pulse-glow" style={{animationDelay: '1s'}}>
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                    <p className="text-emerald-300 font-semibold mb-1">Ecosystems</p>
                    <p className="text-2xl font-black text-white">89</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-2xl rounded-2xl p-6 border border-purple-500/20 pulse-glow" style={{animationDelay: '1.5s'}}>
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <p className="text-purple-300 font-semibold mb-1">Endangered</p>
                    <p className="text-2xl font-black text-white">234</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-2xl rounded-2xl p-6 border border-yellow-500/20 pulse-glow" style={{animationDelay: '2s'}}>
                  <div className="text-center">
                    <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <p className="text-yellow-300 font-semibold mb-1">Discovered</p>
                    <p className="text-2xl font-black text-white">+127</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Search Section */}
        <div className="relative z-10 px-8 mb-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                <div className="flex-1 relative">
                  <Search className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search marine species, families, or characteristics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-16 text-lg bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-2xl w-full"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="w-56 h-16 bg-white/5 border-white/10 text-white backdrop-blur-xl hover:bg-white/10 rounded-2xl">
                      <SelectValue placeholder="Conservation Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-xl">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="endangered">Endangered</SelectItem>
                      <SelectItem value="threatened">Threatened</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button className="h-16 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 rounded-2xl px-8">
                    <Filter className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="relative z-10 px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              
              {/* Enhanced Taxonomy Tree */}
              <div className="xl:col-span-3 space-y-6">
                <div className="bg-gradient-to-br from-slate-900/90 to-blue-900/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                  <div className="p-8 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl pulse-glow">
                          <TreePine className="w-10 h-10 text-purple-400" />
                        </div>
                        <div>
                          <h2 className="text-4xl font-bold text-white mb-1">Taxonomic Explorer</h2>
                          <p className="text-slate-300 text-lg">Interactive classification tree with real-time exploration</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                          <Layers className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {isLoading ? (
                      <div className="space-y-6">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl animate-pulse">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl" />
                            <div className="flex-1 space-y-3">
                              <div className="h-6 bg-white/10 rounded-lg" />
                              <div className="h-4 bg-white/5 rounded-lg w-2/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : taxonomyTree ? (
                      <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar">
                        {renderEnhancedNode(taxonomyTree)}
                      </div>
                    ) : (
                      <div className="text-center py-20">
                        <TreePine className="w-24 h-24 text-slate-400 mx-auto mb-6" />
                        <h3 className="text-3xl font-bold text-white mb-4">No Data Available</h3>
                        <p className="text-slate-400 text-lg">Taxonomy data is currently being loaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Species Profile Panel */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-slate-900/90 to-teal-900/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                  <div className="p-8 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl pulse-glow">
                        <Fish className="w-10 h-10 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold text-white mb-1">Species Profile</h2>
                        <p className="text-slate-300 text-lg">Detailed biological information & analysis</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 max-h-[700px] overflow-y-auto custom-scrollbar">
                    {renderSpeciesProfile()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TaxonomyPage;