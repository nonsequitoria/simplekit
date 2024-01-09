/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "./src"],
  // rootdir: "./",
  // converageDirectory: "<rootDir>/coverage",
  // collectCoverageFrom: [
  //   "<rootDir>/src/**/*.ts"
  // ],
  // testPathIgnorePatterns: ["<rootDir>/node_modules"],
  // coverageReporters: ["json", "html"],
  // testMatch: ["<rootDir>/src/**/*.test.ts"]
};
