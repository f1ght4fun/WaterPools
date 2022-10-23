import path from 'path';

/* eslint-disable */
module.exports = {
  displayName: 'WaterPools',
  extensionsToTreatAsEsm: ['.ts'],

  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!(react-markdown|chalk|charvfile|vfile-message|markdown-table|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|rehype-.*|html-void-elements|hast-util-.*|zwitch|hast-to-hyperscript|hastscript|web-namespaces|mdast-util-.*|escape-string-regexp|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|pretty-bytes|ccount|mdast-util-gfm|gemoji)).+\\.(js|jsx|mjs|cjs|ts|tsx)$'
  ],
  moduleNameMapper: {
    chalk: require.resolve('chalk'),
    '#ansi-styles': path.join(require.resolve('chalk').split('chalk')[0], 'chalk/source/vendor/ansi-styles/index.js'),
    '#supports-color': path.join(require.resolve('chalk').split('chalk')[0], 'chalk/source/vendor/supports-color/index.js')
  },
  testEnvironment: 'node',
  include: ['./src/**/*.test.ts'],
  coverageDirectory: 'coverage'
};
