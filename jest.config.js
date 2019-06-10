module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ["**/test/**/*.test.(ts|js)"],
  testEnvironment: "node",
  preset: "ts-jest",
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10
    }
  },
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "junit", outputName: "./jest-junit.xml" }]
  ],
  roots: ["<rootDir>/src/", "<rootDir>/test/"],
  timers: "fake"
};
