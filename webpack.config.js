const path = require('path');

module.exports = {
    entry:  './webapp/app.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'dist/app.js'
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                {
                    loader: 'babel-loader',
                    options: {
                      presets: ['es2015', 'es2017', 'react']
                    }
                  }
                ]
              }
        ]
    }
}