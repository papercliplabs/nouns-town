// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {TestHelpers} from "./TestHelpers.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";
import {IERC721} from "@openzeppelin/contracts/interfaces/IERC721.sol";

contract InterfaceSupportTest is Test, TestHelpers {
    ////
    // Setup
    ////

    function setUp() public {
        _basicSetup();
    }

    ////
    // Successful Tests
    ////

    function test_supportsErc721Interface() public view {
        assertTrue(ticket.supportsInterface(type(IERC721).interfaceId));
    }

    function test_supportsErc2981Interface() public view {
        assertTrue(ticket.supportsInterface(type(IERC2981).interfaceId));
    }

    function test_doesNotSupportRandomInterface() public view {
        assertFalse(ticket.supportsInterface(0xf0ffffff));
    }
}
