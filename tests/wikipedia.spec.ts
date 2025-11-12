import { test, expect, Page, BrowserContext } from '@playwright/test';
import { ArticlePage } from '../pages/articlePage';
import { HelpPage } from '../pages/helpPage';

test.describe('Wikipedia Scenarios', () => {
  let searchQuery: string;
  let targetLanguage: string;
  let baseUrl: string;

  test.beforeEach(async ({ page }, testInfo) => {
    // Determine environment and set variables
    if (testInfo.project.name === 'PROD-chromium') {
      searchQuery = 'Драматург';
      targetLanguage = '日本語'; // Japanese 日本語
      baseUrl = 'https://be.wikipedia.org'; // Base URL for PROD (Belarussian Wikipedia)
    } else { // QA environment
      searchQuery = 'Playwright';
      targetLanguage = 'Беларуская'; // Belarussian
      baseUrl = 'https://en.wikipedia.org'; // Base URL for QA (English Wikipedia)
    }

    // 1. Go to base URL and verify home page is loaded
    await page.goto(baseUrl);
    const expectedHomePageUrl = baseUrl === 'https://be.wikipedia.org' ? baseUrl + '/wiki/%D0%93%D0%B0%D0%BB%D0%BE%D1%9E%D0%BD%D0%B0%D1%8F_%D1%81%D1%82%D0%B0%D1%80%D0%BE%D0%BD%D0%BA%D0%B0' : baseUrl + '/wiki/Main_Page';
    await expect(page).toHaveURL(expectedHomePageUrl);
  });

  test('Wikipedia QA/PROD Test', async ({ page, context }) => {
    // 2. Search for 'Playwright' (or appropriate query)
    await page.locator('#searchInput').fill(searchQuery);
    await page.locator('#searchform button').click();
    await page.waitForLoadState('networkidle');

    const articlePage = new ArticlePage(page);
    // Verify header is expected and take a screenshot
    await articlePage.verifyHeaderIsVisible();
    await page.screenshot({ path: `screenshots/screenshot-${test.info().project.name}-search-result.png` });

    // 3. Click 'Edit'
    await articlePage.clickEdit();

    // 4. Verify Modal is shown
    await expect(page.locator("//label[@id='ooui-7']")).toBeVisible()
    // 5. Click 'Start editing'
    await page.locator('.oo-ui-actionWidget.oo-ui-flaggedElement-primary').getByRole('button').click();

    // 6. Verify Modal is hidden
    await expect(page.locator("//label[@id='ooui-7']")).toBeHidden();

    // 7. Click 'View history', click 'Help'
    await articlePage.clickViewHistory();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      articlePage.page.locator('#mw-indicator-mw-helplink a').click(),
    ]);
    await newPage.waitForLoadState('networkidle');

    const helpPage = new HelpPage(newPage);
    // Verify Help page opens in a new tab and its URL is expected
    await helpPage.verifyHelpPageUrl();
    await newPage.close(); // Close the help page

    // 8. Go back to 'Read' section of 'Playwright' page (don't use menu link)
    await articlePage.clickRead();

    // Open language list, search and select target language
    await articlePage.selectLanguage(targetLanguage);

    // Verify Appropriate article opens, take a screenshot
    await articlePage.verifyHeaderIsVisible();
    await page.screenshot({ path: `screenshots/screenshot-${test.info().project.name}-language-change.png` });
  });
});

