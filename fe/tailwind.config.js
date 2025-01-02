module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // 또는 'media' 또는 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["ui-serif", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas"],
        display: ["ui-sans-serif", "sans-serif"],
        body: ["ui-sans-serif", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 10s linear infinite", // 기존 1s를 10s로 변경하여 속도를 줄임
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
