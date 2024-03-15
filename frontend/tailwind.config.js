/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    letterSpacing: {
      tightest: '-.025em',
      tighter: '0',
      tight: '.025em',
      normal: '.05em',
      wide: '.25em',
      wider: '.5em',
      widest: '1em',
      widest: '1.5em',
    },
    extend: {
      typography: (theme) => ({
        sm: {
          css: {
            maxWidth: 'none',
            p: {
              margin: '0',
            },
          },
        },
      }),
      backgroundImage: {
        roleShadow:
          'linear-gradient(to bottom, #262626 0%, transparent 5%, transparent 95%, #262626 100%)',
        // 'drwhite':'radial-gradient(circle, #c3c3c3, #dadada)'
      },
      boxShadow: {
        dr: '0 0 18px 2px rgb(0,0,0,0.15)',
        drin: 'inset 0 0px 3px 1px rgba(255, 255, 255, 0.4)',
        'dr-all': '0 0 18px 2px rgba(0,0,0,0.15), inset 0 0px 3px 1px rgba(255, 255, 255, 0.4)',
        'drb-all': '0 0 18px 2px rgba(0,0,0,0.15), inset 0 0px 3px -1px rgba(255, 255, 255, 0.25)',
      },
      dropShadow: {
        st: '0px 0px 6px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        fold: 'fold 1s ease-out',
        'fade-in': 'fade-100 1s ease-out',
        flash: 'flash 2s ease-out',
      },
      transitionProperty: {
        height: 'height',
      },
      keyframes: {
        flash: {
          '0%': {backgroundColor: '#404040'},
          '50%': {backgroundColor: '#71717a'},
          '100%': {backgroundColor: '#404040'},
        },
        fold: {
          '0%': {width: '0%', height: '0px'},
          '100%': {width: '100%', height: '250px'},
        },
        'fade-in': {
          '0%': {opacity: '0'},
          '75%': {opacity: '0.75'},
        },
        'fade-100': {
          // 定义新动画的关键帧
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
