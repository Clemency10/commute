// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve
// const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

// Otherwise modules imported from outside this directory does not compile.
// Also needed if modules from this directory were imported elsewhere
// Seems to be a Babel bug
// https://github.com/babel/babel-loader/issues/149#issuecomment-191991686
const BABEL_CONFIG = {
  presets: [
    'env',
    'react',
    'stage-2'
  ].map(function configMap (name) {
    return require.resolve(`babel-preset-${name}`)
  })
}

const config = {
  entry: {
    app: resolve('./src/index.js')
  },

  output: {
    path: resolve(__dirname, 'build'),
    publicPath: '/build',
    filename: 'bundle.js'
  },

  devServer: {
    contentBase: [
      __dirname,
      resolve(__dirname, '../')
    ]
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [resolve('.')],
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: BABEL_CONFIG
        }]
      }
    ]
  },

  // resolve: {
  //   alias: {
  //     // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
  //     'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
  //   }
  // },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new Dotenv()
    // new webpack.EnvironmentPlugin(['MapboxAccessToken'])
  ]
}

module.exports = config