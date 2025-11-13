import { Page, expect, Locator } from "@playwright/test";

export class ArticlePage {
  readonly page: Page;
  //Search
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  //tabs
  readonly firstHeading: Locator;
  readonly editLink: Locator;
  readonly viewHistoryLink: Locator;
  readonly readLink: Locator;
  readonly helpLink: Locator;
  // language
  readonly languageButton: Locator;
  readonly languageSearchInput: Locator;

  // Edit Modal
  readonly editModal: Locator;
  readonly startEditingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Search
    this.searchInput = page.locator("#searchInput");
    this.searchButton = page.locator("#searchform button"); // Кнопка поиска

    //tabs
    this.firstHeading = page.locator("#firstHeading");
    this.editLink = page.locator("#ca-edit a");
    this.viewHistoryLink = page.locator("#ca-history a");
    this.readLink = page.locator("#ca-view a");
    this.helpLink = page.locator("#mw-indicator-mw-helplink a");

    //language
    this.languageButton = page.locator("#p-lang-btn");
    this.languageSearchInput = page.locator("input.uls-languagefilter");

    // Edit Modal (Стабильные локаторы)
    this.editModal = page.locator("//label[@id='ooui-7']");
    // page.locator("div.oo-ui-dialog");
    this.startEditingButton = page
      .locator(".oo-ui-actionWidget.oo-ui-flaggedElement-primary")
      .getByRole("button");
    // page.locator( 'a.oo-ui-buttonElement-constructive[href*="action=edit"]');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async verifyHeaderIsVisible() {
    await expect(this.firstHeading).toBeVisible();
  }

  async verifyHeaderText(text: string) {
    await expect(this.firstHeading).toContainText(text);
  }

  async clickEdit() {
    await this.editLink.click();
  }

  async verifyModalIsVisible() {
    await expect(this.editModal).toBeVisible();
  }
  async clickStartEditing() {
    await this.startEditingButton.click();
  }

  async verifyModalIsHidden() {
    await expect(this.editModal).toBeHidden();
  }

  async clickViewHistory() {
    await this.viewHistoryLink.click();
  }

  async clickHelpLink() {
    await this.helpLink.click();
  }

  async clickRead() {
    await this.readLink.click();
  }

  async selectLanguage(targetLanguage: string) {
    await this.languageButton.click();
    await this.languageSearchInput.fill(targetLanguage);
    const languageLink = this.page.getByRole("link", {
      name: targetLanguage,
      exact: true,
    });
    await languageLink.waitFor({ state: "visible" });
    await languageLink.click();
    await this.page.waitForLoadState("networkidle");
  }
}
