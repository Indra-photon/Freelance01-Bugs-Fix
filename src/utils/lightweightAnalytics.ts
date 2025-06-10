/**
 * Lightweight analytics for homepage - no heavy dependencies
 * This replaces the heavy analytics system imports to reduce bundle size
 */

interface PageView {
  path: string;
  timestamp: number;
  sessionId: string;
}

// Generate a simple session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

/**
 * Lightweight page view tracking - stores locally without heavy imports
 */
export const trackSimplePageView = (path: string): void => {
  try {
    const pageView: PageView = {
      path,
      timestamp: Date.now(),
      sessionId: getSessionId()
    };
    
    // Get existing page views
    const existingViews = JSON.parse(localStorage.getItem('lightweight_page_views') || '[]');
    
    // Add new view and keep only last 100 entries to prevent storage bloat
    existingViews.push(pageView);
    const recentViews = existingViews.slice(-100);
    
    // Store back to localStorage
    localStorage.setItem('lightweight_page_views', JSON.stringify(recentViews));
    
    // Simple console logging for development
    console.log(`📊 Page view tracked: ${path}`);
  } catch (error) {
    // Fail silently if localStorage is not available
    console.warn('Could not track page view:', error);
  }
};

/**
 * Initialize lightweight analytics - just sets up basic tracking
 */
export const initializeLightweightAnalytics = (): void => {
  // Track initial page view
  trackSimplePageView(window.location.pathname);
  
  // Set up simple navigation tracking
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  // Override pushState
  history.pushState = function(state, title, url) {
    originalPushState.apply(this, [state, title, url]);
    trackSimplePageView(url?.toString() || window.location.pathname);
  };
  
  // Override replaceState  
  history.replaceState = function(state, title, url) {
    originalReplaceState.apply(this, [state, title, url]);
    trackSimplePageView(url?.toString() || window.location.pathname);
  };
  
  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', () => {
    trackSimplePageView(window.location.pathname);
  });
  
  console.log('🚀 Lightweight analytics initialized');
};

/**
 * Simple days left counter without heavy imports
 */
export const updateDaysLeftSimple = (): void => {
  try {
    // Simple calculation without importing heavy date utilities
    const now = new Date();
    const targetDate = new Date('2024-12-31'); // Adjust this date as needed
    const timeDiff = targetDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Store in localStorage for other components to use
    localStorage.setItem('days_left_count', daysLeft.toString());
    
    console.log(`📅 Days left updated: ${daysLeft}`);
  } catch (error) {
    console.warn('Could not update days left:', error);
  }
};