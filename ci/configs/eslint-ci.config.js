/**
 * ESLint Configuration for CI Pipeline
 * Stricter rules for production readiness
 */

module.exports = {
  extends: [
    '../.eslintrc.js'  // Extend base configuration
  ],
  
  env: {
    node: true,
    es2022: true,
    jest: true
  },
  
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  
  // CI-specific rules - stricter than development
  rules: {
    // Security rules - zero tolerance in CI
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    
    // Code quality - enforced in CI
    'complexity': ['error', { max: 10 }],
    'max-depth': ['error', { max: 4 }],
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
    'max-nested-callbacks': ['error', { max: 3 }],
    'max-params': ['error', { max: 5 }],
    'max-statements': ['error', { max: 20 }],
    
    // Performance rules
    'no-await-in-loop': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-constant-binary-expression': 'error',
    'no-constructor-return': 'error',
    'no-duplicate-imports': 'error',
    'no-new-native-nonconstructor': 'error',
    'no-promise-executor-return': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'error',
    'no-unused-private-class-members': 'error',
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'require-atomic-updates': 'error',
    
    // Best practices - stricter
    'accessor-pairs': 'error',
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'class-methods-use-this': 'error',
    'consistent-return': 'error',
    'default-case': 'error',
    'default-case-last': 'error',
    'dot-notation': 'error',
    'eqeqeq': ['error', 'always'],
    'guard-for-in': 'error',
    'no-alert': 'error',
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-div-regex': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'no-empty-pattern': 'error',
    'no-eq-null': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-fallthrough': 'error',
    'no-floating-decimal': 'error',
    'no-global-assign': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': ['error', { ignore: [-1, 0, 1, 2], ignoreArrayIndexes: true }],
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-wrappers': 'error',
    'no-octal': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-proto': 'error',
    'no-redeclare': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-catch': 'error',
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    'no-warning-comments': ['warn', { terms: ['todo', 'fixme'], location: 'start' }],
    'no-with': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-regex-literals': 'error',
    'radix': 'error',
    'require-await': 'error',
    'vars-on-top': 'error',
    'wrap-iife': 'error',
    'yoda': 'error',
    
    // Node.js specific rules
    'handle-callback-err': 'error',
    'no-buffer-constructor': 'error',
    'no-mixed-requires': 'error',
    'no-new-require': 'error',
    'no-path-concat': 'error',
    'no-process-env': 'off', // We need process.env for configuration
    'no-process-exit': 'error',
    'no-sync': ['error', { allowAtRootLevel: true }],
    
    // ES6+ rules
    'arrow-body-style': 'error',
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': 'error',
    'constructor-super': 'error',
    'generator-star-spacing': 'error',
    'no-class-assign': 'error',
    'no-confusing-arrow': 'error',
    'no-const-assign': 'error',
    'no-dupe-class-members': 'error',
    'no-duplicate-imports': 'error',
    'no-new-symbol': 'error',
    'no-restricted-imports': 'error',
    'no-this-before-super': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'require-yield': 'error',
    'rest-spread-spacing': 'error',
    'sort-imports': 'error',
    'symbol-description': 'error',
    'template-curly-spacing': 'error',
    'yield-star-spacing': 'error'
  },
  
  // Override rules for test files
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
      rules: {
        'no-magic-numbers': 'off',
        'max-lines-per-function': 'off',
        'max-statements': 'off'
      }
    },
    {
      files: ['ci/scripts/**/*.js'],
      rules: {
        'no-console': 'off',  // CI scripts need console output
        'no-process-exit': 'off',  // CI scripts may need to exit
        'no-sync': 'off'  // CI scripts can use sync operations
      }
    }
  ],
  
  // Ignore patterns for CI
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'ci/reports/',
    '*.min.js',
    'dist/',
    'build/'
  ]
};