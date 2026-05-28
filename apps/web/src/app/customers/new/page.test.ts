import NewCustomerPage from "./page";

const navigationMocks = vi.hoisted(() => ({
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => navigationMocks);

describe("NewCustomerPage", () => {
  it("redirects direct creation route visits back to the customer list", () => {
    vi.stubEnv("CUSTOMER_UI_ENABLED", "true");

    NewCustomerPage();

    expect(navigationMocks.redirect).toHaveBeenCalledWith("/customers");
  });
});
