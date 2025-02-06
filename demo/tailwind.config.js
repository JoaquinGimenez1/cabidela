const colors = require('tailwindcss/colors')

module.exports = {
  //mode: "jit",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "common/**/*.{js,jsx,ts,tsx}"],
  // without this, many inline react class need the !important classifier
  // https://tailwindcss.com/docs/configuration#important
  // https://tailwindcss.com/docs/configuration#selector-strategy
  important: "#app",
  theme: {
    extend: {
      fontSize: {
        xxs: "0.6rem",
      },
      colors: colors,
    },
  },
  // https://tailwindcss.com/docs/content-configuration#safelisting-classes
  variants: {},
  plugins: [
    require("@tailwindcss/forms")({ strategy: "base" }),
    require("@headlessui/tailwindcss")({ prefix: "ui" }),
  ],
};
