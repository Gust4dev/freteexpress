const { defineConfig } = require("tailwindcss");
const preset = require("tailwindcss/default-preset");

module.exports = defineConfig({
  presets: [preset],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#2563EB",
          600: "#1D4ED8"
        }
      }
    }
  },
  plugins: []
});