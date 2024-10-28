/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "InterDisplay",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
    // Create colors with https://uicolors.app/create
    colors: {
      transparent: "#00000000",
      grey: {
        0: "#FFFFFF",
        50: "#FAFAFA",
        100: "#F5F5F5",
        200: "#EEEEEE",
        300: "#E0E0E0",
        400: "#BDBDBD",
        500: "#9E9E9E",
        600: "#757575",
        700: "#616161",
        800: "#424242",
        900: "#212121",
      },
      "rustic-red": {
        50: "#fff0f0",
        100: "#ffdddd",
        200: "#ffc1c1",
        300: "#ff9696",
        400: "#ff5a5a",
        500: "#ff2727",
        600: "#fb0707",
        700: "#d40101",
        800: "#ae0606",
        900: "#900c0c",
        950: "#480000",
      },
    },
    extend: {
      fontSize: {
        "extra-sm": "12px",
      },
      boxShadow: (() => {
        const s = (n) =>
          Array.from(Array(n).keys()).map((i) => `${i + 1}px ${i + 1}px 0 0 #424242`);
        const inset_s = (n) =>
          Array.from(Array(n).keys()).map((i) => `inset ${i + 1}px ${i + 1}px 0 0 #424242`);

        return {
          pixel: s(1),
          "pixel-sm": s(2),
          "pixel-md": s(4),
          "pixel-xl": s(8),
          "inset-pixel": inset_s(1),
          "inset-pixel-sm": inset_s(2),
          "inset-pixel-md": inset_s(4),
          "inset-pixel-xl": inset_s(8),
        };
      })(),
    },
  },
  plugins: [],
};
