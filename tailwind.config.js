/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'dracey-dark': '#0B0C15', // Rich black-blue background (Premium void)
        'dracey-card': '#151725', // Slightly lighter card background
        'dracey-navy': '#1E2139', // Accent navy for borders/dividers
        'dracey-coral': '#FF2E63', // Vibrant Electric Red/Pink (Primary Brand)
        'dracey-rose': '#E94560', // Secondary Deep Rose/Red
        'dracey-peach': '#FFD369', // Gold accent for text/VIP (Replaces pastel peach)
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Or similar modern font
      },
    },
  },
  plugins: [],
};
