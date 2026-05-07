module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Colors
        "primary": "#c8c6c5",
        "primary-container": "#121212",
        "primary-fixed": "#e5e2e1",
        "primary-fixed-dim": "#c8c6c5",
        "on-primary": "#313030",
        "on-primary-container": "#7e7d7d",
        "inverse-primary": "#5f5e5e",
        
        // Secondary Colors (Cyan)
        "secondary": "#bdf4ff",
        "secondary-container": "#00e3fd",
        "secondary-fixed": "#9cf0ff",
        "secondary-fixed-dim": "#00daf3",
        "on-secondary": "#00363d",
        "on-secondary-container": "#00616d",
        
        // Tertiary Colors (Gold)
        "tertiary": "#e9c400",
        "tertiary-container": "#c9a900",
        "tertiary-fixed": "#ffe16d",
        "tertiary-fixed-dim": "#e9c400",
        "on-tertiary": "#3a3000",
        "on-tertiary-container": "#4c3f00",
        
        // Surface Colors
        "surface": "#131313",
        "surface-dim": "#131313",
        "surface-bright": "#393939",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "surface-variant": "#353534",
        "inverse-surface": "#e5e2e1",
        
        // Outline & Border Colors
        "outline": "#8e9192",
        "outline-variant": "#444748",
        
        // Error Colors
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        
        // Surface tint
        "surface-tint": "#c8c6c5"
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      }
    }
  },
  plugins: []
}
