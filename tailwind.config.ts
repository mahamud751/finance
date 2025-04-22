/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff",
          dark: "#1a202c",
        },
        text: {
          light: "#1a202c",
          dark: "#e2e8f0",
        },
        primary: {
          light: "#3b82f6",
          dark: "#60a5fa",
        },
        secondary: {
          light: "#f59e0b",
          dark: "#fbbf24",
        },
      },
    },
  },
  plugins: [],
};
