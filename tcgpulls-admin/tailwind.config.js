/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./admin/pages/**/*.{js,ts,jsx,tsx}", // Keystone Admin UI and your custom pages
    "./admin/components/**/*.{js,ts,jsx,tsx}", // Your React components
    "./admin/globals.css", // Your global CSS file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
