import terser from '@rollup/plugin-terser'
// import extensions from '@rollup/plugin-extensions'
import babel from '@rollup/plugin-babel'
import obfuscator from 'rollup-plugin-obfuscator'

export default {
  input: './src/index.js', // 入口文件
  output: {
    file: './dist/wxbuf.min.js', // 输出文件
    format: 'es', // 输出格式 amd / es / cjs / iife / umd / system
    // name:'func',  // 当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
    sourcemap: false  // 生成bundle.js.map文件，方便调试
  },
  plugins: [
    // obfuscator({
    //   options:{
    //     simplify: true,
    //     deadCodeInjection: false,
    //     identifierNamesGenerator: 'mangled',
    //     controlFlowFlattening: false,
    //     unicodeEscapeSequence: false,
    //     rotateStringArray: false,
    //     transformObjectKeys: true,
    //     selfDefending: false,
    //     stringArray: false,
    //     stringArrayEncoding: []
    //   }
    // })
    //    babel({
    //   babelHelpers: 'bundled',
    //   exclude: 'node_modules/**'
    // }),
    terser({
      compress: false
    }),
  ],
}