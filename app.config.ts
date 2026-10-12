import type { ConfigContext, ExpoConfig } from 'expo/config';
import palette from './src/theme/palette.json';
const { brand, material } = palette;

/** Native launch and Android task colors share the runtime theme source. */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? 'Wajamama',
  slug: config.slug ?? 'wajamama',
  backgroundColor: material.light.background,
  primaryColor: brand.twilight,
  android: {
    ...config.android,
    adaptiveIcon: {
      ...config.android?.adaptiveIcon,
      backgroundColor: material.light.background,
    },
  },
  plugins: (() => {
    const existingPlugins = (config.plugins ?? []).map(plugin =>
      Array.isArray(plugin) && plugin[0] === 'expo-splash-screen'
        ? [plugin[0], {
            ...(plugin[1] ?? {}),
            backgroundColor: material.light.background,
            image: './assets/wajamama-brand.png',
            imageWidth: 280,
            resizeMode: 'contain',
            // Android 12+ themed splash
            android: {
              backgroundColor: material.light.background,
              image: './assets/wajamama-brand.png',
              imageWidth: 280,
            },
          }]
        : plugin,
    );

    const fontPlugin = [
      'expo-font',
      {
        fonts: [
          './assets/poppins/Poppins-Regular.ttf',
          './assets/poppins/Poppins-Medium.ttf',
          './assets/poppins/Poppins-SemiBold.ttf',
          './assets/poppins/Poppins-Bold.ttf',
          './assets/poppins/Poppins-Light.ttf',
        ],
      },
    ] as const;

    return [...existingPlugins, fontPlugin] as ExpoConfig['plugins'];
  })(),
});
