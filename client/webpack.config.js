import css from 'file.css';

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.(jpg|png|svg)$/,
            use: {
              loader: 'url-loader',
            },
          },
          {
            test: /\.css$/,
            loader: ['style-loader', 'css-loader']
          },
          {
            test: /\.erb$/,
            loader: ['style-loader', 'css-loader', 'rails-erb-loader']
          },
        ]
      },
      resolve: {
        extensions: ['*', '.js']
      },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './dist'
    }
};