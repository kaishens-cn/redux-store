const path = require('path');

module.exports = (isDev = false) => {
    const polyfillConfig = isDev? {} : {
        env: {
            mode: 'usage',
            coreJs: 3,
            path: path.resolve(__dirname),
        }
    }

    return {
        module: {
            type: 'es6',
            ignoreDynamic: true,
        },
        ...polyfillConfig,
        jsc: {
            parser: {
                syntax: 'typescript',
                dynamicImport: true,
                decorators: true,
                tsx: true,
            },
            loose: true,
            target: 'es2015',
            externalHelpers: true,
            transform: {
                legacyDecorator: true,
                decoratorMetadata: true,
                react: {
                    runtime: 'automatic',
                    throwIfNamespace: true,
                    useBuiltins: true,
                    development: isDev,
                }
            },
        }
    }
}
