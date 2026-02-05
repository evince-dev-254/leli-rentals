/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#f97316", // Leli Orange
                secondary: "#64748b",
                accent: {
                    purple: "#a855f7",
                    pink: "#ec4899",
                }
            },
            fontFamily: {
                outfit: ["Outfit"],
                sans: ["Outfit"],
            }
        },
    },
    plugins: [],
};
