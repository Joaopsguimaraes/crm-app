import { expect, test } from "@playwright/test";

test("home page renders the CRM app shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "CRM App" })).toBeVisible();
  await expect(page.getByText("Frontend package is ready")).toBeVisible();
});
