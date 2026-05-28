import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomerCreateSheet } from "@/features/customers/components/customer-create-sheet";

const routerMocks = vi.hoisted(() => ({
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMocks,
}));

vi.mock("@/features/customers/components/customer-create-form", () => ({
  CustomerCreateForm: ({ onCreated }: { onCreated?: (customer: { id: string; name: string }) => void }) => (
    <form aria-label="Create customer">
      <label htmlFor="name">Name</label>
      <input id="name" name="name" />
      <button
        onClick={() => onCreated?.({ id: "7d1d4c14-9b3b-47c2-bd20-f1ea16f6c001", name: "ACME" })}
        type="button"
      >
        Finish
      </button>
    </form>
  ),
}));

describe("CustomerCreateSheet", () => {
  it("opens the customer creation form in a sheet and refreshes the list after creation", async () => {
    const user = userEvent.setup();

    render(<CustomerCreateSheet buttonSize="sm" buttonVariant="outline" label="New" />);

    await user.click(screen.getByRole("button", { name: "New" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "New customer" })).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Create customer" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Finish" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(routerMocks.refresh).toHaveBeenCalledTimes(1);
  });
});
