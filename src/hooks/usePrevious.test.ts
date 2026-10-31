// GT6 test 2 of 3: hook state. A hook only runs inside a component, so
// renderHook makes a tiny one whose only job is to call it.
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import usePrevious from "./usePrevious";

describe("usePrevious", () => {
  it("returns undefined on the first render, when there is no earlier value", () => {
    const { result } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: "reported" },
    });

    expect(result.current).toBeUndefined();
  });

  it("returns the value from the render before the latest one", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: "reported" } },
    );

    // The value changes from "reported" to "claimed" on this render.
    rerender({ value: "claimed" });

    expect(result.current).toBe("reported");
  });
});
