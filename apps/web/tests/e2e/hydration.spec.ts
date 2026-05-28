import { expect, test, type ConsoleMessage } from "@playwright/test";

const hydrationWarningPatterns = [
  /hydrated but some attributes/i,
  /hydration failed/i,
  /server rendered html didn't match/i,
];

function isHydrationWarning(message: ConsoleMessage): boolean {
  const text = message.text();

  return hydrationWarningPatterns.some((pattern) => pattern.test(text));
}

test("customers page hydrates without React mismatch warnings", async ({ page }) => {
  const hydrationWarnings: string[] = [];

  page.on("console", (message) => {
    if (isHydrationWarning(message)) {
      hydrationWarnings.push(message.text());
    }
  });

  await page.goto("/customers?status=active&includeArchived=false&page=1&pageSize=50&sort=name");
  await expect(page.getByRole("heading", { name: "Companies" })).toBeVisible();

  expect(hydrationWarnings).toEqual([]);
});
