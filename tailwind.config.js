/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(-45deg, #e9d5ff, #f3e8ff, #ddd6fe)',
        'gradient-yellow': 'linear-gradient(-45deg, #fef3c7, #fef9c3, #fde68a)',
        'gradient-teal': 'linear-gradient(-45deg, #ccfbf1, #cffafe, #a5f3fc)',
        'gradient-orange': 'linear-gradient(-45deg, #ffedd5, #fed7aa, #fdba74)',
        'gradient-green': 'linear-gradient(-45deg, #dcfce7, #bbf7d0, #86efac)',
        'gradient-blue': 'linear-gradient(-45deg, #dbeafe, #bfdbfe, #93c5fd)',
        'gradient-gray': 'linear-gradient(-45deg, #f9fafb, #f3f4f6, #e5e7eb)',
      },
    },
  },
  plugins: [],
} 