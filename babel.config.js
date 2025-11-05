module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Required for expo-router to transform the file-based routes entry
      // "expo-router/babel",
      // If you're using react-native-reanimated (installed), the plugin should be last
      "react-native-reanimated/plugin",
    ],
  };
};