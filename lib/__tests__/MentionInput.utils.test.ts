// utils/MentionInput.utils.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getCaretCoordinates,
  createVirtualElement,
  calculateDropdownPosition,
  classNames,
} from "../utils/MentionInput.utils";

describe("classNames", () => {
  it("joins truthy class names with spaces", () => {
    expect(classNames("a", undefined, "b", null, false, "c")).toBe("a b c");
  });

  it("returns empty string when no valid classes", () => {
    expect(classNames(undefined, null, false)).toBe("");
  });
});

describe("createVirtualElement", () => {
  it("returns an object with getBoundingClientRect and getClientRects", () => {
    const el = createVirtualElement(10, 20, 50, 60);
    const rect = el.getBoundingClientRect();
    expect(rect.left).toBe(10);
    expect(rect.top).toBe(20);
    expect(rect.width).toBe(50);
    expect(rect.height).toBe(60);
    expect(el.getClientRects()[0]).toEqual(rect);
  });
});

describe("calculateDropdownPosition", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      innerWidth: 800,
      innerHeight: 600,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("positions dropdown below input when space is available", () => {
    const inputRect = { left: 100, top: 100, bottom: 120, width: 200, height: 20, right: 300 } as DOMRect;
    const coords = calculateDropdownPosition(inputRect, 50, 224, 300);
    expect(coords.y).toBeGreaterThan(inputRect.bottom);
  });

  it("positions dropdown above input if not enough space below", () => {
    (window as any).innerHeight = 200; // simulate small viewport
    const inputRect = { left: 100, top: 150, bottom: 170, width: 200, height: 20, right: 300 } as DOMRect;
    const coords = calculateDropdownPosition(inputRect, 50, 224, 300);
    expect(coords.y).toBeLessThan(inputRect.top);
  });

  it("clamps x position within viewport", () => {
    const inputRect = { left: 790, top: 50, bottom: 70, width: 20, height: 20, right: 810 } as DOMRect;
    const coords = calculateDropdownPosition(inputRect, 50, 224, 300);
    expect(coords.x).toBeGreaterThanOrEqual(8);
    expect(coords.x + 224).toBeLessThanOrEqual(800 - 8);
  });
});

describe("getCaretCoordinates", () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement("input");
    input.value = "hello world";
    document.body.appendChild(input);

    // Mock bounding rect
    input.getBoundingClientRect = vi.fn(() => ({
      left: 10,
      top: 20,
      right: 100,
      bottom: 40,
      width: 90,
      height: 20,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    }));

    // Mock computed style
    vi.spyOn(window, "getComputedStyle").mockImplementation(() =>
      ({
        getPropertyValue: () => "",
      }) as any
    );
  });

  afterEach(() => {
    document.body.removeChild(input);
    vi.restoreAllMocks();
  });

  it("returns coordinates object with x and y", () => {
    const coords = getCaretCoordinates(input, 5);
    expect(typeof coords.x).toBe("number");
    expect(typeof coords.y).toBe("number");
  });

  it("clamps position within input value length", () => {
    const coords = getCaretCoordinates(input, 999);
    expect(typeof coords.x).toBe("number");
    expect(typeof coords.y).toBe("number");
  });
});
