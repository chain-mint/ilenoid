import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import {
  getAccounts,
  registerNGO,
  revokeNGO,
  isVerifiedNGO,
} from "./helpers";

describe("NGO Management", () => {
  let accounts: ReturnType<typeof getAccounts>;

  beforeEach(() => {
    accounts = getAccounts();
  });

  it("should allow owner to register an NGO", () => {
    const result = registerNGO(accounts.wallet1, "deployer");
    expect(result.result).toBeOk(Cl.bool(true));

    const verified = isVerifiedNGO(accounts.wallet1);
    expect(verified.result).toBeBool(true);
  });

  it("should not allow non-owner to register an NGO", () => {
    const result = registerNGO(accounts.wallet2, "wallet1");
    expect(result.result).toBeErr(Cl.uint(61)); // ERR_UNAUTHORIZED
  });

  it("should allow owner to revoke NGO status", () => {
    // First register
    registerNGO(accounts.wallet1, "deployer");
    
    // Then revoke
    const result = revokeNGO(accounts.wallet1, "deployer");
    expect(result.result).toBeOk(Cl.bool(true));

    const verified = isVerifiedNGO(accounts.wallet1);
    expect(verified.result).toBeBool(false);
  });

  it("should not allow non-owner to revoke NGO", () => {
    registerNGO(accounts.wallet1, "deployer");
    
    const result = revokeNGO(accounts.wallet1, "wallet2");
    expect(result.result).toBeErr(Cl.uint(61)); // ERR_UNAUTHORIZED
  });
});
