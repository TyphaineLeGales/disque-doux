import { ConfigContext, ExpoConfig } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development'; //dev build
const IS_PREVIEW = process.env.APP_VARIANT === 'preview'; // internal test build

const getIdentifier = () => {
  console.log('app variant', process.env.APP_VARIANT);
  let baseId = 'com.disquedoux.diskDo';
  if (IS_DEV) baseId += '.dev';
  if (IS_PREVIEW) baseId += '.preview';
  console.log('identifier', baseId);
  return baseId;
};

const getAppName = () => {
  let baseName = 'DiskDo';
  if (IS_DEV) baseName += '(dev)';
  if (IS_PREVIEW) baseName += '(preview)';
  return baseName;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: 'diskDo',
  version: '1.0.0',
  scheme: 'diskDo',
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#EFCFA0',
      },
    ],
    [
      'expo-custom-assets',
      {
        assetsPaths: ['./rive'],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: getIdentifier(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: getIdentifier(),
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '8558da4e-6d39-4232-a7bc-ef4c0344cb2f',
    },
    isDevelopment: true,
  },
  owner: 'disque_doux',
});
