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
    port: 3001, // Yeh ek alag port (3001) par chalega
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
    ],
  },
  plugins: [
    // Yeh plugin is app ko ek micro-frontend banata hai
    new ModuleFederationPlugin({
      name: 'supportTicketsApp', // Iska naam wahi hai jo registry.json mein hai
      filename: 'remoteEntry.js', // Yeh file Shell UI use karega
      exposes: {
        // Hum App component ko expose kar rahe hain
        './SupportTickets': './src/App',
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};