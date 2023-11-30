module.exports = {
  mode: 'jit',
  darkMode: 'class',
  relative: true,
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
    './frontastic/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [{ pattern: /bg-(white|neutral-200)/ }],
  theme: {
    extend: {
      keyframes: {
        appearDropdown: {
          '0%': {
            opacity: 0,
            scale: 0,
          },
          '50%': {
            opacity: 0.5,
            scale: 0.5,
          },
          '100%': {
            opacity: 1,
            scale: 1,
          },
        },
        appearSelect: {
          '0%': {
            opacity: 0,
            height: 0,
          },
          '50%': {
            opacity: 0.5,
            height: 50,
          },
          '100%': {
            opacity: 1,
            height: 100,
          },
        },
      },
      animation: {
        appearDropdown: 'appearDropdown 0.15s ease-in-out',
        appearSelect: 'appearSelect 0.5s ease-in-out',
      },
      fontFamily: {
        body: 'var(--font-inter)',
        heading: 'var(--font-libre)',
      },
      fontSize: Object.fromEntries(
        Array(100)
          .fill(0)
          .map((_, i) => [i + 1, `${i + 1}px`]),
      ),
      lineHeight: {
        tight: '100%',
        normal: '125%',
        loose: '150%',
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      screens: {
        sm: '480px',
        md: '744px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1666px',
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '8px',
      },
      boxShadow: {
        100: '0px 2px 2px rgba(25, 40, 81, 0.05)',
        200: '0px 4px 4px rgba(25, 40, 81, 0.05)',
        300: '0px 8px 8px rgba(25, 40, 81, 0.05)',
        400: '0px 16px 16px rgba(25, 40, 81, 0.05)',
        dark: '0px 1px 6px rgba(0, 0, 0, 0.25)',
        button: '1px 1px 1px rgba(0, 0, 0, 0.15), -1px -1px 1px rgba(25, 40, 81, 0.15)',
        inset: 'inset 0px 30px 16px rgba(127, 127, 127, 0.2)',
        bottom: '0px 0px 3px rgba(71, 71, 71, 1)',
      },
      textUnderlineOffset: {
        default: '0.25em',
      },
      colors: {
        primary: {
          black: '#212121',
          dark: '#343434',
        },
        secondary: {
          black: '#494949',
          grey: '#474747',
        },
        accent: {
          red: '#D14253',
        },
        gray: {
          400: '#7F7F7F',
          500: '#767676',
          700: '#1A1A1A',
        },
        neutral: {
          100: '#FFFFFF',
          150: '#F7F9FC',
          200: '#F8F8F8',
          300: '#EFF0F5',
          400: '#DCE0EB',
          500: '#959595',
        },
        green: {
          100: '#ECF5F3',
          300: '#A8DBCD',
          500: '#00853D',
          600: '#229575',
          700: '#1D6E5E',
        },
        yellow: {
          100: '#FCEFD4',
          300: '#F6C669',
          500: '#F2AE29',
          600: '#C28B21',
          700: '#916819',
        },
        red: {
          100: '#F6E5E7',
          300: '#E0919A',
          500: '#CD3F50',
          600: '#AE1D32',
          700: '#8A182A',
        },
        blue: {
          100: '#ECF0FB',
          300: '#7A97E4',
          500: '#416BD8',
          600: '#2A4DA8',
          700: '#274082',
        },
      },
      spacing: Object.fromEntries(
        Array(400)
          .fill(0)
          .map((_, i) => [i + 1, `${i + 1}px`]),
      ),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
  ],
};
