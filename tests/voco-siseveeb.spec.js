/**
 * VOCO Siseveebi Playwright Testid
 *
 * Ulesanded:
 * 1. VS24 tunniplaani otsimine
 * 2. Opetajate tunniplaanid (kasutades for loop)
 * 3. Erinevate locatorite kasutamine
 * 4. Lehe laadimisaja mootmine
 * 5. Vale parooliga sisselogimine
 *
 * Autor: Agnes Tiit
 * Kuupaev: 2025-11-10
 */

import { test, expect } from "@playwright/test";

const CREDENTIALS = {
  username: "agnes.lootsmann",
  password: "€r33pyP!!PE",
};

const BASE_URL = "https://siseveeb.voco.ee";

// ULESANNE 1: VS24 tunniplaan
test("1. Find VS24 schedule", async ({ page }) => {
  await page.goto("https://voco.ee/");
  await page.click("text=Tunniplaan");
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: "screenshots/vs24-tunniplaan.png",
    fullPage: true,
  });
  console.log("Test 1 valmis: VS24 tunniplaan salvestatud");
});

// ULESANNE 2: Opetajate tunniplaanid (for loop)
const teachers = ["Valvas, Aly", "Vaabel, Maret", "Frolov, Max"];

for (const teacher of teachers) {
  test(`2. Teacher schedule: ${teacher}`, async ({ page }) => {
    await page.goto(
      "https://siseveeb.voco.ee/veebivormid/tunniplaan?oppegrupp=1"
    );
    await page.click("a.chosen-single");
    await page.waitForTimeout(500);
    await page.fill(".chosen-search input", teacher);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    const filename = teacher.toLowerCase().replace(/[,\s]+/g, "-");
    await page.screenshot({
      path: `screenshots/teacher-${filename}.png`,
      fullPage: true,
    });
    console.log(`Test 2 valmis: ${teacher} tunniplaan salvestatud`);
  });
}

// ULESANNE 3: Erinevad locatorid
test("3. Different locators (getByRole, getByText, locator)", async ({
  page,
}) => {
  await page.goto(BASE_URL);
  await page.waitForTimeout(1000);

  // getByRole - leia nupp rolli jargi
  const submitBtn = page.getByRole("button", { name: "Sisene" });
  await expect(submitBtn).toBeVisible();
  console.log("getByRole: Submit nupp leitud");

  // getByText - leia tekst lehel
  const loginText = page.getByText("Kasutajatunnus").first();
  await expect(loginText).toBeVisible();
  console.log("getByText: Kasutajatunnus tekst leitud");

  // locator - leia input element
  const usernameInput = page.locator('input[name="Kasutajatunnus"]');
  await expect(usernameInput).toBeVisible();
  console.log("locator: Kasutajatunnus input leitud");

  await page.screenshot({ path: "screenshots/locators.png" });
  console.log("Test 3 valmis: Locator test laabis");
});

// ULESANNE 4: Lehe laadimisaeg
test("4. Page load time measurement", async ({ page }) => {
  const start = performance.now();
  await page.goto(BASE_URL);
  const end = performance.now();
  const loadTime = end - start;

  console.log(`Lehe laadimisaeg: ${loadTime.toFixed(2)}ms`);
  expect(loadTime).toBeLessThan(5000);
  console.log("Test 4 valmis: Lehe laadimisaeg moodetud");
});

// ULESANNE 5: Vale parool
test("5. Wrong password login", async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForTimeout(1000);

  // Sisesta vale parool
  await page.fill('input[name="Kasutajatunnus"]', CREDENTIALS.username);
  await page.fill('input[name="Parool"]', "ValeParool123");

  // Kliki sisene nupul
  await page.click('button[name="Sisene"]');

  await page.waitForTimeout(2000);

  // Salvesta screenshot veateate kohta
  await page.screenshot({ path: "screenshots/wrong-password.png" });
  console.log("Test 5 valmis: Vale parooli test tehtud");
});
