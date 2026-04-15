import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rosa: {
          50: "#fdf2f4",
          100: "#fce7ec",
          200: "#f9d0da",
          300: "#f4a8bb",
          400: "#ec7896",
          500: "#c97b84",
          600: "#b55d6b",
          700: "#974854",
          800: "#7d3d47",
          900: "#6a353e",
        },
        menta: {
          50: "#f1faf4",
          100: "#dff3e6",
          200: "#c0e6cf",
          300: "#94d1ae",
          400: "#7fb89b",
          500: "#53a17a",
          600: "#3f8561",
          700: "#346a4f",
          800: "#2c5541",
          900: "#254636",
        },
        neutral: {
          50: "#fafaf8",
          100: "#f3f1ec",
          200: "#e7e3dc",
          300: "#cfc9bf",
          400: "#a8a095",
          500: "#847b70",
          600: "#65605a",
          700: "#4d4945",
          800: "#332f2b",
          900: "#1f1c19",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
