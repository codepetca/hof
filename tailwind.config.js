/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          primary: "#7c3aed",
          accent: "#0ea5e9",
          muted: "#9ca3af"
        }
      },
      boxShadow: {
        glow: "0 20px 80px rgba(79, 70, 229, 0.25)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
        beam: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(124,58,237,0.2))"
      }
    }
  },
  plugins: []
};
