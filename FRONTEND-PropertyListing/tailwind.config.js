// Tailwind CSS configuration
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#1A0400',
        border: '#FFEAE6',
        brand: {
          coral: '#FF5533',
          peach: '#FFC3B8',
          peachLight: '#FFEAE6',
          espresso: '#1A0400'
        }
      }
    }
  },
  plugins: []
};
