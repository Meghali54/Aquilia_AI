import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl", 
    xl: "text-3xl"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          key="oceanus-logo-v2"
        >
          <defs>
            {/* Ocean gradient */}
            <linearGradient id="oceanGradientV2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            
            {/* Wave gradient */}
            <linearGradient id="waveGradientV2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.6" />
            </linearGradient>
            
            {/* Circular clipping mask */}
            <clipPath id="circleClipV2">
              <circle cx="24" cy="24" r="20" />
            </clipPath>
          </defs>
          
          {/* Main circular container */}
          <circle cx="24" cy="24" r="20" fill="url(#oceanGradientV2)" />
          
          {/* Ocean waves - clipped to stay inside circle */}
          <g clipPath="url(#circleClipV2)">
            <path
              d="M4 30 Q12 28, 20 30 T36 30 T44 30 V44 H4 Z"
              fill="url(#waveGradientV2)"
            />
            <path
              d="M4 34 Q16 32, 28 34 T44 34 V44 H4 Z"
              fill="#0891b2"
              fillOpacity="0.7"
            />
          </g>
          
          {/* Central "O" with clean design */}
          <circle cx="24" cy="24" r="10" fill="none" stroke="#ffffff" strokeWidth="3" strokeOpacity="0.9" />
          <circle cx="24" cy="24" r="6" fill="#ffffff" fillOpacity="0.15" />
          
          {/* Marine elements - NO BUBBLES */}
          <g opacity="1">
            {/* Large Fish symbol */}
            <path
              d="M12 18 Q16 16, 20 18 Q18 20, 16 20 Q14 20, 12 18 Z"
              fill="#10b981"
            />
            <path d="M20 18 L24 16 L24 20 Z" fill="#059669" />
            <circle cx="15" cy="18" r="1" fill="#ffffff" opacity="0.9" />
            
            {/* Large Starfish - NO circles */}
            <g transform="translate(32, 14)">
              <path d="M0 -3 L1 -1 L3 0 L1 1 L0 3 L-1 1 L-3 0 L-1 -1 Z" fill="#8b5cf6" />
              <path d="M0 -2 L0.5 -0.5 L2 0 L0.5 0.5 L0 2 L-0.5 0.5 L-2 0 L-0.5 -0.5 Z" fill="#a855f7" />
            </g>
            
            {/* Seahorse - detailed */}
            <g transform="translate(36, 20)">
              <path d="M0 0 Q1 -2, 0 -4 Q-1 -3, 0 -2 Q1 -1, 0 0 Q0.5 1, 0 2 Q-0.5 1.5, 0 1" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
              <path d="M0 -3 L0.5 -3.5 L0 -4" stroke="#8b5cf6" strokeWidth="1" fill="none" />
            </g>
            
            {/* Coral Tree */}
            <g transform="translate(14, 32)">
              <path d="M0 6 Q1 4, 2 6 Q3 4, 4 6 Q5 4, 6 6 V8 H0 Z" fill="#ff6b6b" />
              <path d="M1 6 Q2 2, 3 6" stroke="#ff4757" strokeWidth="1" fill="none" />
              <path d="M3 6 Q4 2, 5 6" stroke="#ff4757" strokeWidth="1" fill="none" />
            </g>
            
            {/* Seaweed Forest */}
            <g transform="translate(8, 24)">
              <path d="M0 12 Q2 10, 0 8 Q-2 6, 0 4 Q2 2, 0 0" stroke="#2ed573" strokeWidth="2" fill="none" />
              <path d="M3 12 Q5 9, 3 6 Q1 4, 3 2 Q5 0, 3 -2" stroke="#26d0ce" strokeWidth="1.5" fill="none" />
            </g>
            
            {/* Shell Collection */}
            <g transform="translate(36, 30)">
              <path d="M0 3 Q2 0, 4 3 Q3 2, 2 3 Q1 2, 0 3" fill="#ffa502" />
              <path d="M2 3 L2 0" stroke="#ff6348" strokeWidth="1" />
              <path d="M1 2 L3 2" stroke="#ff6348" strokeWidth="0.5" />
            </g>
            
            {/* Wave Pattern */}
            <path d="M34 16 Q36 15, 38 16 Q40 17, 42 16 Q44 15, 46 16" stroke="#74b9ff" strokeWidth="2" fill="none" />
          </g>
        </svg>
      </div>
      
      {showText && (
        <div>
          <h1 className={cn("font-bold text-primary leading-tight", textSizeClasses[size])}>
            Oceanus
          </h1>
          <p className="text-xs text-muted-foreground leading-tight">
            Marine Data Platform
          </p>
        </div>
      )}
    </div>
  );
}