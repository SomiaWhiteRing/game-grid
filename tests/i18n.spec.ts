import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const legacyLocales = [
  "zh-CN",
  "zh-TW",
  "en",
  "ja",
];

test("renders simplified Chinese homepage", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "构成我的9款游戏" })
  ).toBeVisible();
  await expect(page.getByText("0 / 9 已选择")).toBeVisible();
});

for (const locale of legacyLocales) {
  test(`redirects /${locale} to /`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { name: "构成我的9款游戏" })
    ).toBeVisible();
  });
}

