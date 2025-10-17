export default {
  testEnvironment: 'jsdom',
  transform: {},
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js'
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ]
};
