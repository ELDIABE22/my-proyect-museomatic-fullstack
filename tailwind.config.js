import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': '#FFFFFF',
        'platinum': '#DCDCDC',
        'gray': '#808080',
        'black': '#000000',
      },
      backgroundImage: {
        'museo': "url('/fondo-museo.jpg')",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
};
