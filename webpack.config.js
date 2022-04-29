const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const swcConfig = require('./.swcrc.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
    optimization: {
        minimize: true,
    },
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                loader: 'swc-loader',
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
        config.module.rules[0].options = swcConfig(true);
        config.externals = {
            'react': 'react',
            'react-dom': 'react-dom'
        };
        config.plugins.push(new BundleAnalyzerPlugin());
    }

    if (argv.mode === 'production') {
        config.externals = {
            'react': 'react',
            'react-dom': 'react-dom'
        };
        config.module.rules[0].options = swcConfig(false);
    }
    return config;
};
