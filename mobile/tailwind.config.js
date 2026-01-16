/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#3b82f6", // Default blue, will update based on branding
                secondary: "#64748b",
                accent: {
                    purple: "#a855f7",
                    pink: "#ec4899",
                }
            },
            fontFamily: {
                inter: ["Inter"],
            }
        },
    },
    plugins: [],
};
