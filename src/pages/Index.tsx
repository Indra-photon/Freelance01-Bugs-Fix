
// import { lazy, Suspense, useEffect } from 'react';
// import Navigation from '../components/Navigation';
// import Hero from '../components/Hero';
// import Footer from '../components/Footer';
// import { initializeAnalytics } from '@/utils/analyticsInitializer';
// import { trackPageView } from '@/services/analyticsService';
// import { updateDaysLeftCount } from '@/services/website-settings';
// import { scheduleAtMidnight } from '@/utils/dateUtils';

// // Lazy load components that are below the fold
// const NavalQuote = lazy(() => import('../components/NavalQuote'));
// const VillaLab = lazy(() => import('../components/VillaLab'));
// const OurValues = lazy(() => import('../components/OurValues'));
// const HowItWorks = lazy(() => import('../components/HowItWorks'));

// // Simple loading fallback with better UX
// const LoadingFallback = () => (
//   <div className="h-48 flex items-center justify-center bg-gray-50 animate-pulse">
//     <div className="w-8 h-8 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
//   </div>
// );

// const Index = () => {
//   // Initialize analytics and performance monitoring
//   useEffect(() => {
//     // Initialize analytics tracking
//     initializeAnalytics();
    
//     // Track this specific page view
//     trackPageView('/');
    
//     // Initial days left update
//     console.log('Running initial days left update check');
//     updateDaysLeftCount().then(success => {
//       if (success) {
//         console.log('Successfully updated days left count on page load');
//       } else {
//         console.error('Failed to update days left count on page load');
//       }
//     });
    
//     // Set up automatic update of days left count at midnight IST
//     const autoUpdateCleanup = scheduleAtMidnight(() => {
//       console.log('Automatically updating days left count at midnight IST');
//       updateDaysLeftCount().then(success => {
//         if (success) {
//           console.log('Successfully updated days left count');
//         } else {
//           console.error('Failed to update days left count');
//         }
//       });
//     }, 'Asia/Kolkata');
    
//     // Return a composite cleanup function
//     return () => {
//       autoUpdateCleanup?.();
//     };
//   }, []);

//   return (
//     <div className="min-h-screen">
//       <Navigation />
//       <Hero />
      
//       {/* Use Intersection Observer to lazy load components */}
//       <Suspense fallback={<LoadingFallback />}>
//         <NavalQuote />
//       </Suspense>
      
//       <Suspense fallback={<LoadingFallback />}>
//         <VillaLab />
//       </Suspense>
      
//       <Suspense fallback={<LoadingFallback />}>
//         <OurValues />
//       </Suspense>
      
//       <Suspense fallback={<LoadingFallback />}>
//         <HowItWorks />
//       </Suspense>
      
//       <Footer />
//     </div>
//   );
// };

// export default Index;

import { lazy, Suspense, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { initializeLightweightAnalytics, trackSimplePageView, updateDaysLeftSimple } from '@/utils/lightweightAnalytics';

// Lazy load components that are below the fold
const NavalQuote = lazy(() => import('../components/NavalQuote'));
const VillaLab = lazy(() => import('../components/VillaLab'));
const OurValues = lazy(() => import('../components/OurValues'));
const HowItWorks = lazy(() => import('../components/HowItWorks'));

// Simple loading fallback with better UX
const LoadingFallback = () => (
  <div className="h-48 flex items-center justify-center bg-gray-50 animate-pulse">
    <div className="w-8 h-8 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
  </div>
);

const Index = () => {
  // Initialize lightweight analytics and performance monitoring
  useEffect(() => {
    // Initialize lightweight analytics tracking (no heavy imports)
    initializeLightweightAnalytics();
    
    // Track this specific page view
    trackSimplePageView('/');
    
    // Simple days left update without heavy dependencies
    updateDaysLeftSimple();
    
    // Set up automatic update at midnight (simplified)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimeout = setTimeout(() => {
      updateDaysLeftSimple();
      
      // Set up daily interval after first midnight
      const dailyInterval = setInterval(() => {
        updateDaysLeftSimple();
      }, 24 * 60 * 60 * 1000);
      
      // Cleanup function will handle this interval
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);
    
    // Cleanup function
    return () => {
      clearTimeout(midnightTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {/* Use Intersection Observer to lazy load components */}
      <Suspense fallback={<LoadingFallback />}>
        <NavalQuote />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <VillaLab />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <OurValues />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <HowItWorks />
      </Suspense>
      
      <Footer />
    </div>
  );
};

export default Index;