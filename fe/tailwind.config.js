module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // 또는 'media' 또는 'class'
  theme: {
    extend: {
      fontFamily: {
        'sans': ['ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['ui-serif', 'Georgia', 'serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Consolas'],
        'display': ['ui-sans-serif', 'sans-serif'],
        'body': ['ui-sans-serif', 'sans-serif'],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
