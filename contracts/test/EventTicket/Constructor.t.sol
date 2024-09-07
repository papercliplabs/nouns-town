// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {TestHelpers} from "./TestHelpers.sol";

contract ConstructorTest is Test, TestHelpers {
    ////
    // Setup
    ////

    function setUp() public {
        _basicSetup();
    }

    ////
    // Successful Tests
    ////

    function test_config() public view {
        assertEq(ticket.MAX_PER_WALLET(), MAX_PER_WALLET);
        assertEq(ticket.SALE_PRICE(), SALE_PRICE);
        assertEq(ticket.FUND_RECIPIENT(), FUND_RECIPIENT);
        assertEq(ticket.unredeemedTokenUri(), UNREDEEMED_TOKEN_URI);
        assertEq(ticket.redeemedTokenUri(), REDEEMED_TOKEN_URI);
    }

    function test_initialState() public view {
        assertEq(ticket.currentSupply(), 0);
        assertEq(ticket.redeemer(), address(0));
        assertEq(ticket.maxSupply(), 0);
        assertEq(ticket.isSaleActive(), false);
    }
}
