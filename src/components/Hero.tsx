// import { useState, useEffect } from 'react';
// import { ArrowRight } from 'lucide-react';
// import ResponsiveImage from './ui/ResponsiveImage';
// import { scheduleAtMidnight, calculateDaysLeft as utilsCalculateDaysLeft } from '@/utils/dateUtils';
// import { useReactQueryWebsiteSettings } from '@/hooks/useReactQueryWebsiteSettings';

// // Beautiful brand-themed loading skeleton
// const HeroBrandSkeleton = () => (
//   <div className="absolute inset-0 bg-gradient-to-br from-navy via-terracotta/20 to-navy overflow-hidden">
//     {/* Animated gradient overlay */}
//     <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-black/30 to-transparent" />
    
//     {/* Subtle moving highlights */}
//     <div className="absolute inset-0 opacity-30">
//       <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-terracotta/20 rounded-full blur-3xl animate-pulse" />
//       <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gold/20 rounded-full blur-2xl animate-pulse" 
//            style={{ animationDelay: '1s' }} />
//       <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-terracotta/30 rounded-full blur-xl animate-pulse" 
//            style={{ animationDelay: '2s' }} />
//     </div>
    
//     {/* Subtle texture pattern */}
//     <div className="absolute inset-0 opacity-10"
//          style={{
//            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
//                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
//            backgroundSize: '50px 50px'
//          }} />
         
//     {/* Bottom gradient to match real image overlay */}
//     <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/60 to-navy/40" />
//   </div>
// );

// const Hero = () => {
//   const [daysLeft, setDaysLeft] = useState<number | null>(null);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   // Use our React Query powered hook for settings
//   const {
//     settings,
//     isLoading
//   } = useReactQueryWebsiteSettings();

//   // Auto-hide skeleton after 2 seconds to ensure smooth UX
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setImageLoaded(true);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);
  
//   useEffect(() => {
//     if (settings?.registration_close_date) {
//       const days = utilsCalculateDaysLeft(settings.registration_close_date);
//       setDaysLeft(days);
//     }
//   }, [settings?.registration_close_date]);

//   // Gradient style for the overlay
//   const gradientStyle = {
//     background: `linear-gradient(to right, 
//       rgba(10, 26, 47, 0.95) 0%,
//       rgba(10, 26, 47, 0.8) 50%,
//       rgba(10, 26, 47, 0.6) 100%
//     )`
//   };

//   // Render days left text
//   const renderDaysLeft = () => {
//     if (isLoading) {
//       return (
//         <div className="animate-pulse">
//           <div className="h-6 w-32 bg-gray-200 rounded"></div>
//         </div>
//       );
//     }

//     if (!settings?.registration_close_date) {
//       return null;
//     }

//     if (daysLeft === 0) {
//       return <span className="text-red-600 font-semibold">Registration Closed</span>;
//     }

//     if (daysLeft === null) {
//       return null;
//     }

//     return (
//       <span className="text-terracotta font-semibold">
//         {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left to register
//       </span>
//     );
//   };

//   return (
//     <section className="relative min-h-screen bg-navy text-white">
//       {/* Optimized background image loading */}
//       <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
//         {!imageLoaded && <HeroBrandSkeleton />}
//         <ResponsiveImage 
//           alt="Luxury villa experience setting"
//           className="h-full w-full object-cover"
//           loading="eager"
//           priority={true}
//           dynamicKey="hero-background"
//           sizes="100vw"
//         />
//       </div>
      
//       {/* Gradient Overlay */}
//       <div 
//         className="absolute inset-0"
//         style={gradientStyle}
//       />

//       {/* Hero Content - Optimized for LCP */}
//       <div className="container px-4 sm:px-6 py-24 sm:py-32 mx-auto relative z-10">
//         <div className="max-w-2xl flex flex-col gap-6 sm:gap-8">
//           {/* Critical content - Load first */}
//           <div className="animate-fade-up">
//             <h1 className="text-center sm:text-left sm:text-4xl md:text-6xl font-playfair font-bold tracking-tight mb-3 sm:mb-4 text-4xl">
//               Where Ambition
//               <br />
//               Finds Its Tribe
//             </h1>

