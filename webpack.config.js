module.exports = {
    entry: {
        diyName: './app.js'
    },
    output: {
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel-loader?presets[]=es2015&presets[]=react'
        }]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    }
};