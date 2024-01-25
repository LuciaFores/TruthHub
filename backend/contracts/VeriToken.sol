// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract VeriToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    /// Constructor of the contract, the token is initialized with the name and the symbol
    /// MODIFIER :
    /// - none
    /// INPUT :
    /// - the address of the owner of the contract
    /// OUTPUT :
    /// - none
    constructor(
        address initialOwner
    )
        ERC20("VeriToken", "VERI")
        Ownable(initialOwner)
        ERC20Permit("VeriToken")
    {}

    /// Function to mint a new token
    /// MODIFIER :
    /// - onlyOwner, the function can only be called by the owner of the contract
    /// INPUT :
    /// - the address of the account to which the token is minted
    /// - the amount of token minted
    /// OUTPUT :
    /// - none
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
