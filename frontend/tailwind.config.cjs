module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#2563EB",
        surface: "#F3F4F6",
        ink: "#0F172A",
        muted: "#64748B"
      },
      borderRadius: {
        xl: "16px",
        lg: "12px"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        lift: "0 16px 40px rgba(37, 99, 235, 0.15)"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
