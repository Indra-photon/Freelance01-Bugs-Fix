// import { useState, useEffect } from 'react';
// import { ArrowRight } from 'lucide-react';
// import ResponsiveImage from './ui/ResponsiveImage';
// import { scheduleAtMidnight, calculateDaysLeft as utilsCalculateDaysLeft } from '@/utils/dateUtils';
// import { useReactQueryWebsiteSettings } from '@/hooks/useReactQueryWebsiteSettings';

// const Hero = () => {
//   const [daysLeft, setDaysLeft] = useState(0);

//   // Use our React Query powered hook for settings
//   const {
//     settings,
//     isLoading
//   } = useReactQueryWebsiteSettings();
  
//   useEffect(() => {
//     // If we have settings from the database, use them
//     if (settings?.registration_close_date) {
//       // Log the target date for debugging
//       console.log('Registration close date from settings:', settings.registration_close_date);

//       // Define function to calculate and update days left
//       const calculateAndSetDaysLeft = () => {
//         // Use the direct import from utils to avoid any import chain issues
//         const daysRemaining = utilsCalculateDaysLeft(settings.registration_close_date);
//         console.log('Days remaining calculated in Hero:', daysRemaining);
//         setDaysLeft(daysRemaining);
//       };

//       // Calculate initial value
//       calculateAndSetDaysLeft();

//       // Set up a timer to update at midnight IST each day
//       const cleanup = scheduleAtMidnight(calculateAndSetDaysLeft);
//       return cleanup;
//     } else {
//       console.warn('No registration_close_date found in settings');
//     }
//   }, [settings]);

//   // Gradient style for the overlay
//   const gradientStyle = {
//     background: `linear-gradient(to right, 
//       rgba(10, 26, 47, 0.9) 0%,
//       rgba(10, 26, 47, 0.7) 50%,
//       rgba(10, 26, 47, 0.4) 100%
//     )`
//   };

//   return (
//     <section className="min-h-screen flex items-center justify-center bg-navy text-white relative overflow-hidden">
//       {/* Background Image - using dynamicKey to fetch from admin upload */}
//       <div className="absolute inset-0">
//         <ResponsiveImage 
//           alt="Stunning luxury villa with breathtaking views" 
//           className="w-full h-full object-cover" 
//           loading="eager" 
//           fetchPriority="high" 
//           dynamicKey="hero-background" 
//         />
//       </div>
      
//       {/* Gradient Overlay */}
//       <div className="absolute inset-0" style={gradientStyle} />
      
//       {/* Hero Content - Clean and simple */}
//       <div className="container px-4 sm:px-6 py-24 sm:py-32 mx-auto relative z-10">
//         <div className="max-w-2xl flex flex-col gap-6 sm:gap-8">
//           <div>
//             <h1 className="text-center sm:text-left sm:text-4xl md:text-6xl font-playfair font-bold tracking-tight mb-3 sm:mb-4 text-4xl">
//               Where Ambition
//               <br />
//               Finds Its Tribe
//             </h1>

//             <p className="text-center sm:text-left sm:text-lg md:text-xl text-gray-200 text-base">
//               Surround yourself with the right people
//             </p>
//           </div>

//           <div className="animate-fade-up flex flex-col gap-6 sm:gap-8">
//             <div className="text-center">
//               <a 
//                 href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" 
//                 target="_blank" 
//                 rel="noopener noreferrer" 
//                 className="px-6 sm:px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-base sm:text-lg font-medium w-fit flex items-center gap-2"
//               >
//                 The Frat Villa Entry <ArrowRight size={20} />
//               </a>
//             </div>
            
//             <div className="text-center sm:text-left">
//               <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 sm:py-4 inline-block w-fit">
//                 <p className="text-sm md:text-base text-gray-300 mb-1">Villa Registrations close in:</p>
//                 <div className="text-xl font-mono">
//                   {isLoading ? "Loading..." : `${daysLeft} Days`}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { scheduleAtMidnight, calculateDaysLeft as utilsCalculateDaysLeft } from '@/utils/dateUtils';
import { useReactQueryWebsiteSettings } from '@/hooks/useReactQueryWebsiteSettings';

// PERFORMANCE: Separate background image component to not block hero text
const HeroBackgroundImage = () => {
  return (
    <div className="absolute inset-0">
      {/* PERFORMANCE: Use simple img with optimized loading for background */}
      <img 
        src="/lovable-uploads/hero-background.jpg" 
        alt="Stunning luxury villa with breathtaking views"
        className="w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        style={{
          // PERFORMANCE: Ensure image doesn't block layout
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1
        }}
        onLoad={() => {
          // Optional: Add fade-in effect when background loads
          console.log('Hero background loaded');
        }}
      />
    </div>
  );
};

