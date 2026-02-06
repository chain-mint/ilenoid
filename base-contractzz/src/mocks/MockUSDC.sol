// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MockUSDC
/// @notice Mock ERC20 token for testing purposes
/// @dev ERC20 token with 6 decimals (matching USDC standard)
///      Mintable for testing. Not for production use.
contract MockUSDC is ERC20 {
    /// @notice Address that can mint tokens (for testing)
    address public minter;

    /// @notice Event emitted when minter is updated
    event MinterUpdated(address indexed oldMinter, address indexed newMinter);

    /// @notice Constructor sets token name, symbol, and initial minter
    /// @param _minter Address that can mint tokens (typically deployer for tests)
    constructor(address _minter) ERC20("Mock USDC", "mUSDC") {
        minter = _minter;
    }

    /// @notice Returns the number of decimals for the token (6, matching USDC)
    /// @return The number of decimals
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /// @notice Mint tokens to a specified address
    /// @param to Address to mint tokens to
    /// @param amount Amount of tokens to mint (in token units, not wei)
    /// @dev Only minter can mint. For testing purposes only.
    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "MockUSDC: only minter can mint");
        _mint(to, amount);
    }

    /// @notice Update the minter address
    /// @param _newMinter New minter address
    /// @dev Only current minter can update
    function setMinter(address _newMinter) external {
        require(msg.sender == minter, "MockUSDC: only minter can update");
        address oldMinter = minter;
        minter = _newMinter;
        emit MinterUpdated(oldMinter, _newMinter);
    }
}

