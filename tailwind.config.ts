import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tt-red': '#E31E24',
        'tt-red-dark': '#B91C1C',
        'nomad-dark': '#0A0A0A',
        'nomad-card': '#111111',
        'nomad-border': '#222222',
        'nomad-gray': '#888888',
        'crypto-green': '#00D4AA',
        'crypto-blue': '#3B82F6',
        'crypto-purple': '#8B5CF6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config