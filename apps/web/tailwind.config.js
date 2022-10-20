const { join } = require('path');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ].map((path) => join(__dirname, path)),
  theme: {
    extend: {},
  },
  plugins: [],
};
