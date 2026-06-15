import { render } from "solid-js/web";
import { afterEach, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { Dialog } from "./index";

const disposers: (() => void)[] = [];

afterEach(() => {
  for (const dispose of disposers) {
    dispose();
  }
  disposers.length = 0;
  document.body.innerHTML = "";
});

const content = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('[data-part="dialog-content"]');

const renderDialog = (): void => {
  const dispose = render(
    () => (
      <Dialog.Root>
        <Dialog.Trigger>Open settings</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Label>Settings</Dialog.Label>
            <Dialog.Description>Adjust your preferences</Dialog.Description>
            <button type="button">Save</button>
            <Dialog.Close>Done</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ),
    document.body,
  );
  disposers.push(dispose);
};

const open = async (): Promise<void> => {
  await page.getByRole("button", { name: "Open settings" }).click();
  await expect.element(page.getByRole("dialog")).toBeInTheDocument();
};

test("trigger opens the dialog with correct role, modality and part hooks", async () => {
  renderDialog();
  expect(content()).toBeNull();

  await open();

  const el = content();
  expect(el?.getAttribute("role")).toBe("dialog");
  expect(el?.getAttribute("aria-modal")).toBe("true");
  expect(el).toHaveAttribute("data-open");
});

test("label and description are wired through aria attributes", async () => {
  renderDialog();
  await open();

  const labelId = document.querySelector<HTMLElement>('[data-part="dialog-label"]')?.id;
  const descId = document.querySelector<HTMLElement>('[data-part="dialog-description"]')?.id;
  expect(labelId).toBeTruthy();
  expect(descId).toBeTruthy();
  expect(content()?.getAttribute("aria-labelledby")).toBe(labelId);
  expect(content()?.getAttribute("aria-describedby")).toBe(descId);
});

test("Escape key closes the dialog", async () => {
  renderDialog();
  await open();

  await userEvent.keyboard("{Escape}");
  await expect.poll(() => content()).toBeNull();
});

test("a pointer interaction on the overlay (outside the content) closes the dialog", async () => {
  renderDialog();
  await open();

  // The overlay covers the viewport *behind* the centered content, so a
  // Coordinate click at its centre would land on the content. Drive corvu's
  // Outside-pointer handler directly by dispatching the pointer sequence on the
  // Overlay element (default strategy closes on `pointerup`).
  const overlay = document.querySelector<HTMLElement>('[data-part="dialog-overlay"]');
  if (overlay === null) {
    throw new Error("overlay element was not rendered");
  }
  overlay.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
  overlay.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
  await expect.poll(() => content()).toBeNull();
});

test("the Close button closes the dialog", async () => {
  renderDialog();
  await open();

  // Corvu stamps `aria-label="close"` on Dialog.Close, so that is its
  // Accessible name regardless of the visible "Done" text.
  await page.getByRole("button", { name: "close" }).click();
  await expect.poll(() => content()).toBeNull();
});

test("focus moves into the dialog on open and returns to the trigger on close", async () => {
  renderDialog();
  const trigger = page.getByRole("button", { name: "Open settings" });
  await trigger.click();
  await expect.element(page.getByRole("dialog")).toBeInTheDocument();

  await expect.poll(() => content()?.contains(document.activeElement)).toBe(true);

  await userEvent.keyboard("{Escape}");
  await expect.element(trigger).toHaveFocus();
});
