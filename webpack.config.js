const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const config = {
    optimization: {
        minimize: true,
    },
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build/lib/src'),
        library: 'laputarenderer',
        libraryTarget: 'umd'
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map'; // 导出SourceMap供调试
    }

    if (argv.mode === 'production') {
        config.externals = {
            'react': 'react',
            'react-dom': 'react-dom'
        };
    }
    return config;
};
