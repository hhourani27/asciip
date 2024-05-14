/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageProvider: "v8", // Added this so that jest correctly generate coverage data with typescript (see https://stackoverflow.com/a/74851858/471461)
};
