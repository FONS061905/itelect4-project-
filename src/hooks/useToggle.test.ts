// GT6 hook test: renderHook runs useToggle inside a tiny test component,
// so the hook's state can be read and its function called.
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useToggle from "./useToggle";

describe("useToggle", () => {
  it("starts at the value it was given", () => {
    const { result } = renderHook(() => useToggle(false));

    // result.current is the tuple [value, toggle] from the latest render.
    expect(result.current[0]).toBe(false);
  });

  it("flips the value each time toggle is called", () => {
    const { result } = renderHook(() => useToggle(true));

    // A state change goes inside act(): React finishes the re-render
    // before the next line reads result.current.
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
  });
});
