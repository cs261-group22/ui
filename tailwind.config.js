const { colors: defaultColors } = require('tailwindcss/defaultTheme');

module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    colors: {
      ...defaultColors,
      ...{
        white: '#ffffff',
        primary: '#264653',
        primarydark: '#1c343d',
        secondary: '#2a9d8f',
        tertiary: '#e9c46a',
        quaternary: '#f4a261',
        quinary: '#e76f51',
        grey: '#f9fafb',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
