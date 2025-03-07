// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);
const customConfig = {
  ...config,
  resolver: {
    ...config.resolver,
    assetExts: [...(config.resolver?.assetExts ?? []), 'riv'],
  },
};

module.exports = withNativeWind(customConfig, { input: './global.css' });
