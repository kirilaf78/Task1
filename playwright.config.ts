import { defineConfig, devices } from "@playwright/test";
import type { MyTestOptions } from "./tests/test-options";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<MyTestOptions>({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { open: "on-failure" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "QA-chromium",
      testMatch: /.*wikipedia.spec.ts/,
      use: {
        ...devices["Desktop Chrome"],
        // QA-specific data
        baseURL: "https://en.wikipedia.org",
        searchQuery: "Playwright",
        targetLanguage: "Драматург",
        targetLanguageSelector: "Беларуская",
        mainTitle: "Wikipedia",
      },
    },

    {
      name: "QA-webkit",
      testMatch: /.*wikipedia.spec.ts/,
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://en.wikipedia.org",
        searchQuery: "Playwright",
        targetLanguage: "Драматург",
        targetLanguageSelector: "Беларуская",
        mainTitle: "Wikipedia",
      },
    },
    {
      name: "PROD-chromium",
      testMatch: /.*wikipedia.spec.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://be.wikipedia.org",
        searchQuery: "Драматург",
        targetLanguage: "劇作家",
        targetLanguageSelector: "日本語",
        mainTitle: "Вікіпедыя",
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
