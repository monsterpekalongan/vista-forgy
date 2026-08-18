import { test, expect } from '@playwright/test';

test.describe('Mobile Viewport E2E User Journey', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 12/13/14 viewport

  test('completes mobile onboarding, solves questions, tests navigation across all screens', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // 1. Onboarding
    await expect(page.locator('text=Gym untuk otakmu')).toBeVisible();
    await page.click('button:has-text("Lanjut")');
    await page.click('button:has-text("Lanjut")');
    await page.click('button:has-text("Lanjut")');

    await page.fill('input[placeholder="Contoh: Arif"]', 'Mobile User');
    await page.click('button:has-text("Mulai Sekarang")');

    // 2. Home Dashboard
    await expect(page.locator('text=Selamat')).toBeVisible();
    await expect(page.locator('text=Mobile User')).toBeVisible();

    // 3. Start Session & Answer Question
    await page.click('button:has-text("MULAI HARI INI")');
    await page.waitForTimeout(500);

    const mcOption = page.locator('.btn-choice').first();
    if (await mcOption.isVisible()) {
      await mcOption.click();
    } else {
      const keypadBtn = page.locator('.keypad-btn').first();
      if (await keypadBtn.isVisible()) {
        await keypadBtn.click();
        await page.click('.keypad-btn.submit');
      }
    }

    await page.waitForTimeout(300);

    const summaryBtn = page.locator('button:has-text("Kembali ke Beranda")');
    const backBtn = page.locator('button[aria-label="Kembali"]');

    if (await summaryBtn.isVisible()) {
      await summaryBtn.click();
    } else {
      await backBtn.click();
    }

    // 4. Mobile Bottom Tab Bar Navigation
    const mobileNav = page.locator('nav[aria-label="Mobile Bottom Navigation"]');

    // Peta
    await mobileNav.locator('button:has-text("Peta")').click();
    await expect(page.locator('h1:has-text("Peta Skill")')).toBeVisible();

    // Ujian
    await mobileNav.locator('button:has-text("Ujian")').click();
    await expect(page.locator('h1:has-text("Ujian Promosi Tier")')).toBeVisible();

    // Statistik
    await mobileNav.locator('button:has-text("Statistik")').click();
    await expect(page.locator('h1:has-text("Statistik")')).toBeVisible();

    // Data
    await mobileNav.locator('button:has-text("Data")').click();
    await expect(page.locator('h1:has-text("Manajemen Data & Backup")')).toBeVisible();

    // Pengaturan
    await mobileNav.locator('button:has-text("Pengaturan")').click();
    await expect(page.locator('h1:has-text("Pengaturan")')).toBeVisible();
  });
});

test.describe('Desktop Viewport E2E User Journey', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('completes desktop onboarding, checks sidebar navigation and settings', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Onboarding
    await page.click('button:has-text("Lanjut")');
    await page.click('button:has-text("Lanjut")');
    await page.click('button:has-text("Lanjut")');

    await page.fill('input[placeholder="Contoh: Arif"]', 'Desktop User');
    await page.click('button:has-text("Mulai Sekarang")');

    // Desktop Sidebar Navigation
    const desktopNav = page.locator('nav[aria-label="Desktop Navigation"]');

    await desktopNav.locator('button:has-text("Peta Skill")').click();
    await expect(page.locator('h1:has-text("Peta Skill")')).toBeVisible();

    await desktopNav.locator('button:has-text("Ujian Promosi")').click();
    await expect(page.locator('h1:has-text("Ujian Promosi Tier")')).toBeVisible();

    await desktopNav.locator('button:has-text("Statistik")').click();
    await expect(page.locator('h1:has-text("Statistik")')).toBeVisible();

    await desktopNav.locator('button:has-text("Data & Backup")').click();
    await expect(page.locator('h1:has-text("Manajemen Data & Backup")')).toBeVisible();

    await desktopNav.locator('button:has-text("Pengaturan")').click();
    await expect(page.locator('h1:has-text("Pengaturan")')).toBeVisible();

    // Toggle Serious Mode
    await page.click('button:has-text("OFF")');
    await expect(page.locator('text=ON (KOA Diam)')).toBeVisible();
  });
});
