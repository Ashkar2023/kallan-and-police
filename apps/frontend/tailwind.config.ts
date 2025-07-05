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
                background: "#181818",
                foreground: "#f1f5f9",        

                card: "#1f1f1f",              
                cardForeground: "#f8fafc",    

                primary: "#798891",           
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