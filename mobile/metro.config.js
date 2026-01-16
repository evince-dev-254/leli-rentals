const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Use __dirname to ensure absolute paths are handled correctly on Windows
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
