// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {EventTicket} from "../../src/EventTicket.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {TestHelpers} from "./TestHelpers.sol";

contract ScenarioTest is Test, TestHelpers {
    ////
    // Setup
    ////

    function setUp() public {
        _basicSetup();
    }

    ////
    // Helpers
    ////

    function _mint(address minter) private returns (uint256) {
        vm.deal(minter, SALE_PRICE * 2);
        vm.prank(minter);
        return ticket.mint{value: SALE_PRICE}();
    }

    ////
    // Scenarios
    ////

    function test_scenario() public {
        vm.startPrank(DEPLOYER);
        ticket.setMaxSupply(50);
        ticket.setRedeemer(REDEEMER);
        vm.stopPrank();

        // Sale not active
        _expectRevertSaleNotActive();
        _mint(USER_A);

        // Sale active
        vm.prank(DEPLOYER);
        ticket.setIsSaleActive(true);

        for (uint256 i = 0; i < MAX_PER_WALLET; i++) {
            _mint(USER_A);
        }

        // Max supply per wallet reached
        _expectRevertAlreadyMintedMaxPerWallet();
        _mint(USER_A);

        // More mints, up to the max
        for (uint160 i = uint160(10); i < (50 + 10 - MAX_PER_WALLET); i++) {
            _mint(address(i));
        }

        _expectRevertSoldOut();
        _mint(USER_B);

        // User A transfers one ticket to User B
        vm.prank(USER_A);
        ticket.transferFrom(USER_A, USER_B, 0);

        // User B redeems
        vm.prank(REDEEMER);
        ticket.redeem(0);

        // User B can't transfer
        vm.prank(USER_B);
        _expectRevertCannotTransferRedeemedToken();
        ticket.transferFrom(USER_B, address(100000), 0);

        // Open up next mint round
        vm.prank(DEPLOYER);
        ticket.setMaxSupply(100);

        // Mint some more, and redeem them
        for (uint160 i = 0; i < 50; i++) {
            uint256 tokenId = _mint(address(i + 100));

            vm.prank(REDEEMER);
            ticket.redeem(tokenId);
        }

        // sold out again!
        _expectRevertSoldOut();
        _mint(address(123213123));
    }
}
