/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5B0D0D",
        secondary: "#F9EFD5"
      },
    },
  },
  plugins: [require("daisyui")],
};
