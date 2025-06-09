// import type { Config } from "tailwindcss";

// export default {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         navy: "#0A1A2F",
//         terracotta: "#E07A5F",
//         gold: "#D4AF37",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//       },
//       fontFamily: {
//         sans: ["Inter", "sans-serif"],
//         playfair: ["Playfair Display", "serif"],
//       },
//       keyframes: {
//         "fade-up": {
//           "0%": {
//             opacity: "0",
//             transform: "translateY(10px)",
//           },
//           "100%": {
//             opacity: "1",
//             transform: "translateY(0)",
//           },
//         },
//         "fade-down": {
//           "0%": {
//             opacity: "0",
//             transform: "translateY(-10px)",
//           },
//           "100%": {
//             opacity: "1",
//             transform: "translateY(0)",
//           },
//         },
//         "fade-in": {
//           "0%": {
//             opacity: "0",
//           },
//           "100%": {
//             opacity: "1",
//           },
//         },
//       },
//       animation: {
//         "fade-up": "fade-up 0.5s ease-out",
//         "fade-down": "fade-down 0.5s ease-out",
//         "fade-in": "fade-in 0.5s ease-out",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")],
// } satisfies Config;

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        navy: "#0A1A2F",
        terracotta: "#E07A5F",
        gold: "#D4AF37",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        playfair: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
      },
      // Enhanced aspect ratio utilities for layout stability
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
        'video-vertical': '9 / 16',
        photo: '4 / 3',
        'photo-vertical': '3 / 4',
        golden: '1.618 / 1',
        cinema: '21 / 9',
        ultrawide: '32 / 9',
        'hero': '16 / 9',
        'hero-mobile': '4 / 3',
        'card': '3 / 2',
        'portrait': '2 / 3',
        'landscape': '3 / 2',
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        // Enhanced shimmer animation for skeleton loading
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        // Skeleton wave animation for enhanced loading states
        "skeleton-wave": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        // Smooth image fade-in
        "image-fade": {
          "0%": {
            opacity: "0",
            transform: "scale(1.02)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        // Progressive blur reduction for image loading
        "blur-fade": {
          "0%": {
            filter: "blur(8px)",
            opacity: "0.8",
          },
          "100%": {
            filter: "blur(0px)",
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-down": "fade-down 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        // Enhanced image loading animations
        "shimmer": "shimmer 1.8s infinite ease-in-out",
        "skeleton-wave": "skeleton-wave 2s infinite ease-in-out",
        "image-fade": "image-fade 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "blur-fade": "blur-fade 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      // Enhanced transition utilities
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      // Enhanced spacing for image layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      // Enhanced backdrop blur for loading states
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      // Enhanced opacity utilities for loading states
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
        '85': '0.85',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for aspect ratio utilities
    function({ addUtilities }: { addUtilities: any }) {
      const aspectRatioUtilities = {
        '.aspect-ratio-container': {
          position: 'relative',
          width: '100%',
        },
        '.aspect-ratio-content': {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
        // Enhanced skeleton loading utilities
        '.skeleton-enhanced': {
          background: 'linear-gradient(90deg, rgba(240, 240, 240, 0.8) 25%, rgba(224, 224, 224, 0.8) 50%, rgba(240, 240, 240, 0.8) 75%)',
          backgroundSize: '200% 100%',
          animation: 'skeleton-wave 2s infinite ease-in-out',
        },
        // Image loading state utilities
        '.image-loading': {
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.8s infinite',
        },
        '.image-fade-in': {
          opacity: '0',
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.image-fade-in.loaded': {
          opacity: '1',
        },
        // Critical image utilities
        '.critical-image': {
          opacity: '0',
          transition: 'opacity 0.3s ease-out',
        },
        '.critical-image.preloaded': {
          opacity: '1',
        },
      };
      
      addUtilities(aspectRatioUtilities);
    },
  ],
} satisfies Config;