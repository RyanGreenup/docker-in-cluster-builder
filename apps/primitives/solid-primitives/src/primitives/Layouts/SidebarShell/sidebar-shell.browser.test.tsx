import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";

import { SidebarShell } from "./index";

const disposers: (() => void)[] = [];

afterEach(() => {
  for (const dispose of disposers) {
    dispose();
  }
  disposers.length = 0;
  document.body.innerHTML = "";
});

const mountShell = (): void => {
  const dispose = render(
    () => (
      <SidebarShell.Root aria-label="Sidebar">
        <SidebarShell.Section title={() => "Explorer"} defaultOpen>
          <span data-testid="explorer-body">files</span>
        </SidebarShell.Section>
        <SidebarShell.Section title={() => "Settings"}>
          <span data-testid="settings-body">toggles</span>
        </SidebarShell.Section>
      </SidebarShell.Root>
    ),
    document.body,
  );
  disposers.push(dispose);
};

const sectionCheckboxes = (): HTMLInputElement[] => [
  ...document.querySelectorAll<HTMLInputElement>(
    '[data-part="sidebar-section"] input[type="checkbox"]',
  ),
];

it("renders sections with defaultOpen reflected in the toggle state", () => {
  mountShell();

  const boxes = sectionCheckboxes();
  expect(boxes).toHaveLength(2);
  expect(boxes[0]?.checked).toBe(true);
  expect(boxes[1]?.checked).toBe(false);
  expect(document.querySelector('[data-testid="explorer-body"]')).not.toBeNull();
});

it("toggles sections independently via their headers", async () => {
  mountShell();

  const boxes = sectionCheckboxes();
  boxes[1]?.click();
  await expect.poll(() => boxes[1]?.checked).toBe(true);
  expect(boxes[0]?.checked).toBe(true);

  boxes[0]?.click();
  await expect.poll(() => boxes[0]?.checked).toBe(false);
  expect(boxes[1]?.checked).toBe(true);
});
