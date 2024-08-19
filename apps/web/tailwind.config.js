const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-card-bg": "#1F1F1F",
        "white-card-bg": "#F9F9F9",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
