module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#C2410C",
        surface: "#FAF7F2",
        ink: "#1F1A17",
        muted: "#74685F"
      },
      borderRadius: {
        xl: "16px",
        lg: "12px"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(31, 26, 23, 0.08)",
        lift: "0 16px 40px rgba(194, 65, 12, 0.16)"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
