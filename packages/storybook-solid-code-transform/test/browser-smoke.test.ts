import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser } from "playwright";
import { createServer, type ViteDevServer } from "vite";
import { afterAll, beforeAll, expect, it } from "vitest";

// Guards the browser path: Vite serves the package's built `dist/browser.js` to a real
// browser, where the Node `process` global does not exist. The individual `@babel/*`
// packages read `process.*` unguarded (a `ReferenceError` there); the `@babel/standalone`
// build this variant uses must not, so first use must not throw `process is not defined`.

const fixtures = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

let server: ViteDevServer;
let browser: Browser;
let baseUrl: string;

beforeAll(async () => {
  server = await createServer({
    root: fixtures,
    server: { port: 0 },
    logLevel: "silent",
  });
  await server.listen();
  baseUrl = server.resolvedUrls!.local[0];
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
  await server?.close();
});

it("runs inlineStoryArgs in a real browser without a `process` ReferenceError", async () => {
  const page = await browser.newPage();
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  // An unsafe build throws at import time (before the fixture can set __smoke),
  // surfacing as a pageerror — so settle briefly, then assert on what we captured.
  await page.waitForTimeout(1500);
  const smoke = await page.evaluate(() => window.__smoke);
  await page.close();

  if (pageErrors.length > 0) console.error("captured page errors:", pageErrors);
  expect(pageErrors.join("\n")).not.toMatch(/process is not defined/);
  expect(smoke?.error).toBe("");
  expect(smoke?.ok).toBe(true);
  expect(smoke?.output).toContain(`<AutoGrid min="md" gap="normal">`);
});
