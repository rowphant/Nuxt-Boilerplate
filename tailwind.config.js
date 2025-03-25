export default {
    content: [
      './components/**/*.{vue,js}',
      './layouts/**/*.{vue,js}',
      './pages/**/*.{vue,js}',
      './plugins/**/*.{js,ts}',
      './app.vue',
    ],
    theme: {
      extend: {},
    },
    plugins: [require('daisyui')],
  }
  