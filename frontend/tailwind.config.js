module.exports = {
  mode: 'jit',
  darkMode: 'class',
  relative: true,
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/layout.tsx',
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
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        gray: {
          100: 'rgb(var(--color-gray-100) / <alpha-value>)',
          200: 'rgb(var(--color-gray-200) / <alpha-value>)',
          300: 'rgb(var(--color-gray-300) / <alpha-value>)',
          400: 'rgb(var(--color-gray-400) / <alpha-value>)',
          500: 'rgb(var(--color-gray-500) / <alpha-value>)',
          600: 'rgb(var(--color-gray-600) / <alpha-value>)',
          700: 'rgb(var(--color-gray-700) / <alpha-value>)',
          800: 'rgb(var(--color-gray-800) / <alpha-value>)',
        },
        neutral: {
          default: 'rgb(var(--color-neutral-default) / <alpha-value>)',
          150: 'rgb(var(--color-neutral-150) / <alpha-value>)',
          200: 'rgb(var(--color-neutral-200) / <alpha-value>)',
          300: 'rgb(var(--color-neutral-300) / <alpha-value>)',
          400: 'rgb(var(--color-neutral-400) / <alpha-value>)',
          500: 'rgb(var(--color-neutral-500) / <alpha-value>)',
          800: 'rgb(var(--color-neutral-800) / <alpha-value>)',
          900: 'rgb(var(--color-neutral-900) / <alpha-value>)',
        },
        green: {
          100: 'rgb(var(--color-green-100) / <alpha-value>)',
          300: 'rgb(var(--color-green-300) / <alpha-value>)',
          500: 'rgb(var(--color-green-500) / <alpha-value>)',
          600: 'rgb(var(--color-green-600) / <alpha-value>)',
          700: 'rgb(var(--color-green-700) / <alpha-value>)',
        },
        yellow: {
          100: 'rgb(var(--color-yellow-100) / <alpha-value>)',
          300: 'rgb(var(--color-yellow-300) / <alpha-value>)',
          500: 'rgb(var(--color-yellow-500) / <alpha-value>)',
          600: 'rgb(var(--color-yellow-600) / <alpha-value>)',
          700: 'rgb(var(--color-yellow-700) / <alpha-value>)',
        },
        red: {
          100: 'rgb(var(--color-red-100) / <alpha-value>)',
          300: 'rgb(var(--color-red-300) / <alpha-value>)',
          500: 'rgb(var(--color-red-500) / <alpha-value>)',
          600: 'rgb(var(--color-red-600) / <alpha-value>)',
          700: 'rgb(var(--color-red-700) / <alpha-value>)',
        },
        blue: {
          100: 'rgb(var(--color-blue-100) / <alpha-value>)',
          300: 'rgb(var(--color-blue-300) / <alpha-value>)',
          500: 'rgb(var(--color-blue-500) / <alpha-value>)',
          600: 'rgb(var(--color-blue-600) / <alpha-value>)',
          700: 'rgb(var(--color-blue-700) / <alpha-value>)',
        },
      },
      spacing: Object.fromEntries(
        Array(400)
          .fill(0)
          .map((_, i) => [i + 1, `${i + 1}px`]),
      ),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio'), require('@tailwindcss/typography')],
};
