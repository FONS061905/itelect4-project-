// GT6 test 3 of 3: form validation. The test types into the real form
// and presses the real button, the way a person would.
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterPage from "./RegisterPage";

// RegisterPage calls useNavigate and useMutation, and both throw unless
// the component sits inside the providers main.tsx gives the real app.
function renderRegisterPage() {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

// Put fetch back after every test, so a spy from one test cannot leak
// into the next.
afterEach(() => {
  vi.restoreAllMocks();
});

describe("RegisterPage", () => {
  it("shows the name, email and password messages when the form is sent empty", async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.click(screen.getByRole("button", { name: "Create Account" }));

    // The exact sentences from src/schemas/authSchema.ts.
    expect(
      await screen.findByText("Your name is required."),
    ).toBeInTheDocument();
    expect(screen.getByText("That is not an email address.")).toBeInTheDocument();
    expect(screen.getByText("At least 8 characters.")).toBeInTheDocument();
  });

  it("sends nothing to the API while the password is too short", async () => {
    // Watch fetch without stopping it. If the form got past the schema,
    // apiFetch in client.ts would call fetch and this spy would count it.
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText("Name"), "Juan Dela Cruz");
    await user.type(screen.getByLabelText("Email"), "juan@dlsl.edu.ph");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    expect(
      await screen.findByText("At least 8 characters."),
    ).toBeInTheDocument();
    // Name and email were fine, so their messages are not on the page.
    expect(
      screen.queryByText("Your name is required."),
    ).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
