// This file is the brain of our micro-frontend setup.

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    historyApiFallback: true, // Important for single-page apps
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    // This plugin sets up the "shell" or "host" for our micro-frontends.
    // We will list the micro-frontends we want to consume under "remotes".
    new ModuleFederationPlugin({
      name: 'shellUI',
      remotes: {
        // We will add the supportTicketsApp here later
        // supportTicketsApp: 'supportTicketsApp@http://localhost:3001/remoteEntry.js',
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};