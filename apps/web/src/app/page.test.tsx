import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("shows the CRM app health summary", () => {
    render(createElement(HomePage));

    expect(screen.getByRole("heading", { name: "CRM App" })).toBeInTheDocument();
    expect(screen.getByText("crm-app")).toBeInTheDocument();
  });
});
