module.exports = {
  verbose: true,
  moduleFileExtensions: ['js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!*.config.js',
    '!config/app.js',
    '!lib/server.js',
    '!lib/logger.js',
    '!**/*-test.js',
    '!**/test/helpers/*.js'
  ],
  coverageReporters: [
    'json-summary',
    'json',
    'lcov',
    'text',
    'clover'
  ]
}
