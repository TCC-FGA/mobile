module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel', 'nativewind/babel'],
      },
    },
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '~': './src',
            '@assets': './src/assets',
          },
        },
      ],
      'nativewind/babel',
    ],
  };
};
