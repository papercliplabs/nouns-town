/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {config: "./src/theme/tailwind.config.ts"},
    autoprefixer: {},
  },
};

export default config;
