import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0px 4px 4px 0px rgba(0, 0, 0, 0.2)",
      },
      colors: {
        background: {
          primary: "#76CEF6", // sky
          secondary: "#FAF3E2", // cream
          purple: "#CE8FFF",
        },
        content: {
          primary: "#222222",
          accent: "#FE500C",
        },
        button: {
          primary: "#EED811",
          secondary: "#222222",
        },
        border: {
          primary: "#222222",
        },
        "street-sign": "#06885B",
      },
      fontFamily: {
        karla: ["var(--font-karla)"],
        bowlby: ["var(--font-bowlby-one)"],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        ".heading-1": {
          "@apply font-bowlby text-[80px] md:text-[140px] font-bold": {},
        },
        ".heading-2": {
          "@apply font-bowlby text-[48px] md:text-[80px] font-bold": {},
        },
        ".heading-3": {
          "@apply font-bowlby text-[32px] md:text-[48px] font-bold": {},
        },
        ".heading-4": {
          "@apply font-karla text-[25px] md:text-[41px]": {},
        },
        ".heading-5": {
          "@apply font-bowlby text-[25px] font-bold": {},
        },
        ".body-lg": {
          "@apply font-karla text-[21px] md:text-[25px]": {},
        },
        ".body-md": {
          "@apply font-karla text-[17px] md:text-[20px]": {},
        },
        ".caption": {
          "@apply font-karla text-[14px] md:text-[16px]": {},
        },
      });
    }),
  ],
};

export default config;
