import { Page, expect, Locator } from '@playwright/test';

export class ArticlePage {
  readonly page: Page;
  readonly firstHeading: Locator;
  readonly editLink: Locator;
  readonly viewHistoryLink: Locator;
  readonly readLink: Locator;
  readonly languageButton: Locator;
  readonly languageSearchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstHeading = page.locator('#firstHeading');
    this.editLink = page.locator('#ca-edit a');
    this.viewHistoryLink = page.locator('#ca-history a');
    this.readLink = page.locator('#ca-view a');
    this.languageButton = page.locator('#p-lang-btn');
    this.languageSearchInput= page.locator('input.uls-languagefilter')
  }

  async verifyHeaderIsVisible() {
    await expect(this.firstHeading).toBeVisible();
  }

  async clickEdit() {
    await this.editLink.click();
  }

  async clickViewHistory() {
    await this.viewHistoryLink.click();
  }

  async clickRead() {
    await this.readLink.click();
  }

  async selectLanguage(targetLanguage: string) {
    await this.languageButton.click();
    await this.languageSearchInput.fill(targetLanguage)
    const languageLink = this.page.getByRole('link', { name: targetLanguage, exact: true });
    await languageLink.waitFor({ state: 'visible' });
    await languageLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}
