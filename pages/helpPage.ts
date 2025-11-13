import { Page, expect } from "@playwright/test";

export class HelpPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyHelpPageUrl() {
    await expect(this.page).toHaveURL(/.*Help:History/);
  }
}
