// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {EventTicket} from "../../src/EventTicket.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {TestHelpers} from "./TestHelpers.sol";

contract SettersTest is Test, TestHelpers {
    ////
    // Setup
    ////

    function setUp() public {
        _basicSetup();
    }

    ////
    // Successful Tests
    ////

    function test_setMaxSupply(uint256 newMaxSupply) public {
        vm.prank(DEPLOYER);
        _expectEventMaxSupplySet(newMaxSupply);
        ticket.setMaxSupply(newMaxSupply);
        assertEq(ticket.maxSupply(), newMaxSupply);
    }

    function test_setIsSaleActive() public {
        vm.startPrank(DEPLOYER);

        _expectEventIsSaleActiveSet(true);
        ticket.setIsSaleActive(true);
        assertTrue(ticket.isSaleActive());

        _expectEventIsSaleActiveSet(false);
        ticket.setIsSaleActive(false);
        assertFalse(ticket.isSaleActive());
    }

    function test_setRedeemer(address redeemer) public {
        vm.prank(DEPLOYER);
        _expectEventRedeemerSet(redeemer);
        ticket.setRedeemer(redeemer);
        assertEq(ticket.redeemer(), redeemer);
    }

    function test_renounceOwnershiop() public {
        vm.prank(DEPLOYER);
        ticket.renounceOwnership();
        assertEq(ticket.owner(), address(0));
    }

    ////
    // Reverting Tests
    ////

    function test_setMaxSupply_reverts_whenBelowCurrentSupply() public {
        vm.startPrank(DEPLOYER);
        ticket.setMaxSupply(10);
        ticket.setIsSaleActive(true);
        vm.stopPrank();

        // Mint 2 tickets
        vm.prank(USER_A);
        ticket.mint{value: SALE_PRICE}();

        vm.prank(USER_B);
        ticket.mint{value: SALE_PRICE}();

        vm.startPrank(DEPLOYER);

        // Attempt to set max supply to 0 , expect revert
        _expectRevertMaxSupplyTooLow(2, 0);
        ticket.setMaxSupply(0);

        // Attempt to set max supply to 1 (one below), expect revert
        _expectRevertMaxSupplyTooLow(2, 1);
        ticket.setMaxSupply(1);

        // Attempt to set max supply to 2 (equal), expect success
        ticket.setMaxSupply(2);

        // Set max supply to 2 (one above), expect success
        ticket.setMaxSupply(3);
    }

    function testFail_setMaxSupply_reverts_whenNotOwner(uint256 newMaxSupply) public {
        vm.prank(USER_B);
        ticket.setMaxSupply(newMaxSupply);
    }

    function testFail_setIsSaleActive_reverts_whenNotOwner() public {
        vm.startPrank(USER_B);
        ticket.setIsSaleActive(true);
        assertTrue(ticket.isSaleActive());
    }

    function testFail_setRedeemer_reverts_whenNotOwner(address redeemer) public {
        vm.prank(USER_B);
        ticket.setRedeemer(redeemer);
        assertEq(ticket.redeemer(), redeemer);
    }
}
