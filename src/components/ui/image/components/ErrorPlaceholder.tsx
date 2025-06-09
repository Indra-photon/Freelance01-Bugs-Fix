
// import React from 'react';

// interface ErrorPlaceholderProps {
//   alt: string;
//   className?: string;
//   width?: number;
//   height?: number;
//   aspectRatio?: number;
//   fallbackSrc?: string | React.ReactNode;
// }

// /**
//  * Error placeholder for when image loading fails
//  */
// export const ErrorPlaceholder = ({ 
//   alt, 
//   className = '', 
//   width, 
//   height, 
//   aspectRatio = 16/9,
//   fallbackSrc = '/placeholder.svg'
// }: ErrorPlaceholderProps) => {
//   return (
//     <div 
//       className={`bg-gray-100 flex items-center justify-center ${className}`}
//       style={{ 
//         aspectRatio: width && height ? `${width}/${height}` : aspectRatio ? `${aspectRatio}` : '16/9',
//         width: width,
//         height: height 
//       }}
//     >
//       {typeof fallbackSrc === 'string' ? (
//         <img 
//           src={fallbackSrc} 
//           alt={`Placeholder for ${alt}`} 
//           className="max-h-full max-w-full p-4 opacity-30 object-contain"
//           width={width}
//           height={height}
//         />
//       ) : (
//         <div className="text-gray-400 text-sm text-center p-4">
//           Image not found
//         </div>
//       )}
//     </div>
//   );
// };

import React from 'react';

interface ErrorPlaceholderProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  fallbackSrc?: string | React.ReactNode;
}

/**
 * Enhanced error placeholder with proper aspect ratio preservation and smooth transitions
 */
export const ErrorPlaceholder = ({ 
  alt, 
  className = '', 
  width, 
  height, 
  aspectRatio = 16/9,
  fallbackSrc = '/placeholder.svg'
}: ErrorPlaceholderProps) => {
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
    overflow: 'hidden'
  };

  return (
    <div 
      className={`aspect-ratio-container bg-gray-50 border-2 border-dashed border-gray-200 ${className}`}
      style={containerStyle}
      role="img"
      aria-label={`Failed to load ${alt}`}
    >
      {/* Background pattern for visual distinction */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />
      
      {/* Content container */}
      <div className="aspect-ratio-content flex items-center justify-center p-4">
        {typeof fallbackSrc === 'string' ? (
          <div className="flex flex-col items-center justify-center space-y-3 max-w-full">
            {/* Fallback image */}
            <img 
              src={fallbackSrc} 
              alt={`Placeholder for ${alt}`} 
              className="max-h-16 max-w-16 opacity-40 object-contain transition-opacity duration-300 hover:opacity-60"
              width={64}
              height={64}
              loading="eager"
            />
            
            {/* Error message */}
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">
                Image unavailable
              </p>
              <p className="text-xs text-gray-300 mt-1">
                {alt}
              </p>
            </div>
          </div>
        ) : (
          // Custom fallback content
          <div className="text-center">
            {fallbackSrc || (
              <>
                <div className="text-gray-400 text-sm font-medium mb-2">
                  Image not found
                </div>
                <p className="text-xs text-gray-300">
                  {alt}
                </p>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Subtle animated border for error indication */}
      <div 
        className="absolute inset-0 border border-red-100 rounded opacity-30"
        style={{ 
          animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      
      {/* Screen reader information */}
      <span className="sr-only">
        Image "{alt}" failed to load. Showing placeholder.
      </span>
    </div>
  );
};