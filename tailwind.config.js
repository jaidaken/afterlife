// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zomboidBackground: "#1c1c1c",
        zomboidText: "#e0e0e0",
        zomboidHighlight: "#ff0000",
      },
      fontFamily: {
        zomboidSans: ['"Open Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
