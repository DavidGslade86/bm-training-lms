/** @type {import('tailwindcss').Config} */
// Keep color values in sync with src/theme.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand-blue':    '#009bdf',
        'brand-blue-dk': '#0081ba',
        'brand-blue-lt': '#e6f5fc',
        'brand-gray':    '#63656a',
        'brand-gray-lt': '#9a9ca0',
        'brand-gray-dk': '#3d3e42',
        'brand-hdr':     '#1a1a1a',
        'brand-side':    '#2a2a2e',
        'brand-cream':   '#f7f5f0',
        'brand-ww':      '#fdfcfa',
        'brand-sand':    '#e8e2d6',
        'brand-ok':      '#4a8c6f',
        'brand-ok-bg':   '#e8f5ee',
        'brand-err':     '#b54a4a',
        'brand-err-bg':  '#fce8e8',
        'brand-td':      '#2c2c2c',
        'brand-tm':      '#555555',
        'brand-tl':      '#888888',
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
