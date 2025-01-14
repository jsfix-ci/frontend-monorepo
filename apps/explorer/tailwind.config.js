const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind');
const theme = require('../../libs/tailwindcss-config/src/theme');
const {
  VegaColours,
} = require('../../libs/tailwindcss-config/src/vega-colours');
const vegaCustomClasses = require('../../libs/tailwindcss-config/src/vega-custom-classes');

module.exports = {
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    'libs/ui-toolkit/src/utils/shared.ts',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...theme,
      colors: {
        vega: VegaColours,
      },
    },
  },
  plugins: [vegaCustomClasses],
};
