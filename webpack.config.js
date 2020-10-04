const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "web",
  entry: {
    index: "./src/app.js"
  },
  devServer: {
    contentBase: "./build",
    port: 3500,
    historyApiFallback: true
  },
  resolve: {
    extensions: [ ".js" ],
    mainFields: [ 'browser', 'commonjs', 'amd', 'main' ]
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html"
    })
  ]
}