/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './frontend/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'bodoni': ["Bodoni 72 Smallcaps Book", ...defaultTheme.fontFamily.sans]
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        rightToLeft: {
          '0%': { 'right': '-50%' },
          '100%': { 'right': '100%' },
        },
        rightToLeftForeground: {
          '0%': { 'background-position': '0 bottom' },
          '100%': { 'background-position': '-100% bottom' },
        },
        rightToLeftMiddleground: {
          '0%': { 'background-position': '0 bottom' },
          '100%': { 'background-position': '-100% bottom' },
        },
        rightToLeftBackground: {
          '0%': { 'background-position': '0 bottom' },
          '100%': { 'background-position': '-100% bottom' },
        },
        mobCome: {
          '0%': { 'left': '100%' },
          '100%': { 'left': '-20%' },
        },
      },
      animation: {
        loopRightToLeft: 'rightToLeft 30s linear infinite',
        loopRightToLeftSlow: 'rightToLeft 50s linear infinite',
        loopRightToLeftSlower: 'rightToLeft 70s linear infinite',
        loopForeground: 'rightToLeftForeground 3s linear infinite',
        loopMidground: 'rightToLeftMiddleground 7s linear infinite',
        loopBackground: 'rightToLeftBackground 11s linear infinite',
        mobCome: 'mobCome 1s infinite',
        mobSlowCome: 'mobCome 2s infinite',
      },
      dropShadow: {
        'glow': '0 0 4px #FFFFFF',
      },
      colors: {
        'primary-dark': '#1A217A',
        'primary': '#2732C0',
        'primary-light': '#9298DF',
        grey: {
          '50': '#7A7A7A',
        },
        blue: {
          'black': '#141732',
          'lavender': '#BEC3FF',
          'neon': '#4855FF',
          'grey': '#536498',
          'mid': '#212A9F',
          'dark': '#161B56',
          'sky': '#49A8FF',
          'pastel': '#E0F3FF',
          'ash': '#3946AC',
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
    },
  },
  plugins: [],
}
