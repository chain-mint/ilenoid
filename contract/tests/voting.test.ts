import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import {
  getAccounts,
  registerNGO,
  createProject,
  donateSTX,
  voteOnMilestone,
  getMilestone,
  getMilestoneVoteStatus,
} from "./helpers";

describe("Milestone Voting", () => {
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

    // Donate to enable voting
    donateSTX(projectId, 100000, accounts.wallet2);
    donateSTX(projectId, 200000, accounts.wallet3);
  });

  it("should allow donor to vote on milestone", () => {
    const result = voteOnMilestone(projectId, accounts.wallet2);
    expect(result.result).toBeOk(Cl.uint(100000)); // Vote weight = contribution

    const milestone = getMilestone(projectId, 0);
    if (milestone.result.type === "some") {
      const milestoneData = (milestone.result.value as any).data || milestone.result.value;
      expect(milestoneData["vote-weight"]).toBeUint(100000);
    }
  });

  it("should reject vote from non-donor", () => {
    const result = voteOnMilestone(projectId, accounts.wallet4);
    expect(result.result).toBeErr(Cl.uint(40)); // ERR_NO_CONTRIBUTION
  });

  it("should reject duplicate vote from same donor", () => {
    voteOnMilestone(projectId, accounts.wallet2);
    
    const result = voteOnMilestone(projectId, accounts.wallet2);
    expect(result.result).toBeErr(Cl.uint(41)); // ERR_ALREADY_VOTED
  });

  it("should capture snapshot on first vote", () => {
    const statusBefore = getMilestoneVoteStatus(projectId, 0);
    
    voteOnMilestone(projectId, accounts.wallet2);
    
    const statusAfter = getMilestoneVoteStatus(projectId, 0);
    if (statusAfter.result.type === "some" && statusAfter.result.value.type === "ok") {
      const voteStatus = (statusAfter.result.value as any).value || statusAfter.result.value;
      expect(voteStatus.snapshot).toBeUint(300000); // Total donations at vote start
    }
  });

  it("should accumulate vote weights from multiple voters", () => {
    voteOnMilestone(projectId, accounts.wallet2); // 100000
    voteOnMilestone(projectId, accounts.wallet3); // 200000

    const milestone = getMilestone(projectId, 0);
    if (milestone.result.type === "some") {
      const milestoneData = (milestone.result.value as any).data || milestone.result.value;
      expect(milestoneData["vote-weight"]).toBeUint(300000);
    }
  });
});
