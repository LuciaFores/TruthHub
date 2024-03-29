// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract ArticleNFT is ERC1155, ERC1155Burnable, Ownable, ERC1155Supply {
    /// Constructor of the contract, the NFT is initialized with the ipfs link of the logo
    /// MODIFIER :
    /// - none
    /// INPUT :
    /// - the address of the owner of the contract
    /// OUTPUT :
    /// - none
    constructor(
        address initialOwner
    )
        ERC1155(
            "https://ipfs.io/ipfs/QmV7S4Yt1U4qh3p3saDERwM1TPn5sagGgSnU6QDgHp1hmu?filename=nft_logo.jpeg"
        )
        Ownable(initialOwner)
    {}

    /// Function to mint a new NFT
    /// MODIFIER :
    /// - onlyOwner, the function can only be called by the owner of the contract
    /// INPUT :
    /// - the address of the account to which the NFT is minted
    /// - the id of the NFT
    /// - the amount of NFT minted and the data
    /// OUTPUT :
    /// - none

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    /// Function to mint a batch of new NFT
    /// MODIFIER :
    /// - onlyOwner, the function can only be called by the owner of the contract
    /// INPUT :
    /// - the address of the account to which the NFT is minted
    /// - the ids of the NFT
    /// - the amounts of NFT minted and the data
    /// OUTPUT :
    /// - none
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    // The following function is override required by Solidity
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }
}
