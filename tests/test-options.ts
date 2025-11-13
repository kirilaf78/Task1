import { test as base } from "@playwright/test";

export type MyTestOptions = {
  searchQuery: string;
  targetLanguage: string;
  targetLanguageSelector: string;
  mainTitle: string;
};

export const test = base.extend<MyTestOptions>({
  searchQuery: ["", { option: true }],
  targetLanguage: ["", { option: true }],
  targetLanguageSelector: ["", { option: true }],
  mainTitle: ["", { option: true }],
});

export { expect } from "@playwright/test";
