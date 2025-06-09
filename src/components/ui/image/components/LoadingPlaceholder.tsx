
// import React from 'react';

// interface LoadingPlaceholderProps {
//   alt: string;
//   className?: string;
//   width?: number;
//   height?: number;
//   aspectRatio?: number;
//   placeholderSrc?: string; // Tiny image placeholder
//   colorPlaceholder?: string; // Color-based placeholder as ultra-lightweight fallback
// }

// /**
//  * Enhanced loading placeholder for images with progressive loading support
//  * Implements a staged loading approach: color → tiny image → full image
//  */
// export const LoadingPlaceholder = ({ 
//   alt,
//   className = '',
//   width,
//   height,
//   aspectRatio = 16/9,
//   placeholderSrc,
//   colorPlaceholder
// }: LoadingPlaceholderProps) => {
//   // Calculate style
//   const containerStyle: React.CSSProperties = {
//     aspectRatio: width && height ? `${width}/${height}` : aspectRatio ? `${aspectRatio}` : '16/9',
//     width: width,
//     height: height,
//     backgroundColor: '#f3f4f6' // Default background
//   };

//   // If we have a placeholder image, display it with blur effect
//   if (placeholderSrc) {
//     return (
//       <div 
//         className={`relative overflow-hidden ${className}`}
//         style={containerStyle}
//         aria-label={`Loading ${alt}`}
//       >
//         <img 
//           src={placeholderSrc}
//           alt={`Loading preview for ${alt}`}
//           className="w-full h-full object-cover blur-sm scale-110"
//           loading="eager"
//           fetchPriority="high" // Ensure placeholder loads ASAP
//         />
//         <div className="absolute inset-0 bg-gray-200 animate-pulse opacity-30" />
//       </div>
//     );
//   }
  
//   // If we have a color placeholder, use that as background
//   if (colorPlaceholder) {
//     return (
//       <div 
//         className={`relative overflow-hidden ${className}`}
//         style={{
//           ...containerStyle,
//           backgroundImage: `url(${colorPlaceholder})`,
//           backgroundSize: "cover"
//         }}
//         aria-label={`Loading ${alt}`}
//       >
//         <div className="absolute inset-0 animate-pulse opacity-30" />
//       </div>
//     );
//   }
  
//   // Fallback to the standard loading placeholder
//   return (
//     <div 
//       className={`bg-gray-200 animate-pulse ${className}`} 
//       aria-label={`Loading ${alt}`}
//       style={containerStyle}
//     />
//   );
// };

import React from 'react';

interface LoadingPlaceholderProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  placeholderSrc?: string; // Tiny image placeholder
  colorPlaceholder?: string; // Color-based placeholder as ultra-lightweight fallback
}

/**
 * Enhanced loading placeholder with proper aspect ratio preservation and smooth animations
 * Implements a staged loading approach: color → tiny image → full image
 */
export const LoadingPlaceholder = ({ 
  alt,
  className = '',
  width,
  height,
  aspectRatio = 16/9,
  placeholderSrc,
  colorPlaceholder
}: LoadingPlaceholderProps) => {
  // Calculate proper aspect ratio
  const calculatedAspectRatio = width && height 
    ? width / height 
    : aspectRatio;
  
  // Container style with proper aspect ratio preservation
  const containerStyle: React.CSSProperties = {
    aspectRatio: `${calculatedAspectRatio}`,
    width: width || '100%',
    height: height || 'auto',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colorPlaceholder || '#f3f4f6'
  };

  // If we have a placeholder image, display it with enhanced blur effect
  if (placeholderSrc) {
    return (
      <div 
        className={`aspect-ratio-container ${className}`}
        style={containerStyle}
        aria-label={`Loading ${alt}`}
        role="img"
      >
        {/* Tiny placeholder image with blur effect */}
        <img 
          src={placeholderSrc}
          alt={`Loading preview for ${alt}`}
          className="aspect-ratio-content object-cover blur-sm scale-110 transition-opacity duration-300"
          loading="eager"
          fetchPriority="high"
          style={{ 
            filter: 'blur(8px) brightness(1.1)',
            transform: 'scale(1.05)',
            opacity: 0.8
          }}
        />
        
        {/* Animated overlay for loading indication */}
        <div className="absolute inset-0 skeleton-enhanced opacity-20" />
        
        {/* Gradient overlay for better visual hierarchy */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20"
          style={{ mixBlendMode: 'overlay' }}
        />
      </div>
    );
  }
  
  // If we have a color placeholder, use enhanced version
  if (colorPlaceholder) {
    return (
      <div 
        className={`aspect-ratio-container ${className}`}
        style={containerStyle}
        aria-label={`Loading ${alt}`}
        role="img"
      >
        {/* Color-based background */}
        <div 
          className="aspect-ratio-content"
          style={{
            background: `linear-gradient(135deg, ${colorPlaceholder}, ${colorPlaceholder}dd)`,
            filter: 'blur(1px)'
          }}
        />
        
        {/* Enhanced shimmer animation */}
        <div className="absolute inset-0 skeleton-enhanced opacity-30" />
      </div>
    );
  }
  
  // Enhanced fallback skeleton with proper dimensions
  return (
    <div 
      className={`aspect-ratio-container ${className}`}
      style={containerStyle}
      aria-label={`Loading ${alt}`}
      role="img"
    >
      {/* Main skeleton background */}
      <div className="aspect-ratio-content skeleton-enhanced" />
      
      {/* Subtle pulse overlay for better loading indication */}
      <div 
        className="absolute inset-0 bg-white opacity-20"
        style={{ 
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      
      {/* Optional loading text for accessibility */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="sr-only">Loading {alt}</span>
      </div>
    </div>
  );
};