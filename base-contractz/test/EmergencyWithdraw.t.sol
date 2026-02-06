// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Fixtures} from "./Fixtures.t.sol";
import {CharityTracker} from "../src/CharityTracker.sol";
import {Errors} from "../src/libraries/Errors.sol";
import {DataStructures} from "../src/types/DataStructures.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Emergency Withdraw Tests
/// @notice Tests for emergency withdrawal functionality
contract EmergencyWithdrawTest is Fixtures {
    uint256 public ethProjectId;
    uint256 public erc20ProjectId;

    function setUp() public override {
        super.setUp();
        registerNGO(ngo);
        ethProjectId = createTestProject(false); // ETH project
        erc20ProjectId = createTestProject(true); // ERC20 project
    }

    // =============================================================
    // Phase 17.1: Emergency Withdrawal Tests
    // =============================================================

    function test_OwnerCanWithdrawETH() public {
        // Donate to project
        uint256 donationAmount = 100 ether;
        donateETH(donor1, ethProjectId, donationAmount);

        // Pause contract
        tracker.pause();

        uint256 initialOwnerBalance = address(this).balance;

        // Withdraw
        tracker.emergencyWithdraw(ethProjectId);

        // Check balances
        assertEq(address(this).balance, initialOwnerBalance + donationAmount);
        assertEq(address(tracker).balance, 0);

        // Check project state
        DataStructures.Project memory project = tracker.getProject(ethProjectId);
        assertEq(project.balance, 0);
    }

    function test_OwnerCanWithdrawERC20() public {
        // Donate to project
        uint256 donationAmount = 100 * 10 ** 6;
        donateERC20(donor1, erc20ProjectId, donationAmount);

        // Pause contract
        tracker.pause();

        uint256 initialOwnerBalance = mockUSDC.balanceOf(address(this));

        // Withdraw
        tracker.emergencyWithdraw(erc20ProjectId);

        // Check balances
        assertEq(mockUSDC.balanceOf(address(this)), initialOwnerBalance + donationAmount);
        assertEq(mockUSDC.balanceOf(address(tracker)), 0);

        // Check project state
        DataStructures.Project memory project = tracker.getProject(erc20ProjectId);
        assertEq(project.balance, 0);
    }

    function test_NonOwnerCannotWithdraw() public {
        // Donate to project
        donateETH(donor1, ethProjectId, 10 ether);

        // Pause contract
        tracker.pause();

        // Try to withdraw as donor
        vm.prank(donor1);
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, donor1));
        tracker.emergencyWithdraw(ethProjectId);
    }
    
    // OpenZeppelin Ownable custom error
    error OwnableUnauthorizedAccount(address account);

    // OpenZeppelin Pausable custom error
    error ExpectedPause();

    function test_CannotWithdrawWhenNotPaused() public {
        // Donate to project
        donateETH(donor1, ethProjectId, 10 ether);

        // Try to withdraw without pausing
        vm.expectRevert(abi.encodeWithSelector(ExpectedPause.selector));
        tracker.emergencyWithdraw(ethProjectId);
    }

    function test_WithdrawalEmitsEvent() public {
        uint256 donationAmount = 50 ether;
        donateETH(donor1, ethProjectId, donationAmount);

        tracker.pause();

        vm.expectEmit(true, false, false, true);
        emit CharityTracker.EmergencyWithdrawal(ethProjectId, donationAmount);
        
        tracker.emergencyWithdraw(ethProjectId);
    }

    function test_WithdrawalRevertsForInvalidProject() public {
        tracker.pause();
        
        vm.expectRevert(Errors.ProjectNotFound.selector);
        tracker.emergencyWithdraw(999);
    }

    function test_ZeroBalanceWithdrawal() public {
        // No donations
        tracker.pause();

        uint256 initialOwnerBalance = address(this).balance;

        // Withdraw
        tracker.emergencyWithdraw(ethProjectId);

        // Check balances - nothing should change
        assertEq(address(this).balance, initialOwnerBalance);
        
        // Check project state
        DataStructures.Project memory project = tracker.getProject(ethProjectId);
        assertEq(project.balance, 0);
    }
    
    // Allow test contract to receive ETH
    receive() external payable {}
}
