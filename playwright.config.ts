import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p => p && existsSync(p));
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL: process.env.SITE_URL || 'http://127.0.0.1:4321', launchOptions: { executablePath }, headless: true },
});
