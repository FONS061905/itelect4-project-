// GT6 test 1 of 3: a component render. The test checks the exact text
// a person reads, and that the text changes when the prop changes.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";
import { ItemStatus } from "../models";

describe("StatusBadge", () => {
  it("shows the status word the item currently has", () => {
    render(<StatusBadge status={ItemStatus.Verified} />);

    expect(screen.getByText("verified")).toBeInTheDocument();
  });

  it("changes its text when the status prop changes", () => {
    const { rerender } = render(<StatusBadge status={ItemStatus.Claimed} />);
    expect(screen.getByText("claimed")).toBeInTheDocument();

    // Same component, a new prop: the old word must be gone.
    rerender(<StatusBadge status={ItemStatus.Returned} />);

    expect(screen.getByText("returned")).toBeInTheDocument();
    expect(screen.queryByText("claimed")).not.toBeInTheDocument();
  });
});
