/** @type {import(\x27tailwindcss\x27).Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4FC3F7",
        secondary: "#66BB6A",
        accent: "#FFF8E1",
        ink: "#333333",
      },
      fontFamily: { sans: ["Poppins", "system-ui", "sans-serif"] },
      boxShadow: { card: "0 4px 20px rgba(0,0,0,0.06)" },
    },
  },
  plugins: [],
};
