/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#F97316', // Orange from the design
                    light: '#FDBA74',
                },
                background: '#FAF9F6', // Light off-white
            },
            fontFamily: {
                outfit: ['Outfit_400Regular'],
                'outfit-bold': ['Outfit_700Bold'],
                'outfit-medium': ['Outfit_500Medium'],
            }
        },
    },
    plugins: [],
}
