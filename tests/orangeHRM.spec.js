/**
 * OrangeHRM Playwright Testid
 
 * Testitud veebileht: https://opensource-demo.orangehrmlive.com
 * Autor: Agnes
 * Kuupäev: 08.11.2025
 */

import { test, expect } from "@playwright/test";

const BASE_URL =
  "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

/**
 * TEST 1: Edukas sisselogimine ja dashboard kontrollimine
 *
 * Eesmärk: Kontrollida, et kasutaja saab edukalt sisse logida
 * ja dashboard laadib korralikult
 */
test("Test 1: Successful login and dashboard verification", async ({
  page,
}) => {
  // Samm 1: Ava sisselogimise leht
  await page.goto(BASE_URL);

  // Samm 2: Oota lehe laadimist
  await page.waitForLoadState("networkidle");

  // Samm 3: Sisesta kasutajanimi
  await page.fill('input[name="username"]', "Admin");

  // Samm 4: Sisesta parool
  await page.fill('input[name="password"]', "admin123");

  // Samm 5: Kliki "Login" nupul
  await page.click('button[type="submit"]');

  // Samm 6: Oota dashboard lehe laadimist
  await page.waitForURL("**/dashboard/index");

  // Samm 7: Kontrolli, et URL sisaldab "dashboard"
  await expect(page).toHaveURL(/dashboard/);

  // Samm 8: Kontrolli, et "Dashboard" pealkiri on nähtav
  await expect(page.locator("text=Dashboard").first()).toBeVisible();

  // Samm 9: Kontrolli, et kasutaja dropdown on nähtav (tähendab sisse logitud)
  await expect(page.locator(".oxd-userdropdown")).toBeVisible();
});

/**
 * TEST 2: Ebaõnnestunud sisselogimine valede andmetega
 *
 * Eesmärk: Kontrollida, et süsteem näitab veateadet
 * kui kasutaja sisestab valed andmed
 */
test("Test 2: Failed login with invalid credentials", async ({ page }) => {
  // Samm 1: Ava sisselogimise leht
  await page.goto(BASE_URL);

  // Samm 2: Oota lehe laadimist
  await page.waitForLoadState("networkidle");

  // Samm 3: Sisesta vale kasutajanimi
  await page.fill('input[name="username"]', "InvalidUser");

  // Samm 4: Sisesta vale parool
  await page.fill('input[name="password"]', "WrongPassword123");

  // Samm 5: Kliki "Login" nupul
  await page.click('button[type="submit"]');

  // Samm 6: Oota veateate ilmumist
  await page.waitForSelector(".oxd-alert-content", { timeout: 5000 });

  // Samm 7: Kontrolli, et veateade sisaldab "Invalid credentials"
  await expect(page.locator(".oxd-alert-content")).toContainText(
    "Invalid credentials"
  );

  // Samm 8: Kontrolli, et kasutaja jääb sisselogimise lehele
  await expect(page).toHaveURL(/auth\/login/);

  // Samm 9: Kontrolli, et sisselogimise vorm on endiselt nähtav
  await expect(page.locator('input[name="username"]')).toBeVisible();
});

/**
 * TEST 3: Navigeerimine Admin moodulisse ja kasutajate otsing
 *
 * Eesmärk: Kontrollida menüü navigeerimist ja otsingu
 * funktsionaalsust Admin moodulis
 */
test("Test 3: Navigate to Admin module and search users", async ({ page }) => {
  // Samm 1: Ava sisselogimise leht
  await page.goto(BASE_URL);

  // Samm 2: Oota lehe laadimist
  await page.waitForLoadState("networkidle");

  // Samm 3: Logi sisse
  await page.fill('input[name="username"]', "Admin");
  await page.fill('input[name="password"]', "admin123");
  await page.click('button[type="submit"]');

  // Samm 4: Oota dashboard laadimist
  await page.waitForURL("**/dashboard/index");

  // Samm 5: Kliki külgmenüüs "Admin" lingil
  await page.click("text=Admin");

  // Samm 6: Oota Admin lehe laadimist
  await page.waitForURL("**/admin/viewSystemUsers");

  // Samm 7: Kontrolli, et URL sisaldab "admin"
  await expect(page).toHaveURL(/admin/);

  // Samm 8: Kontrolli, et "Admin" pealkiri on nähtav
  await expect(page.locator("text=Admin").first()).toBeVisible();

  // Samm 9: Leia otsinguväli ja sisesta "Admin"
  const searchInput = page.locator(".oxd-input").nth(1);
  await searchInput.fill("Admin");

  // Samm 10: Kliki "Search" nupul
  await page.click('button[type="submit"]');

  // Samm 11: Oota tulemuste laadimist
  await page.waitForTimeout(2000);

  // Samm 12: Kontrolli, et tulemuste tabel on nähtav
  await expect(page.locator(".oxd-table-card").first()).toBeVisible();

  // Samm 13: Kontrolli, et tulemused sisaldavad "Admin" teksti
  await expect(page.locator(".oxd-table-card").first()).toContainText("Admin");
});
