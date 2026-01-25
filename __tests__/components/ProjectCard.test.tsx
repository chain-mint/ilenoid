import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/project/ProjectCard";
import { type Project } from "@/types/contract";
import { type Address } from "viem";

const mockProject: Project = {
  id: BigInt(1),
  ngo: "0x1111111111111111111111111111111111111111" as Address,
  donationToken: "0x0000000000000000000000000000000000000000" as Address,
  goal: BigInt("1000000000000000000"), // 1 ETH
  totalDonated: BigInt("500000000000000000"), // 0.5 ETH
  balance: BigInt("500000000000000000"),
  currentMilestone: BigInt(0),
  isActive: true,
  isCompleted: false,
};

describe("ProjectCard Component", () => {
  it("renders project information", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/project #1/i)).toBeInTheDocument();
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it("displays project ID", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/project #1/i)).toBeInTheDocument();
  });

  it("displays NGO address", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/0x1111...1111/i)).toBeInTheDocument();
  });

  it("displays project status", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it("displays goal amount", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/1.0 ETH/i)).toBeInTheDocument();
  });

  it("displays progress percentage", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/50.0%/i)).toBeInTheDocument();
  });

  it("renders View Details button", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByRole("link", { name: /view details/i })).toBeInTheDocument();
  });

  it("renders Donate button", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByRole("button", { name: /donate/i })).toBeInTheDocument();
  });

  it("has correct link href", () => {
    render(<ProjectCard project={mockProject} />);
    const link = screen.getByRole("link", { name: /view details/i });
    expect(link).toHaveAttribute("href", "/project/1");
  });
});

