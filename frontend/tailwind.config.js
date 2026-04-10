/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        md: {
          cream: "#F4EFEA",
          sunbeam: "#FFDE00",
          "sunbeam-dark": "#E3C300",
          sky: "#6FC2FF",
          "sky-strong": "#2BA5FF",
          "soft-blue": "#EBF9FF",
          cloud: "#FFFFFF",
          fog: "#F8F8F7",
          ink: "#383838",
          slate: "#A1A1A1",
          graphite: "#000000",
          "grid-line": "#E4D6C3",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      fontSize: {
        "ui": ["14px", { lineHeight: "20px", letterSpacing: "0.02em" }],
        "eyebrow": ["12px", { lineHeight: "16px", letterSpacing: "0.08em" }],
      },
      spacing: {
        "section": "120px",
        18: "72px",
      },
      borderRadius: {
        struct: "2px",
      },
      boxShadow: {
        "md-lift": "0 7px 0 #000000",
        "md-card": "0 0 0 2px #000000",
      },
      transitionDuration: {
        md: "120ms",
      },
      keyframes: {
        "md-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "md-shimmer": "md-shimmer 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
