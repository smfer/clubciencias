/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        button: "0px 0px 12px 4px",
        buttonHover: "0px 0px 18px 6px",
      },
    },
  },
  plugins: [],
};
