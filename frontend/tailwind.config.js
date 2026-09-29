/** @type {import('tailwindcss').Config} */
export default {
  // Use the `.dark` class managed by ThemeProvider instead of the OS color
  // preference, so a toggle on any route updates every `dark:` utility.
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

