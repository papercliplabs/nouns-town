// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {EventTicket} from "../../src/EventTicket.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {TestHelpers} from "./TestHelpers.sol";

contract RedeemTest is Test, TestHelpers {
    ////
    // Setup
    ////

    function setUp() public {
        _basicSetup();

        vm.startPrank(DEPLOYER);
        ticket.setMaxSupply(10);
        ticket.setIsSaleActive(true);
        ticket.setRedeemer(REDEEMER);
        vm.stopPrank();
    }

    ////
    // Helpers
    ////

    function _mint(address user) private {
        vm.prank(user);
        ticket.mint{value: SALE_PRICE}();
    }

    function _redeemAndRunChecks(uint256 tokenId, address owner) private {
        // Is owner
        assertEq(ticket.ownerOf(tokenId), owner);

        // Not already redeemed
        assertEq(ticket.redeemedTokens(tokenId), false);
        assertEq(ticket.tokenURI(tokenId), UNREDEEMED_TOKEN_URI);

        // Redeem the ticket
        vm.prank(REDEEMER);
        _expectEventTokenRedeemed(tokenId, owner);
        ticket.redeem(tokenId);

        // Check that the token is now redeemed
        assertEq(ticket.redeemedTokens(tokenId), true);
        assertEq(ticket.tokenURI(tokenId), REDEEMED_TOKEN_URI);

        // Still same owner
        assertEq(ticket.ownerOf(tokenId), owner);
    }

    ////
    // Successful Tests
    ////

    function test_basicRedeem() public {
        _mint(USER_A); // 0
        _mint(USER_B); // 1

        _redeemAndRunChecks(0, USER_A);

        // Redeeming token 0 doesn't effect token 1
        assertFalse(ticket.redeemedTokens(1));

        _redeemAndRunChecks(1, USER_B);
    }

    // TODO: approval and transfer tests

    ////
    // Reverting Tests
    ////

    function test_reverts_when_notRedeemer(address testAddress) public {
        vm.assume(testAddress != REDEEMER);

        _mint(USER_A);

        vm.prank(testAddress);
        _expectRevertInvalidRedeemer();
        ticket.redeem(0);
    }

    function test_reverts_when_tokenNotFound(uint256 tokenId) public {
        vm.prank(REDEEMER);
        _expectRevertTokenNotFound(tokenId);
        ticket.redeem(tokenId);
    }

    function test_reverts_when_alreadyRedeemed() public {
        _mint(USER_A);

        _redeemAndRunChecks(0, USER_A);

        vm.prank(REDEEMER);
        _expectRevertAlreadyRedeemed();
        ticket.redeem(0);
    }

    function test_reverts_when_transferedAfterRedeemed() public {
        _mint(USER_A);

        // Transfers work
        vm.prank(USER_A);
        ticket.transferFrom(USER_A, USER_B, 0);

        // Redeem
        vm.prank(REDEEMER);
        _redeemAndRunChecks(0, USER_B);

        // Try to transfer back, expect revert since now soul bound
        vm.prank(USER_B);
        _expectRevertCannotTransferRedeemedToken();
        ticket.transferFrom(USER_B, USER_A, 0);
    }
}
