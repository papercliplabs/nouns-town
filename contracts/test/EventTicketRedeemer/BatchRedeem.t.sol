// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {EventTicket} from "../../src/EventTicket.sol";
import {EventTicketRedeemer} from "../../src/EventTicketRedeemer.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {TestHelpers} from "../EventTicket/TestHelpers.sol";

contract BatchRedeemTest is Test, TestHelpers {
    EventTicketRedeemer public redeemer;

    ////
    // Setup
    ////

    function setUp() public {
        // Setup the event ticket
        _basicSetup();

        vm.startPrank(DEPLOYER);
        ticket.setMaxSupply(10);
        ticket.setIsSaleActive(true);

        // Deploy the batch redeemer
        redeemer = new EventTicketRedeemer(ticket);

        ticket.setRedeemer(address(redeemer));
        vm.stopPrank();
    }

    ////
    // Helpers
    ////

    function _mint(address user) private returns (uint256) {
        vm.prank(user);
        return ticket.mint{value: SALE_PRICE}();
    }

    function _redeemBatchAndRunChecks(uint256[] memory tokenIds) private {
        // None already redeemed
        for (uint256 i = 0; i < tokenIds.length; i++) {
            assertEq(ticket.redeemedTokens(tokenIds[i]), false);
        }

        // Redeem
        vm.prank(DEPLOYER);
        redeemer.redeemBatch(tokenIds);

        // Check now redeemed
        for (uint256 i = 0; i < tokenIds.length; i++) {
            assertEq(ticket.redeemedTokens(tokenIds[i]), true);
        }
    }

    ////
    // Successful Tests
    ////

    function test_basicBatchRedeem() public {
        uint256 idA = _mint(USER_A); // 0
        uint256 idB = _mint(USER_B); // 1

        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = idA;
        tokenIds[1] = idB;

        _redeemBatchAndRunChecks(tokenIds);
    }

    ////
    // Reverting Tests
    ////

    function testFail_reverts_when_duplicateRedeem() public {
        uint256 idA = _mint(USER_A); // 0
        uint256 idB = _mint(USER_B); // 1

        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = idA;
        tokenIds[1] = idB;
        tokenIds[2] = idB;

        _redeemBatchAndRunChecks(tokenIds);
    }

    function testFail_reverts_when_notOwner() public {
        uint256 idA = _mint(USER_A); // 0
        uint256 idB = _mint(USER_B); // 1

        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = idA;
        tokenIds[1] = idB;

        vm.prank(USER_A);
        redeemer.redeemBatch(tokenIds);
    }
}
