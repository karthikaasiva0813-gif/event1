const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const USER_A_EMAIL = 'rahulshetty1@gmail.com';
const USER_A_PASSWORD = 'Magiclife1!';
const USER_B_EMAIL = 'rahulshetty1@yahoo.com';
const USER_B_PASSWORD = 'Magiclife1!';

async function login(page, email, password) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/\/events|\/$/);
}

async function logout(page) {
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForURL(/\/login$/);
}

async function bookAnyEvent(page) {
  await page.goto(`${BASE_URL}/events`);
  const bookNowLink = page.getByRole('link', { name: 'Book Now' }).first();
  await expect(bookNowLink).toBeVisible();
  await bookNowLink.click();

  await page.waitForURL(/\/events\/\d+$/);
  await page.locator('#ticket-count').waitFor();

  const countDisplay = page.locator('#ticket-count');
  const currentValue = Number((await countDisplay.textContent()) || '1');
  if (currentValue > 1) {
    const decrementButton = page.locator('button:has-text("-")').first();
    for (let i = 1; i < currentValue; i++) {
      await decrementButton.click();
    }
  }

  await page.getByLabel('Full Name').fill('Booking Tester');
  await page.locator('#customer-email').fill('bookingtester@example.com');
  await page.getByPlaceholder('+91 98765 43210').fill('+91 9876543210');
  await page.getByRole('button', { name: /Confirm Booking/i }).click();

  await page.waitForSelector('.booking-ref');
  const bookingRef = (await page.locator('.booking-ref').textContent())?.trim();
  const bookingUrl = page.url();

  return { bookingRef, bookingUrl };
}

test.describe('Booking management', () => {
  test('user can book an event and see it in My Bookings', async ({ page }) => {
    await login(page, USER_A_EMAIL, USER_A_PASSWORD);

    const booking = await bookAnyEvent(page);
    expect(booking.bookingRef).toMatch(/^[A-Z]-[A-Z0-9]{6}$/);

    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await page.waitForURL(/\/bookings$/);
    await expect(page.getByText(booking.bookingRef)).toBeVisible();
  });

  test('user cannot access another user booking', async ({ page }) => {
    await login(page, USER_A_EMAIL, USER_A_PASSWORD);
    const booking = await bookAnyEvent(page);
    const bookingId = booking.bookingUrl.split('/').at(-1);

    await logout(page);
    await login(page, USER_B_EMAIL, USER_B_PASSWORD);

    await page.goto(`${BASE_URL}/bookings/${bookingId}`);
    await expect(page.getByText('Access Denied')).toBeVisible();
    await expect(page.getByText('You are not authorized to view this booking.')).toBeVisible();
  });
});
