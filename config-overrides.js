const { override, overrideDevServer, fixBabelImports, addLessLoader, addWebpackAlias, addWebpackModuleRule } = require('customize-cra');

const useWorker = () => (config) => {
    // eslint-disable-next-line no-restricted-globals
    config.output.globalObject = 'this';

    return config;
};

module.exports = {
    webpack: override(
        useWorker(),
    ),
    devServer: overrideDevServer()
}
