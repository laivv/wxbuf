import terser from '@rollup/plugin-terser'
// import copy from 'rollup-plugin-copy'

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
    format: 'es', // 输出格式 amd / es / cjs / iife / umd / system
    // name:'wxbuf',  // 当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
    sourcemap: false,  // 生成bundle.js.map文件，方便调试
    banner
  },
  plugins: [
    terser({
      compress: false
    }),
    // copy({
    //   targets: [{ 
    //     src: './dist/wxbuf.min.js',
    //     dest: './examples/mini-app-demo/lib/'
    //   }],
    //   hook: 'buildEnd'
    // })
  ],
},
{
  input: './src/index.js',
  output: {
    file: './examples/mini-app-demo/lib/wxbuf.min.js',
    format: 'es',
    sourcemap: false,
    banner
  },
  plugins: [
    terser({
      compress: false
    })
  ],
}
]