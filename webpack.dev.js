const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        clean: false,
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        client: {
            overlay: {
                warnings: false,
                errors: true,
            },
        },
        port: 8080,
        open: true,
        hot: true,
        historyApiFallback: true,
        watchFiles: {
            paths: ['src/**/*.*'],
            options: {
                usePolling: true,
                ignored: /node_modules/,
            },
        },
    },
})
