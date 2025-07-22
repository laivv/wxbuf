import terser from '@rollup/plugin-terser'

const banner =
  '/*!\n' +
  ` * wxbuf.js v1.1.0\n` +
  ` * (c) ${new Date().getFullYear()} laivv\n` +
  ' * the MIT License.\n' +
  ' */'

export default [{
  input: './src/index.js',
  output: {
    file: './lib/wxbuf.min.js',
    format: 'es',
    sourcemap: false,  
    banner
  },
  plugins: [
    terser({
      compress: false
    }),
  ],
}]