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
    this.editLink = page.getByRole('link', { name: 'Edit', exact: true });
    this.viewHistoryLink = page.getByRole('link', { name: 'View history' });
    this.readLink = page.getByRole('link', { name: 'Read' });
    this.languageButton = page.locator('#p-lang-btn');
    this.languageSearchInput = page.getByRole('textbox', { name: 'Search for a language' });
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
    if (targetLanguage === 'be') {
      await this.languageSearchInput.fill('Бе');
      await this.page.getByRole('link', { name: 'Беларуская', exact: true }).click();
    } else if (targetLanguage === 'ja') {
      await this.languageSearchInput.fill('ja');
      await this.page.getByRole('link', { name: '日本語', exact: true }).click();
    }
    await this.page.waitForLoadState('networkidle');
  }
}
