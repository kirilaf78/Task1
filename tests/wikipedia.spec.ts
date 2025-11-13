// Importing our custom 'test'
import { test, expect } from "./test-options";
import { ArticlePage } from "../pages/articlePage";
import { HelpPage } from "../pages/helpPage";

test("Wikipedia E2E Flow", async ({
  page,
  context,
  searchQuery,
  targetLanguageSelector,
  targetLanguage,
  mainTitle,
}) => {
  const articlePage = new ArticlePage(page);

  // 1. Go to base URL and verify
  await page.goto("/");
  await expect(page).toHaveTitle(new RegExp(mainTitle));
  // 2. Search
  await articlePage.search(searchQuery);
  await articlePage.verifyHeaderIsVisible();
  await articlePage.verifyHeaderText(searchQuery);
  await page.screenshot({
    path: `screenshots/search-result-${test.info().project.name}.png`,
  });

  // 3. Click 'Edit'
  await articlePage.clickEdit();

  // 4. Verify Modal
  await articlePage.verifyModalIsVisible();

  // 5. Click 'Start editing' (используем метод из POM)
  await articlePage.clickStartEditing();

  // 6. Verify Modal is hidden
  await articlePage.verifyModalIsHidden();

  // 7. Click 'View history', click 'Help'
  await articlePage.clickViewHistory();

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    articlePage.clickHelpLink(),
  ]);
  await newPage.waitForLoadState("networkidle");

  const helpPage = new HelpPage(newPage);
  await helpPage.verifyHelpPageUrl();
  await newPage.close();

  // 8. Go back to 'Read' section
  await articlePage.clickRead();

  // Open language list and select target language
  await articlePage.selectLanguage(targetLanguageSelector);

  // Verify Appropriate article opens
  await articlePage.verifyHeaderIsVisible();
  // Verify page title is in Belarusian or Japanese
  await articlePage.verifyHeaderText(targetLanguage);
  await page.screenshot({
    path: `screenshots/language-switch-${test.info().project.name}.png`,
  });
});
