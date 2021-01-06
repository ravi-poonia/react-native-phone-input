module.exports = {
  parser: 'babel-eslint',
  plugins: ['react', 'react-native'],
  extends: ['eslint:recommended', 'plugin:react-native/all', '@react-native-community'],
  rules: {
    'comma-dangle': 'off',
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-color-literals': 2,
    'react-native/no-raw-text': 2,
    'react-native/no-single-element-style-arrays': 2,
    'react-native/no-inline-styles': 0
  },
  globals: {
    fetch: false
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
};
