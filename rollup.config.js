export default [{
  input: 'src/index.js',
  output: {
    file: 'www/app.js',
    format: 'es'
  }
}, {
  input: 'src/server.js',
  output: {
    file: 'server.js',
    format: 'cjs'
  }
}]
