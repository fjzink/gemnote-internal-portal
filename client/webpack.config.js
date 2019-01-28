/* eslint-disable */

const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const miniCssPlugin = new MiniCssExtractPlugin({
    filename: devMode ? '[name].css' : '[name].[hash].css',
    chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
});

const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html'
});

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader', 'eslint-loader']
        },
        {
            test: /\.s?[ac]ss$/,
            use: [
                {
                    loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: '[name]_[local]_[hash:base64]',
                        sourceMap: true,
                        minimize: true
                    }
                },
                {
                    loader: 'sass-loader'
                }
            ]
        }
      ]
    },
    plugins: [htmlPlugin, miniCssPlugin],
    devServer: {
        historyApiFallback: true,
        port: 8080,
        open: true,
    }
  };
