/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    require("@tailwindcss/typography"), require("daisyui")
  ],  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#a991f7",
          secondary: "#f6d860",
          accent: "#37cdbe",
          neutral: "#3d4451",
          "base-100": "#ffffff",
        },
      },
      {
        business: {
          ...require("daisyui/src/theming/themes")["business"],
        },
      },
      "light",
      "dark",
      "cupcake",
      "forest",
      "business"
    ],
  },
};
