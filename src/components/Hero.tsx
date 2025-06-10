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
import ResponsiveImage from './ui/ResponsiveImage';
import { scheduleAtMidnight, calculateDaysLeft as utilsCalculateDaysLeft } from '@/utils/dateUtils';
import { useReactQueryWebsiteSettings } from '@/hooks/useReactQueryWebsiteSettings';

// Beautiful brand-themed loading skeleton
const HeroBrandSkeleton = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-navy via-terracotta/20 to-navy overflow-hidden">
    {/* Animated gradient overlay */}
    <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-black/30 to-transparent" />
    
    {/* Subtle moving highlights */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-terracotta/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gold/20 rounded-full blur-2xl animate-pulse" 
           style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-terracotta/30 rounded-full blur-xl animate-pulse" 
           style={{ animationDelay: '2s' }} />
    </div>
    
    {/* Subtle texture pattern */}
    <div className="absolute inset-0 opacity-10"
         style={{
           backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
           backgroundSize: '50px 50px'
         }} />
         
    {/* Bottom gradient to match real image overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/60 to-navy/40" />
  </div>
);

const Hero = () => {
  const [daysLeft, setDaysLeft] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use our React Query powered hook for settings
  const {
    settings,
    isLoading
  } = useReactQueryWebsiteSettings();

  // Auto-hide skeleton after 2 seconds to ensure smooth UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
      console.log('🎯 Hero skeleton auto-hidden after 2s');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // If we have settings from the database, use them
    if (settings?.registration_close_date) {
      // Log the target date for debugging
      console.log('Registration close date from settings:', settings.registration_close_date);

      // Define function to calculate and update days left
      const calculateAndSetDaysLeft = () => {
        // Use the direct import from utils to avoid any import chain issues
        const daysRemaining = utilsCalculateDaysLeft(settings.registration_close_date);
        console.log('Days remaining calculated in Hero:', daysRemaining);
        setDaysLeft(daysRemaining);
      };

      // Calculate initial value
      calculateAndSetDaysLeft();

      // Set up a timer to update at midnight IST each day
      const cleanup = scheduleAtMidnight(calculateAndSetDaysLeft);
      return cleanup;
    } else {
      console.warn('No registration_close_date found in settings');
    }
  }, [settings]);

  // Gradient style for the overlay
  const gradientStyle = {
    background: `linear-gradient(to right, 
      rgba(10, 26, 47, 0.9) 0%,
      rgba(10, 26, 47, 0.7) 50%,
      rgba(10, 26, 47, 0.4) 100%
    )`
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-navy text-white relative overflow-hidden">
      {/* BEAUTIFUL LOADING STATE: Brand-themed skeleton */}
      <HeroBrandSkeleton />
      
      {/* Background Image - using dynamicKey to fetch from admin upload */}
      <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
        imageLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <ResponsiveImage 
          alt="Stunning luxury villa with breathtaking views" 
          className="w-full h-full object-cover" 
          loading="eager" 
          fetchPriority="high" 
          dynamicKey="hero-background" 
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0" style={gradientStyle} />
      
      {/* Hero Content - Clean and simple */}
      <div className="container px-4 sm:px-6 py-24 sm:py-32 mx-auto relative z-10">
        <div className="max-w-2xl flex flex-col gap-6 sm:gap-8">
          <div>
            <h1 className="text-center sm:text-left sm:text-4xl md:text-6xl font-playfair font-bold tracking-tight mb-3 sm:mb-4 text-4xl">
              Where Ambition
              <br />
              Finds Its Tribe
            </h1>

            <p className="text-center sm:text-left sm:text-lg md:text-xl text-gray-200 text-base">
              Surround yourself with the right people
            </p>
          </div>

          <div className="animate-fade-up flex flex-col gap-6 sm:gap-8">
            <div className="text-center">
              <a 
                href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 sm:px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-base sm:text-lg font-medium w-fit flex items-center gap-2"
              >
                The Frat Villa Entry <ArrowRight size={20} />
              </a>
            </div>
            
            <div className="text-center sm:text-left">
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 sm:py-4 inline-block w-fit">
                <p className="text-sm md:text-base text-gray-300 mb-1">Villa Registrations close in:</p>
                <div className="text-xl font-mono">
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