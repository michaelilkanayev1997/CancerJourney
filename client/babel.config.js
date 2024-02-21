module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
        },
      ],
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@components": "./src/components",
            "@utils": "./src/utils",
            "@views": "./src/views",
            "@ui": "./src/ui",
            src: "./src",
          },
        },
        "react-native-reanimated/plugin",
      ],
    ],
  };
};
