import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import {
  getAccounts,
  registerNGO,
  createProject,
  donateSTX,
  getDonorContribution,
  getProject,
  pauseContract,
  unpauseContract,
} from "./helpers";

describe("STX Donations", () => {
  let accounts: ReturnType<typeof getAccounts>;
  let projectId: number;

  beforeEach(() => {
    accounts = getAccounts();
    registerNGO(accounts.wallet1, "deployer");
    createProject(
      accounts.wallet1,
      1000000,
      ["Milestone 1", "Milestone 2"],
      [500000, 500000],
      null
    );
    projectId = 1;
  });

  it("should allow STX donation to active project", () => {
    const result = donateSTX(projectId, 100000, accounts.wallet2);
    expect(result.result).toBeOk(Cl.uint(100000));

    const contribution = getDonorContribution(projectId, accounts.wallet2);
    expect(contribution.result).toBeUint(100000);

    const project = getProject(projectId);
    if (project.result.type === "some") {
      const projectData = (project.result.value as any).data || project.result.value;
      expect(projectData["total-donated"]).toBeUint(100000);
      expect(projectData.balance).toBeUint(100000);
    }
  });

  it("should reject donation with amount 0", () => {
    const result = donateSTX(projectId, 0, accounts.wallet2);
    expect(result.result).toBeErr(Cl.uint(33)); // ERR_INVALID_DONATION_AMOUNT
  });

  it("should reject donation to non-existent project", () => {
    const result = donateSTX(999, 100000, accounts.wallet2);
    expect(result.result).toBeErr(Cl.uint(30)); // ERR_PROJECT_NOT_FOUND
  });

  it("should accumulate multiple donations from same donor", () => {
    donateSTX(projectId, 100000, accounts.wallet2);
    donateSTX(projectId, 50000, accounts.wallet2);

    const contribution = getDonorContribution(projectId, accounts.wallet2);
    expect(contribution.result).toBeUint(150000);
  });

  it("should reject donation when contract is paused", () => {
    pauseContract("deployer");
    
    const result = donateSTX(projectId, 100000, accounts.wallet2);
    expect(result.result).toBeErr(Cl.uint(60)); // ERR_CONTRACT_PAUSED

    unpauseContract("deployer");
  });
});
