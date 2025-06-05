
import { urlCache } from "../cacheService";

/**
 * Clear URL cache to force fresh URL generation
 */
export const clearImageUrlCache = (): void => {
  console.log('Clearing image URL cache');
  urlCache.clear();
};

/**
 * Clear URL cache for a specific key and all its variants
 */
export const clearImageUrlCacheForKey = (key: string): void => {
  console.log(`Clearing URL cache for key: ${key}`);
  
  // Clear the main key
  urlCache.delete(`url:${key}`);
  urlCache.delete(`placeholder:tiny:${key}`);
  urlCache.delete(`placeholder:color:${key}`);
  
  // Clear mobile/desktop variants
  const baseMobileKey = key.endsWith('-mobile') ? key : `${key}-mobile`;
  const baseDesktopKey = key.endsWith('-mobile') ? key.replace('-mobile', '') : key;
  
  // Clear both mobile and desktop variants
  [baseMobileKey, baseDesktopKey].forEach(variantKey => {
    urlCache.delete(`url:${variantKey}`);
    urlCache.delete(`placeholder:tiny:${variantKey}`);
    urlCache.delete(`placeholder:color:${variantKey}`);
    
    // Clear size variants for both mobile and desktop
    ['small', 'medium', 'large'].forEach(size => {
      urlCache.delete(`url:${variantKey}:${size}`);
    });
    
    // Clear version-specific cache entries
    // Use pattern matching to clear all version variants
    for (const [cacheKey] of urlCache.entries()) {
      if (cacheKey.includes(`url:${variantKey}:v`) || cacheKey.includes(`url:${variantKey}:`)) {
        urlCache.delete(cacheKey);
      }
    }
  });
  
  console.log(`Cache entries for key ${key} and its variants cleared`);
};

/**
 * Clear all mobile/desktop variant caches when viewport changes
 */
export const clearViewportSpecificCache = (): void => {
  console.log('Clearing viewport-specific cache entries');
  
  // Clear all mobile and desktop variant entries
  for (const [cacheKey] of urlCache.entries()) {
    if (cacheKey.includes('-mobile') || cacheKey.includes('url:')) {
      urlCache.delete(cacheKey);
    }
  }
  
  console.log('Viewport-specific cache cleared');
};
