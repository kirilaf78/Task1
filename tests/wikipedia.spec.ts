import { test, expect, Page } from '@playwright/test';

test.describe('Wikipedia Scenarios', () => {
  let searchQuery: string;
  let targetLanguage: string;
  let baseUrl: string;

  test.beforeEach(async ({ page }, testInfo) => {
    // Determine environment and set variables
    if (testInfo.project.name === 'PROD-chromium') {
      searchQuery = 'Драматург';
      targetLanguage = 'ja'; // Japanese
      baseUrl = 'https://be.wikipedia.org'; // Base URL for PROD (Belarussian Wikipedia)
    } else { // QA environment
      searchQuery = 'Playwright';
      targetLanguage = 'be'; // Belarussian
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

    // Verify header is expected and take a screenshot
    await expect(page.locator('#firstHeading')).toBeVisible();
    await page.screenshot({ path: `screenshot-${test.info().project.name}-search-result.png` });

    // 3. Click 'Edit'
    await page.getByRole('link', { name: 'Edit', exact: true }).click();

    // 4. Verify Modal is shown
    await expect(page.getByText('Welcome to WikipediaAnyone')).toBeVisible();

    // 5. Click 'Start editing'
    await page.getByRole('button', { name: 'Start editing' }).click();

    // 6. Verify Modal is hidden
    await expect(page.getByText('Welcome to WikipediaAnyone')).toBeHidden();

    // 7. Click 'View history', click 'Help'
    await page.getByRole('link', { name: 'View history' }).click();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#mw-indicator-mw-helplink').getByRole('link', { name: 'Help' }).click(),
    ]);
    await newPage.waitForLoadState('networkidle');

    // Verify Help page opens in a new tab and its URL is expected
    await expect(newPage).toHaveURL(/.*Help:History/);
    await newPage.close(); // Close the help page

    // 8. Go back to 'Read' section of 'Playwright' page (don't use menu link)
    await page.getByRole('link', { name: 'Read' }).click();
    await page.waitForLoadState('networkidle');

    // Open language list, search and select target language
    await page.locator('#p-lang-btn').click(); // Language button
    const languageSearchInput = page.getByRole('textbox', { name: 'Search for a language' });
    if (targetLanguage === 'be') {
      await languageSearchInput.fill('Бе');
      await page.getByRole('link', { name: 'Беларуская', exact: true }).click();
    } else if (targetLanguage === 'ja') {
      await languageSearchInput.fill('ja');
      await page.getByRole('link', { name: '日本語', exact: true }).click();
    }
    await page.waitForLoadState('networkidle');

    // Verify Appropriate article opens, take a screenshot
    await expect(page.locator('#firstHeading')).toBeVisible();
    await page.screenshot({ path: `screenshot-${test.info().project.name}-language-change.png` });
  });
});

