import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      xs: "450px",
      // => @media (min-width: 450px) { ... }

      sm: "575px",
      // => @media (min-width: 576px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      // => @media (min-width: 1200px) { ... }

      "2xl": "1400px",
      // => @media (min-width: 1400px) { ... }
    },
    extend: {
      colors: {
        primaryBg: "#f8f8f8",
        secondaryBg: "#fd5564",
        thirdBg:"#424242",
        primaryText: "#000000",
        secondaryText: "#f8f8f8",
        btnBg: "f8f8f8",
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
        black: "#121723",
        realBlack: "#000000",
        innercard: "#4d5367",
        menuItemHover: "#3e3e3e",
        paleBtn: "#5e6b84",
        dark: "#121723",
        primary: "#8547f9",
        yellow: "#FBB040",
        purple: "#7d54f1",
        darkPurple: "#8547f9",
        blue: "#197abd",
        "bg-color-dark": "#171C28",
        "body-color": {
          DEFAULT: "#FFFFFF",
          dark: "#FFFFFF",
          light: "#121723",
        },
        stroke: {
          stroke: "#E3E8EF",
          dark: "#353943",
        },
        gray: {
          ...colors.gray,
          dark: "#1E232E",
          light: "#F0F2F9",
        },
        red: {
          light: "#f87c7c"
        },
        boxShadow: {
          signUp: "0px 5px 10px rgba(4, 10, 34, 0.2)",
          one: "0px 2px 3px rgba(7, 7, 77, 0.05)",
          two: "0px 5px 10px rgba(6, 8, 15, 0.1)",
          three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
          sticky: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
          "sticky-dark": "inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)",
          "feature-2": "0px 10px 40px rgba(48, 86, 211, 0.12)",
          submit: "0px 5px 20px rgba(4, 10, 34, 0.1)",
          "submit-dark": "0px 5px 20px rgba(4, 10, 34, 0.1)",
          btn: "0px 1px 2px rgba(4, 10, 34, 0.15)",
          "btn-hover": "0px 1px 2px rgba(0, 0, 0, 0.15)",
          "btn-light": "0px 1px 2px rgba(0, 0, 0, 0.1)",
        },
        dropShadow: {
          three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
