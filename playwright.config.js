// @ts-check
// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 60000,
  },
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless:false,
    screenshot: 'on',
    trace: 'on'
  },
});
  

