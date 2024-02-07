import terser from '@rollup/plugin-terser'

const banner =
  '/*!\n' +
  ` * wxbuf.js v1.0.0\n` +
  ` * (c) ${new Date().getFullYear()} lingluo\n` +
  ' * the MIT License.\n' +
  ' */'

export default [{
  input: './src/index.js',
  output: {
    file: './dist/wxbuf.min.js',
    format: 'es', // output format: amd / es / cjs / iife / umd / system
    sourcemap: false,  // bundle.js.map
    banner
  },
  plugins: [
    terser({
      compress: false
    }),
  ],
}]