module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:eslint-comments/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-var-requires': 'off',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    "array-element-newline": ["error", {
      "ArrayExpression": "always",
      "ArrayPattern": { "minItems": 3 },
    }],
    // brake array elements with newline
    "array-bracket-newline": ["error", {
      "multiline": true,
      "minItems": 3,
      "consistent": true,
    }],
    // brake object elements with newline
    "object-curly-newline": ["error", {
      "ObjectExpression": { "minProperties": 3 },
      "ObjectPattern": { "minProperties": 3 },
      "ImportDeclaration": { "minProperties": 3 },
      "ExportDeclaration": { "minProperties": 3 },
    }],

  },

}
