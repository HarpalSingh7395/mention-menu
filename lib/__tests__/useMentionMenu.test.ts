// hooks/useMentionInput.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMentionInput } from "../hooks/useMentionInput";
import type { MentionOption } from "../types/MentionInput.types";

const options: MentionOption[] = [
  { value: "alice", label: "Alice" },
  { value: "bob", label: "Bob" },
  { value: "charlie", label: "Charlie" },
];

describe("useMentionInput", () => {
  let onChange: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    onChange = vi.fn();
  });

  it("filters unselectedOptions correctly", () => {
    const { result, rerender } = renderHook(
      (props: { value: string[] }) =>
        useMentionInput(options, props.value, onChange),
      { initialProps: { value: [] } }
    );

    expect(result.current.unselectedOptions).toHaveLength(3);

    rerender({ value: ["alice"] as never[] });
    expect(result.current.unselectedOptions.map((o) => o.value)).toEqual([
      "bob",
      "charlie",
    ]);
  });

  it("filters options based on mentionQuery", () => {
    const { result } = renderHook(() =>
      useMentionInput(options, [], onChange)
    );

    act(() => {
      result.current.handleSearchChange({
        target: { value: "bo" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.mentionQuery).toBe("bo");
    expect(result.current.filteredOptions.map((o) => o.value)).toEqual(["bob"]);
  });

  it("handleInputChange opens menu when @ is typed", () => {
    const { result } = renderHook(() =>
      useMentionInput(options, [], onChange)
    );

    act(() => {
      result.current.handleInputChange({
        target: { value: "hello @a", selectionStart: 8 },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.showMenu).toBe(true);
    expect(result.current.mentionQuery).toBe("a");
  });

  it("handleInputChange closes menu if no @ found", () => {
    const { result } = renderHook(() =>
      useMentionInput(options, [], onChange)
    );

    act(() => {
      result.current.handleInputChange({
        target: { value: "hello world", selectionStart: 11 },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.showMenu).toBe(false);
    expect(result.current.mentionQuery).toBe("");
  });

  it("handleRemove calls onChange without removed value", () => {
    const { result } = renderHook(() =>
      useMentionInput(options, ["alice", "bob"], onChange)
    );

    act(() => {
      result.current.handleRemove("alice");
    });

    expect(onChange).toHaveBeenCalledWith(["bob"]);
  });

  it("handleSelect inserts token and closes menu", () => {
    const { result } = renderHook(() =>
      useMentionInput(options, [], onChange)
    );

    act(() => {
      result.current.handleSelect(options[0]);
    });

    expect(onChange).toHaveBeenCalledWith(["alice"]);
    expect(result.current.showMenu).toBe(false);
  });

  it("handleKeyDown navigates with arrows and selects with Enter", () => {
    const { result } = renderHook(() =>
      useMentionInput(options, [], onChange)
    );

    // open menu
    act(() => {
      result.current.handleInputChange({
        target: { value: "@", selectionStart: 1 },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.showMenu).toBe(true);

    // arrow down
    act(() => {
      result.current.handleKeyDown({ key: "ArrowDown", preventDefault: vi.fn() } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.activeIndex).toBe(1);

    // arrow up
    act(() => {
      result.current.handleKeyDown({ key: "ArrowUp", preventDefault: vi.fn() } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(result.current.activeIndex).toBe(0);

    // enter to select
    act(() => {
      result.current.handleKeyDown({ key: "Enter", preventDefault: vi.fn() } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(onChange).toHaveBeenCalledWith(["alice"]);
  });

  it("Escape closes menu", () => {
    const { result } = renderHook(() =>
      useMentionInput(options, [], onChange)
    );

    act(() => {
      result.current.handleInputChange({
        target: { value: "@", selectionStart: 1 },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.showMenu).toBe(true);

    act(() => {
      result.current.handleKeyDown({ key: "Escape", preventDefault: vi.fn() } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.showMenu).toBe(false);
  });
});
