// SPDX License Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin contracts
// NOTE DA ELIMINARE
// gli import servono rispettivamente per:
// - ERC1155: standard per i token non fungibili che ci permette di creare una sola collection all'interno della quale avrò id del token (articolo) - numero di elementi mintati
// - ERC1155Burnable: standard per i token non fungibili che ci permette di bruciare un token
// - ERC1155Supply: standard per i token non fungibili che aggiunge il tracking del total supply per ogni id
// - Ownable: standard per i token non fungibili che ci permette di definire un owner
// nel nostro caso l'owner di tutto dovrebbe essere il contract (credo)
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArticleNFT is ERC1155, ERC1155Burnable, ERC1155Supply, Ownable {
    constructor () ERC1155("https://ipfs.io/ipfs/QmV7S4Yt1U4qh3p3saDERwM1TPn5sagGgSnU6QDgHp1hmu?filename=nft_logo.jpeg"){}

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    funciton _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}