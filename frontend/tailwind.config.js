/** @type {import('tailwindcss').Config} */

const nav_height = "96px";
const nav_learning_height = "60px";
const footer_height = "441px";
const footer_learning = "50px";

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "minus-nav": nav_height,
        "minus-learning-nav": nav_learning_height,
        "minus-footer": `calc(100vh - ${footer_height})`,
        "minus-footer-learning": `calc(100vh - ${footer_learning})`,
      },
      backgroundImage: {
        gradient:
          "linear-gradient(90deg, rgba(4,118,244,1) 0%, rgba(4,191,253,1) 100%)",
      },
    },
    minHeight: {
      "minus-footer": `calc(100vh - ${footer_height})`,
    },
  },
  plugins: [require("flowbite/plugin"), require("@tailwindcss/line-clamp")],
};
