module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-custom-media'),
    require('postcss-custom-properties'),
    require('postcss-mixins'),
    require('postcss-nested'),
    require('autoprefixer')({ browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1' })
  ]
};
