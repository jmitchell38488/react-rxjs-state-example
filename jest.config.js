module.exports = {
  roots: [ "<rootDir>/src" ],
  testMatch: [ "<rootDir>/src/**/*.test.js" ],
  testEnvironment: "jsdom",
  bail: true,
  verbose: true,
  errorOnDeprecated: false,
  setupFiles: [ "<rootDir>/enzyme.setup.js" ]
}