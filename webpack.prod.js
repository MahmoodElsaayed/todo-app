const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',
    output: {
        clean: true,
    },
    optimization: {
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()],
        splitChunks: {
            chunks: 'all',
        },
    },
})
