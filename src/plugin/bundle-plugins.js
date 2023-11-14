// node .\bundle-plugins.js
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin')

function copy(src, dest) {
  if (fs.lstatSync(src).isDirectory()) {
    fs.mkdirSync(dest)
    fs.readdirSync(src, { withFileTypes: true }).forEach(file => {
      newsrc = path.join(src, file.name)
      newdest = path.join(dest, file.name)
      copy(newsrc, newdest)
    })
  }
  else {
    fs.copyFileSync(src, dest)
  }
}

let entry = {};
let styleFiles = []
fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(folder => folder.isDirectory())
  .forEach(folder => {
    fs.readdirSync(path.resolve(__dirname, folder.name), { withFileTypes: true })
      .forEach(file => {
        if (file.isFile() && file.name.match(/summernote(.)*\.(js)$/)) {
          entry[`${folder.name}/${file.name}`] = `./${folder.name}/${file.name}`;
        }
        else {
          let src = path.join(__dirname, folder.name, file.name)
          let dest = path.join(__dirname, '../../plugin', folder.name, file.name)
          styleFiles.push({ src, dest })
        }
      });
  })
const callback = (err, stats) => {
  // console.log(styleFiles)
  // Callback Function
  styleFiles.forEach(f => {
    copy(f.src, f.dest)
  })
};

const config = {
  mode: 'production',
  entry,
  output: {
    publicPath: '/',
    path: path.join(__dirname, '../../plugin'),
    filename: '[name]',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [__dirname],
        exclude: [path.resolve(__dirname, 'node_modules')],
        loaders: ['babel-loader'],
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js'],
  },
  externals: {
    jquery: '$',
    $: 'jquery',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
};

webpack(config, callback)