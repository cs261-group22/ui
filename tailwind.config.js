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
        primarydarker: '#182d34',
        secondary: '#2a9d8f',
        tertiary: '#e9c46a',
        quaternary: '#f4a261',
        quinary: '#e76f51',
        lightgrey: '#f3F4F6',

        grey: {
          200: '#fbfbfb',
          300: '#f7f7f7',
          400: '#d7d8dc',
          500: '#cccccc',
          600: '#afaeae',
          700: '#636363',
          800: '#464646',
        },
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
