// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {EventTicket} from "../../src/EventTicket.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {TestHelpers} from "./TestHelpers.sol";

contract MintTest is Test, TestHelpers {
    ////
    // Setup
    ////

    function setUp() public {
        _basicSetup();

        vm.startPrank(DEPLOYER);
        ticket.setMaxSupply(10);
        ticket.setIsSaleActive(true);
        vm.stopPrank();
    }

    ////
    // Helpers
    ////

    function _mintAndRunChecks(address minter) private {
        uint256 fundRecipientBalanceBefore = FUND_RECIPIENT.balance;
        uint256 userBalanceBefore = minter.balance;
        uint256 userTicketBalanceBefore = ticket.balanceOf(minter);
        uint256 expectedTokenId = ticket.currentSupply();

        vm.prank(minter);
        _expectEventTransfer(address(0), minter, expectedTokenId);
        uint256 tokenId = ticket.mint{value: SALE_PRICE}();

        assertEq(tokenId, expectedTokenId);

        // Minters balance should increase by 1
        assertEq(ticket.balanceOf(minter), userTicketBalanceBefore + 1);

        // Ticket should be owned by minter
        assertEq(ticket.ownerOf(expectedTokenId), minter);

        // Minter should have paid the sale price
        assertEq(minter.balance, userBalanceBefore - SALE_PRICE);

        // Fund recipient should have received the sale price
        assertEq(FUND_RECIPIENT.balance, fundRecipientBalanceBefore + SALE_PRICE);

        assertEq(ticket.tokenURI(expectedTokenId), UNREDEEMED_TOKEN_URI);
    }

    ////
    // Successful Tests
    ////

    function test_basicMint() public {
        _mintAndRunChecks(USER_A);
    }

    ////
    // Reverting Tests
    ////

    function test_reverts_whenSaleNotActive() public {
        vm.prank(DEPLOYER);
        ticket.setIsSaleActive(false);

        vm.prank(USER_A);
        _expectRevertSaleNotActive();
        ticket.mint{value: SALE_PRICE}();
    }

    function test_reverts_whenAboveMaxPerWallet() public {
        address user = USER_A;

        for (uint256 i = 0; i < MAX_PER_WALLET; i++) {
            _mintAndRunChecks(user);
        }

        vm.prank(user);
        _expectRevertAlreadyMintedMaxPerWallet();
        ticket.mint{value: SALE_PRICE}();
    }

    function test_reverts_whenWrongSalePrice(uint256 value) public {
        vm.assume(value != SALE_PRICE);
        vm.assume(value <= INITIAL_DEAL_AMOUNT);

        vm.prank(USER_A);
        _expectRevertIncorrectValueSent(SALE_PRICE, value);
        ticket.mint{value: value}();
    }

    function test_reverts_whenSoldOut() public {
        vm.prank(DEPLOYER);
        ticket.setMaxSupply(1);

        _mintAndRunChecks(USER_A);

        vm.prank(USER_B);
        _expectRevertSoldOut();
        ticket.mint{value: SALE_PRICE}();
    }

    function test_reverts_whenInvalidFundRecipient() public {
        vm.startPrank(DEPLOYER);
        EventTicket otherTicket = new EventTicket({
            name: NAME,
            symbol: SYMBOL,
            _unredeemedTokenUri: UNREDEEMED_TOKEN_URI,
            _redeemedTokenUri: REDEEMED_TOKEN_URI,
            maxPerWallet: MAX_PER_WALLET,
            salePrice: SALE_PRICE,
            fundRecipient: payable(address(ticket)), // Contract without payable fallback
            royaltyBips: ROYALTY_BIPS
        });

        otherTicket.setMaxSupply(10);
        otherTicket.setIsSaleActive(true);

        vm.stopPrank();

        vm.prank(USER_A);
        _expectRevertFailedToSendEtherToFundRecipient();
        otherTicket.mint{value: SALE_PRICE}();
    }
}