const Hero = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  // PERFORMANCE: Use React Query but don't block hero rendering
  const { settings, isLoading } = useReactQueryWebsiteSettings();
  
  useEffect(() => {
    if (settings?.registration_close_date) {
      console.log('Registration close date from settings:', settings.registration_close_date);

      const calculateAndSetDaysLeft = () => {
        const daysRemaining = utilsCalculateDaysLeft(settings.registration_close_date);
        console.log('Days remaining calculated in Hero:', daysRemaining);
        setDaysLeft(daysRemaining);
      };

      calculateAndSetDaysLeft();
      const cleanup = scheduleAtMidnight(calculateAndSetDaysLeft);
      return cleanup;
    } else {
      console.warn('No registration_close_date found in settings');
    }
  }, [settings]);

  // PERFORMANCE: Inline gradient style to avoid CSS delays
  const gradientStyle = {
    position: 'absolute' as const,
    inset: 0,
    background: `linear-gradient(to right, 
      rgba(10, 26, 47, 0.9) 0%,
      rgba(10, 26, 47, 0.7) 50%,
      rgba(10, 26, 47, 0.4) 100%
    )`,
    zIndex: 1
  };

  return (
    <section 
      className="min-h-screen flex items-center justify-center bg-navy text-white relative overflow-hidden"
      style={{
        // PERFORMANCE: Ensure section renders immediately
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0A1A2F' // Fallback color
      }}
    >
      {/* PERFORMANCE: Background image loads separately, doesn't block text */}
      <HeroBackgroundImage />
      
      {/* PERFORMANCE: Gradient overlay with inline styles for immediate rendering */}
      <div style={gradientStyle} />
      
      {/* PERFORMANCE: Hero content with critical styles inline */}
      <div 
        className="container px-4 sm:px-6 py-24 sm:py-32 mx-auto relative"
        style={{
          // CRITICAL STYLES: Inline for immediate rendering
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '6rem 1rem'
        }}
      >
        <div 
          className="max-w-2xl flex flex-col gap-6 sm:gap-8"
          style={{
            // CRITICAL STYLES: Ensure content area renders immediately
            maxWidth: '42rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <div>
            {/* CRITICAL LCP ELEMENT: Optimized with inline critical styles */}
            <h1 
              className="text-center sm:text-left font-playfair font-bold tracking-tight mb-3 sm:mb-4"
              style={{
                // CRITICAL LCP STYLES: Inline for immediate rendering
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: 'clamp(2rem, 5vw, 4rem)', // Responsive without media queries
                lineHeight: 1.2,
                textAlign: 'center',
                marginBottom: '1rem',
                color: 'white',
                letterSpacing: '-0.025em'
              }}
            >
              Where Ambition
              <br />
              Finds Its Tribe
            </h1>

            <p 
              className="text-center sm:text-left text-gray-200"
              style={{
                // CRITICAL STYLES: Inline for immediate rendering
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                textAlign: 'center',
                color: 'rgba(229, 231, 235, 0.9)',
                lineHeight: 1.6
              }}
            >
              Surround yourself with the right people
            </p>
          </div>

          {/* PERFORMANCE: Animate only after critical content renders */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="text-center">
              <a 
                href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 sm:px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-base sm:text-lg font-medium w-fit flex items-center gap-2"
                style={{
                  // CRITICAL BUTTON STYLES: Inline for immediate rendering
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#E07A5F',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'opacity 0.3s ease'
                }}
              >
                The Frat Villa Entry <ArrowRight size={20} />
              </a>
            </div>
            
            <div className="text-center sm:text-left">
              <div 
                className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 sm:py-4 inline-block w-fit"
                style={{
                  // CRITICAL COUNTDOWN STYLES: Inline for immediate rendering
                  display: 'inline-block',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem'
                }}
              >
                <p 
                  className="text-sm md:text-base text-gray-300 mb-1"
                  style={{ color: 'rgba(209, 213, 219, 0.8)', marginBottom: '0.25rem' }}
                >
                  Villa Registrations close in:
                </p>
                <div 
                  className="text-xl font-mono"
                  style={{ 
                    fontSize: '1.25rem', 
                    fontFamily: 'monospace',
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  {isLoading ? "Loading..." : `${daysLeft} Days`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;