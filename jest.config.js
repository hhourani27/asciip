/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["./src/**/*.{ts,js}"], // added to correctly configure jest for coverage (see https://github.com/vuejs/vue-cli/issues/1870#issuecomment-1141757462)
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"], // only run tests in files with .test.ts extension
};
