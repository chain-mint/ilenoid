import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import {
  getAccounts,
  registerNGO,
  createProject,
  donateSTX,
  pauseContract,
  unpauseContract,
  emergencyWithdraw,
  getContractPaused,
  getProjectBalance,
} from "./helpers";

describe("Admin Controls", () => {
  let accounts: ReturnType<typeof getAccounts>;

  beforeEach(() => {
    accounts = getAccounts();
  });

  describe("Pause Mechanism", () => {
    it("should allow owner to pause contract", () => {
      const result = pauseContract("deployer");
      expect(result.result).toBeOk(Cl.bool(true));

      const paused = getContractPaused();
      expect(paused).toBeBool(true);
    });

    it("should not allow non-owner to pause", () => {
      const result = pauseContract("wallet1");
      expect(result.result).toBeErr(Cl.uint(61)); // ERR_UNAUTHORIZED
    });

    it("should allow owner to unpause contract", () => {
      pauseContract("deployer");
      
      const result = unpauseContract("deployer");
      expect(result.result).toBeOk(Cl.bool(true));

      const paused = getContractPaused();
      expect(paused).toBeBool(false);
    });
  });

  describe("Emergency Withdrawal", () => {
    let projectId: number;

    beforeEach(() => {
      registerNGO(accounts.wallet1, "deployer");
      createProject(
        accounts.wallet1,
        1000000,
        ["Milestone 1"],
        [1000000],
        null
      );
      projectId = 1;

      donateSTX(projectId, 500000, accounts.wallet2);
      pauseContract("deployer");
    });

    it("should allow owner to withdraw when paused", () => {
      const balanceBefore = getProjectBalance(projectId);
      expect(balanceBefore).toBeUint(500000);

      const result = emergencyWithdraw(projectId, "deployer");
      expect(result.result).toBeOk(Cl.uint(500000));

      const balanceAfter = getProjectBalance(projectId);
      expect(balanceAfter).toBeUint(0);
    });

    it("should not allow non-owner to withdraw", () => {
      const result = emergencyWithdraw(projectId, "wallet1");
      expect(result.result).toBeErr(Cl.uint(61)); // ERR_UNAUTHORIZED
    });

    it("should reject withdrawal when not paused", () => {
      unpauseContract("deployer");
      
      const result = emergencyWithdraw(projectId, "deployer");
      expect(result.result).toBeErr(Cl.uint(60)); // ERR_CONTRACT_PAUSED
    });
  });
});
