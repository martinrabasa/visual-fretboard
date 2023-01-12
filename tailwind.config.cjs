/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            borderWidth: {
                1: "1px",
            },
            fontFamily: {
                raleway: ["Raleway"],
            },
            maxWidth: {
                "2xs": "8rem",
            },
        },
    },
    plugins: [],
};
