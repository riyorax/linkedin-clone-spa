/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bglinkedin: "#f4f2ee",
        bluelinkedin: "#0A66C2", 
        bluehover: "#005C8E",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  daisyui: {
    themes: [],
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#0A66C2",
          "primary-hover": "#005C8E",
          "base-100": "#f4f2ee",
        },
      },
    ],
  },
  plugins: [tailwindcssAnimate, require("daisyui")],
};
