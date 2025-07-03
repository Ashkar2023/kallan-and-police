import { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                lg: '1rem',
                md: '0.75rem',
                sm: '0.5rem',
                xl: '1.5rem',
                '2xl': '2rem',
            },
            fontFamily: {
                "sans": ["Sora", '"Inter"', "system-ui", 'Arial',"sans-serif"]
            },
            colors: {
                background: "#1e293b",        // slate-800
                foreground: "#f1f5f9",        // slate-100

                card: "#334155",              // slate-700
                cardForeground: "#f8fafc",    // slate-50

                primary: "#3b82f6",           // blue-500
                primaryForeground: "#ffffff",
            },
            boxShadow: {
                xl: 'none',
            },
            transitionProperty: {
                'fade': 'opacity',
            },
        }
    },
    plugins: [tailwindcssAnimate],
} satisfies Config