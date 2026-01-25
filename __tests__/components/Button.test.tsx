import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button Component", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("renders with primary variant", () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-emerald-green");
  });

  it("renders with secondary variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-bitcoin-orange");
  });

  it("renders with danger variant", () => {
    render(<Button variant="danger">Danger Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-charity-red");
  });

  it("renders with small size", () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("renders with medium size (default)", () => {
    render(<Button>Medium Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-4", "py-2", "text-base");
  });

  it("renders with large size", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-6", "py-3", "text-lg");
  });

  it("shows loading state", () => {
    render(<Button isLoading>Loading Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    expect(screen.getAllByText("Loading...").length).toBeGreaterThan(0);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("is disabled when loading", () => {
    render(<Button isLoading>Loading Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("renders with full width", () => {
    render(<Button fullWidth>Full Width Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    const button = screen.getByRole("button");
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );
    const button = screen.getByRole("button");
    button.click();
    expect(handleClick).not.toHaveBeenCalled();
  });
});

