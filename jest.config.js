export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {},
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ]
};
