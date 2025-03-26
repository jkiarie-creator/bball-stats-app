const { withExpoRouter } = require('@expo/router/expo-router');

/** @type {import('@expo/config').ExpoConfig} */
module.exports = function (config) {
  return withExpoRouter(config);
};
