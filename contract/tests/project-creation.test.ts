import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import {
  getAccounts,
  registerNGO,
  createProject,
  getProject,
  getProjectCounter,
} from "./helpers";

describe("Project Creation", () => {
  let accounts: ReturnType<typeof getAccounts>;

  beforeEach(() => {
    accounts = getAccounts();
    registerNGO(accounts.wallet1, "deployer");
  });

  it("should allow verified NGO to create a project", () => {
    const result = createProject(
      accounts.wallet1,
      1000000, // 1 STX goal
      ["Milestone 1", "Milestone 2"],
      [500000, 500000], // 0.5 STX each
      null // STX project
    );

    expect(result.result).toBeOk(Cl.uint(1));

    const project = getProject(1);
    expect(project.result.type).toBe("some"); // some
    if (project.result.type === "some") {
      const val = project.result.value as any;
      const projectData = val.data || val;
      expect((projectData.id ?? projectData["id"])).toBeUint(1);
      expect((projectData.ngo ?? projectData["ngo"])).toBePrincipal(accounts.wallet1);
      expect((projectData.goal ?? projectData["goal"])).toBeUint(1000000);
      expect((projectData["is-active"] ?? projectData.isActive)).toBeBool(true);
      expect((projectData["is-completed"] ?? projectData.isCompleted)).toBeBool(false);
    }
  });

  it("should not allow non-verified NGO to create project", () => {
    const result = createProject(
      accounts.wallet2, // Not verified
      1000000,
      ["Milestone 1"],
      [1000000],
      null
    );

    expect(result.result).toBeErr(Cl.uint(13)); // ERR_NOT_VERIFIED_NGO
  });

  it("should reject project with invalid goal (0)", () => {
    const result = createProject(
      accounts.wallet1,
      0, // Invalid goal
      ["Milestone 1"],
      [1000000],
      null
    );

    expect(result.result).toBeErr(Cl.uint(20)); // ERR_INVALID_GOAL
  });

  it("should reject project when milestone sum exceeds goal", () => {
    const result = createProject(
      accounts.wallet1,
      1000000, // Goal: 1 STX
      ["Milestone 1", "Milestone 2"],
      [600000, 500000], // Sum: 1.1 STX (exceeds goal)
      null
    );

    expect(result.result).toBeErr(Cl.uint(23)); // ERR_MILESTONE_SUM_EXCEEDS_GOAL
  });

  it("should increment project counter", () => {
    const counterBefore = getProjectCounter();
    expect(counterBefore).toBeUint(0);

    createProject(accounts.wallet1, 1000000, ["Milestone 1"], [1000000], null);

    const counterAfter = getProjectCounter();
    expect(counterAfter).toBeUint(1);
  });
});
