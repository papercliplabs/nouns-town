// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NounsTownTicket is ERC721, Ownable {
    ////
    // Constants
    ////
    uint256 public immutable SALE_PRICE;
    uint256 public immutable MAX_SUPPLY;
    address payable public immutable FUND_RECIPIENT;

    ////
    // Storage
    ////

    ////
    // Events
    ////

    ////
    // Errors
    ////

    ////
    // Modifiers
    ////

    ////
    // Constructor
    ////

    constructor(uint256 salePrice, uint256 maxSupply, address payable fundRecipient)
        ERC721("NounsTownTicket", "NTT")
        Ownable(msg.sender)
    {
        SALE_PRICE = salePrice;
        MAX_SUPPLY = maxSupply;
        FUND_RECIPIENT = fundRecipient;
    }

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }
}
