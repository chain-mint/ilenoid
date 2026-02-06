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

});
