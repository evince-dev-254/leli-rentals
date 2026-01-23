const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Use __dirname to ensure absolute paths are handled correctly on Windows
const config = getDefaultConfig(__dirname);

// Add support for .cjs, .mjs and .css files
config.resolver.sourceExts.push('cjs', 'mjs', 'css');
config.resolver.unstable_enablePackageExports = true;

config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    tslib: require.resolve("tslib"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
