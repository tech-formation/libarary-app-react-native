module.exports = {
    'extends': 'airbnb',
    'parser': 'babel-eslint',
    'env': {
      'jest': true,
    },
    'rules': {
      'no-use-before-define': 'off',
      'react/jsx-filename-extension': 'off',
      'react/prop-types': 'off',
      'comma-dangle': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-vars': 'error',
      'object-curly-newline': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'arrow-body-style': 'off',
      'import/order': 'off',
      'global-require': 'off',
    },
    'globals': {
      'fetch': false
    }
  }