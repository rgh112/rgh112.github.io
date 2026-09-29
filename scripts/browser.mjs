import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';

export async function launchBrowser() {
  const candidates = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean);
  const executablePath = candidates.find(path => existsSync(path));
  return chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
}
