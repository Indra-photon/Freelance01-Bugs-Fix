
// import * as React from "react"

// const MOBILE_BREAKPOINT = 768

// export function useIsMobile() {
//   const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

//   React.useEffect(() => {
//     const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
//     const onChange = () => {
//       setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
//     }
//     mql.addEventListener("change", onChange)
//     setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
//     return () => mql.removeEventListener("change", onChange)
//   }, [])

//   return !!isMobile
// }

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(() => {
    // Initialize with actual value if window is available (client-side)
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return undefined; // SSR case
  })

  React.useEffect(() => {
    // Only set up listener after initial mount
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      console.log(`📱 [useIsMobile] Viewport changed:`, {
        oldValue: isMobile,
        newValue: newIsMobile,
        innerWidth: window.innerWidth,
        timestamp: new Date().toISOString()
      });
      setIsMobile(newIsMobile);
    }
    
    // Set initial value if not already set
    if (isMobile === undefined) {
      const initialValue = window.innerWidth < MOBILE_BREAKPOINT;
      console.log(`📱 [useIsMobile] Initial detection:`, {
        initialValue,
        innerWidth: window.innerWidth,
        timestamp: new Date().toISOString()
      });
      setIsMobile(initialValue);
    }
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, []) // Remove isMobile from dependency array

  return isMobile
}