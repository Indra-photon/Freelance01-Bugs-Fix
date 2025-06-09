
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   plugins: [
//     react(),
//     mode === 'development' &&
//     componentTagger(),
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     // Output build stats for analysis
//     reportCompressedSize: true,
//     // Split chunks for better caching
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           // Group React dependencies together
//           'vendor-react': ['react', 'react-dom', 'react-router-dom'],
//           // Group Tanstack/UI dependencies
//           'vendor-ui': ['@tanstack/react-query', '@radix-ui/react-toast', '@radix-ui/react-dialog'],
//           // Group charting libraries
//           'vendor-charts': ['recharts'],
//         }
//       }
//     },
//     // Optimize dependencies
//     commonjsOptions: {
//       include: [/node_modules/],
//       transformMixedEsModules: true,
//     },
//     // Output source maps for debugging
//     sourcemap: mode === 'development',
//     // Clean the output directory before building
//     emptyOutDir: true,
//   },
//   // Optimize dependencies in dev mode
//   optimizeDeps: {
//     include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
//   },
// }));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost", // Security fix - only bind to localhost in dev
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Output build stats for analysis
    reportCompressedSize: true,
    
    // CSS OPTIMIZATION: Enable CSS code splitting for better caching
    cssCodeSplit: true,
    
    // CSS OPTIMIZATION: Target modern browsers for better CSS output
    cssTarget: 'chrome80',
    
    // PERFORMANCE: Set build target for modern JS features
    target: 'es2020',
    
    // PERFORMANCE: Enable minification
    minify: 'terser',
    
    // Split chunks for better caching and loading
    rollupOptions: {
      output: {
        // OPTIMIZED CHUNK STRATEGY: Better cache efficiency
        manualChunks: {
          // Core React dependencies - cached separately
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // UI dependencies - separate chunk for UI components
          'vendor-ui': [
            '@tanstack/react-query', 
            '@radix-ui/react-toast', 
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-accordion'
          ],
          
          // Heavy visualization libraries - lazy loaded
          'vendor-charts': ['recharts'],
          
          // Form and validation libraries
          'vendor-forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          
          // Utilities and smaller libraries
          'vendor-utils': [
            'clsx',
            'tailwind-merge',
            'date-fns',
            'lucide-react'
          ]
        },
        
        // PERFORMANCE: Optimize asset naming for better caching
        assetFileNames: (assetInfo) => {
          // Use 'names' instead of deprecated 'name' property
          const fileName = assetInfo.names?.[0] || assetInfo.originalFileName || 'asset';
          const info = fileName.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    
    // PERFORMANCE: Optimize CommonJS handling
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    
    // PERFORMANCE: Terser optimization for production
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: mode === 'production',
        drop_debugger: true,
        // Remove unused code
        pure_funcs: mode === 'production' ? ['console.log', 'console.warn'] : [],
      },
      mangle: {
        // Optimize variable names
        safari10: true,
      },
    },
    
    // Output source maps only in development
    sourcemap: mode === 'development',
    
    // Clean the output directory before building
    emptyOutDir: true,
    
    // PERFORMANCE: Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  
  // CSS OPTIMIZATION: Enhanced CSS processing
  css: {
    // Source maps for development debugging
    devSourcemap: mode === 'development',
    
    // PostCSS optimization
    postcss: {
      plugins: mode === 'production' ? [
        // Add autoprefixer and cssnano for production
        require('autoprefixer'),
      ] : [],
    },
  },
  
  // PERFORMANCE: Optimize dependencies in dev mode
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      '@tanstack/react-query',
      'clsx',
      'tailwind-merge'
    ],
    // Exclude heavy dependencies from pre-bundling
    exclude: ['recharts'],
  },
  
  // PERFORMANCE: Configure preview server
  preview: {
    port: 4173,
    host: 'localhost',
  },
  
  // PERFORMANCE: Define environment variables for optimization
  define: {
    // Enable production optimizations
    __DEV__: mode === 'development',
  },
}));