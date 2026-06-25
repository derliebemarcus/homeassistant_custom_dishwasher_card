export default {
  mutate: ["src/homeassistant_custom_dishwasher_card.js:197-265"],
  testRunner: "command",
  commandRunner: {
    command: "npm run test:unit",
  },
  coverageAnalysis: "off",
  reporters: ["clear-text", "html", "json"],
  thresholds: {
    high: 80,
    low: 65,
    break: 65,
  },
  concurrency: "50%",
  timeoutMS: 10000,
  htmlReporter: {
    fileName: "reports/mutation/mutation.html",
  },
  jsonReporter: {
    fileName: "reports/mutation/mutation.json",
  },
  ignorePatterns: ["coverage", "dist", "reports"],
};
