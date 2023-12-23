// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Contract per il token ERC20 usato per votare
// credo serva un altro token per "misurare" la reputazione (è quello che poi possiamo convertire in eth)

// Import OpenZeppelin contracts
// NOTE DA ELIMINARE
// gli import servono rispettivamente per:
// - ERC20: standard per token custom su ethereum
// - ERC20Burnable: standard per i token custom che ci permette di bruciare un token
// - ERC20Snapshot: standard per i token custom che ci permette di creare uno snapshot del token
// lo snapshot permette di salvare il balance a la total supply presenti al momento dello snapshot
// - ERC20Permit: standard per i token custom che ci permette di aggiungere la funzione di permit
// che serve per cambiare l'account allowance dell'ERC20
// - ERC20Votes: standard per i token custom che ci permette di aggiungere la funzione di vote (?)
// - Ownable: standard per i token custom che ci permette di definire un owner
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Veri is
    ERC20,
    ERC20Burnable,
    ERC20Snapshot,
    ERC20Permit,
    ERC20Votes,
    Ownable
{
    constructor() ERC20("Veri", "VERI") ERC20Permit("Veri") {}

    function snapshot() public onlyOwner {
        _snapshot();
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Snapshot) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(
        address account,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._mint(account, amount);
    }

    function _burn(
        address account,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}
