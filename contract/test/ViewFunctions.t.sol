// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Fixtures} from "./Fixtures.t.sol";
import {DataStructures} from "../src/types/DataStructures.sol";

contract ViewFunctionsTest is Fixtures {
    uint256 public projectId;

    function setUp() public override {
        super.setUp();
        // Give donors more ETH for testing large milestones
        vm.deal(donor1, 10000 ether);
        vm.deal(donor2, 10000 ether);
        
        registerNGO(ngo);
        projectId = createTestProject(false); // Create ETH project
    }

    // Task 1: Test hasDonorVoted function for various scenarios
    function testHasDonorVoted() public {
        // Initial state: Not voted
        assertFalse(tracker.hasDonorVoted(projectId, 0, donor1));

        // Donate
        donateETH(donor1, projectId, 10 ether);
        
        // Still not voted
        assertFalse(tracker.hasDonorVoted(projectId, 0, donor1));

        // Vote
        voteMilestone(donor1, projectId);

        // Should be voted
        assertTrue(tracker.hasDonorVoted(projectId, 0, donor1));

        // Check different milestone (not voted)
        assertFalse(tracker.hasDonorVoted(projectId, 1, donor1));

        // Check different donor (not voted)
        assertFalse(tracker.hasDonorVoted(projectId, 0, donor2));
    }

    // Task 2: Test getCurrentMilestone function for active/inactive projects
    function testGetCurrentMilestone() public {
        // Initial state: Milestone 0
        DataStructures.Milestone memory milestone = tracker.getCurrentMilestone(projectId);
        assertEq(milestone.description, "Milestone 1: Initial Setup");
        assertEq(milestone.amountRequested, DEFAULT_MILESTONE_AMOUNT);
        assertFalse(milestone.approved);
        assertFalse(milestone.fundsReleased);

        // Advance to next milestone
        donateETH(donor1, projectId, DEFAULT_MILESTONE_AMOUNT);
        voteMilestone(donor1, projectId);
        releaseFunds(projectId);

        // Check updated state: Milestone 1
        milestone = tracker.getCurrentMilestone(projectId);
        assertEq(milestone.description, "Milestone 2: Final Delivery");
        assertEq(milestone.amountRequested, DEFAULT_MILESTONE_AMOUNT);
        assertFalse(milestone.approved);
        assertFalse(milestone.fundsReleased);
    }

    // Task 3: Test getMilestoneVoteStatus function comprehensively
    function testGetMilestoneVoteStatus() public {
        // Initial state
        (uint256 voteWeight, uint256 snapshot, bool canRelease) = tracker.getMilestoneVoteStatus(projectId, 0);
        assertEq(voteWeight, 0);
        assertEq(snapshot, 0);
        assertFalse(canRelease);

        // Donate 100 ether
        donateETH(donor1, projectId, 100 ether);

        // Vote
        // Snapshot is taken at first vote. Snapshot should be 100 ether.
        // Vote weight should be 100 ether.
        // Quorum is > 50%. 100 > 50. So quorum met.
        // But balance is 100 ether < 500 ether (DEFAULT_MILESTONE_AMOUNT). So canRelease should be false.
        voteMilestone(donor1, projectId);
        
        (voteWeight, snapshot, canRelease) = tracker.getMilestoneVoteStatus(projectId, 0);
        assertEq(voteWeight, 100 ether);
        assertEq(snapshot, 100 ether);
        assertFalse(canRelease);

        // Donate more to reach milestone amount
        // Need 400 more.
        donateETH(donor2, projectId, 400 ether);
        
        // Now balance is 500 ether.
        // But quorum calculation is based on snapshot.
        // Snapshot is 100 ether. Vote weight is 100 ether.
        // 100 > 50 (50% of 100). Quorum met.
        // Balance 500 >= 500. Sufficient balance.
        // canRelease should be true.
        
        (voteWeight, snapshot, canRelease) = tracker.getMilestoneVoteStatus(projectId, 0);
        // Note: donor2 hasn't voted, so voteWeight is still 100 ether.
        // Snapshot is frozen at 100 ether.
        assertTrue(canRelease);
    }

    // Task 4: Test getProjectMilestoneCount function
    function testGetProjectMilestoneCount() public {
        // Default project has 2 milestones
        assertEq(tracker.getProjectMilestoneCount(projectId), 2);

        // Create another project with 3 milestones
        string[] memory descriptions = new string[](3);
        descriptions[0] = "M1";
        descriptions[1] = "M2";
        descriptions[2] = "M3";
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100 ether;
        amounts[1] = 100 ether;
        amounts[2] = 100 ether;

        vm.prank(ngo);
        uint256 projectId2 = tracker.createProject(address(0), 300 ether, descriptions, amounts);

        assertEq(tracker.getProjectMilestoneCount(projectId2), 3);
    }

    // Task 5: Test getDonorContribution function for multiple donations
    function testGetDonorContribution() public {
        // Initial contribution
        assertEq(tracker.getDonorContribution(projectId, donor1), 0);

        // First donation
        donateETH(donor1, projectId, 10 ether);
        assertEq(tracker.getDonorContribution(projectId, donor1), 10 ether);

        // Second donation
        donateETH(donor1, projectId, 5 ether);
        assertEq(tracker.getDonorContribution(projectId, donor1), 15 ether);

        // Another donor
        donateETH(donor2, projectId, 20 ether);
        assertEq(tracker.getDonorContribution(projectId, donor2), 20 ether);
        
        // Ensure donor1 is unaffected
        assertEq(tracker.getDonorContribution(projectId, donor1), 15 ether);
    }

    // Task 6: Test isVerifiedNGO function
    function testIsVerifiedNGO() public {
        // Registered NGO
        assertTrue(tracker.isVerifiedNGO(ngo));

        // Unregistered address
        assertFalse(tracker.isVerifiedNGO(makeAddr("unknown")));

        // Revoke NGO
        vm.prank(owner);
        tracker.revokeNGO(ngo);
        assertFalse(tracker.isVerifiedNGO(ngo));
    }
}