//             <p className="text-center sm:text-left sm:text-lg md:text-xl text-gray-200 text-base">
//               Surround yourself with the right people
//             </p>
//           </div>

//           {/* Secondary content - Load after critical content */}
//           <div className="animate-fade-up flex flex-col gap-6 sm:gap-8">
//             <div className="flex justify-center sm:justify-start">
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
//                 <p className="text-sm md:text-base text-gray-300 mb-1">Villa Registrations:</p>
//                 <div className="text-xl font-mono">
//                   {renderDaysLeft()}
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
import { motion } from 'framer-motion';
import ResponsiveImage from './ui/ResponsiveImage';
import { calculateDaysLeft as utilsCalculateDaysLeft } from '@/utils/dateUtils';
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
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const ctaVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const daysLeftVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Use our React Query powered hook for settings
  const {
    settings,
    isLoading
  } = useReactQueryWebsiteSettings();

  // Auto-hide skeleton after 2 seconds to ensure smooth UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (settings?.registration_close_date) {
      const days = utilsCalculateDaysLeft(settings.registration_close_date);
      setDaysLeft(days);
    }
  }, [settings?.registration_close_date]);

  // Gradient style for the overlay
  const gradientStyle = {
    background: `linear-gradient(to right, 
      rgba(10, 26, 47, 0.95) 0%,
      rgba(10, 26, 47, 0.8) 50%,
      rgba(10, 26, 47, 0.6) 100%
    )`
  };

  // Render days left text
  const renderDaysLeft = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
      );
    }

    if (!settings?.registration_close_date) {
      return null;
    }

    if (daysLeft === 0) {
      return <span className="text-red-600 font-semibold">Registration Closed</span>;
    }

    if (daysLeft === null) {
      return null;
    }

    return (
      <span className="text-terracotta font-semibold">
        {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left to register
      </span>
    );
  };

  return (
    <section className="relative min-h-screen bg-navy text-white">
      {/* Optimized background image loading */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {!imageLoaded && <HeroBrandSkeleton />}
        <ResponsiveImage 
          alt="Luxury villa experience setting"
          className="h-full w-full object-cover"
          loading="eager"
          priority={true}
          dynamicKey="hero-background"
          sizes="100vw"
        />
      </motion.div>
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={gradientStyle}
      />

      {/* Hero Content - Optimized for LCP */}
      <motion.div 
        className="container px-4 sm:px-6 py-24 sm:py-32 mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-2xl flex flex-col gap-6 sm:gap-8">
          {/* Critical content - Load first */}
          <div>
            <motion.h1 
              className="text-center sm:text-left sm:text-4xl md:text-6xl font-playfair font-bold tracking-tight mb-3 sm:mb-4 text-4xl"
              variants={titleVariants}
            >
              Where Ambition
              <br />
              Finds Its Tribe
            </motion.h1>

            <motion.p 
              className="text-center sm:text-left sm:text-lg md:text-xl text-gray-200 text-base"
              variants={subtitleVariants}
            >
              Surround yourself with the right people
            </motion.p>
          </div>

          {/* Secondary content - Load after critical content */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <motion.div 
              className="flex justify-center sm:justify-start"
              variants={ctaVariants}
            >
              <a 
                href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 sm:px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-base sm:text-lg font-medium w-fit flex items-center gap-2"
              >
                The Frat Villa Entry <ArrowRight size={20} />
              </a>
            </motion.div>
            
            <motion.div 
              className="text-center sm:text-left"
              variants={daysLeftVariants}
            >
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 sm:py-4 inline-block w-fit">
                <p className="text-sm md:text-base text-gray-300 mb-1">Villa Registrations:</p>
                <div className="text-xl font-mono">
                  {renderDaysLeft()}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;