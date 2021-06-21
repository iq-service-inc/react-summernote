// node .\bundle-plugins.js
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin')

const pluginList = [
  'custom',
  'emoji',
  'formatting',
  'insert',
  'misc',
  'special_characters',
  'syntax'
];


function copy(src, dest) {
  if (fs.lstatSync(src).isDirectory()) {
    fs.mkdirSync(dest)
    fs.readdirSync(src, {withFileTypes: true}).forEach(file => {
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
pluginList.forEach(folder => {
  fs.readdirSync(path.resolve(__dirname, folder), {withFileTypes: true})
  .forEach(file => {
    if (file.isFile() && file.name.match(/\.(js)$/)) {
      entry[`${folder}/${file.name}`] = `./${folder}/${file.name}`;
    }
    else {
      let src = path.join(__dirname, folder, file.name)
      let dest = path.join(__dirname, '../../plugin', folder, file.name)
      styleFiles.push({src, dest})
    }
  });
})

const callback = (err, stats) => {
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