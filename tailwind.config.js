module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("daisyui")],
  daisyui: {
    themes: [
      {
        mitzi: {
          primary: "rgb(139, 92, 246)",
          secondary: "#f4baeb",
          accent: "#9df9ea",
          neutral: "#141221",
          "base-100": "#F1ECF4",
          info: "#A4CFEA",
          success: "#0F8548",
          warning: "#D37912",
          error: "#E84573",
        },
      },
    ],
  },
}
