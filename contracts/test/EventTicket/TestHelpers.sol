// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {EventTicket} from "../../src/EventTicket.sol";

abstract contract TestHelpers is Test {
    EventTicket public ticket;

    // Addresses
    address constant DEPLOYER = address(1);
    address constant REDEEMER = address(2);
    address constant USER_A = address(3);
    address constant USER_B = address(4);
    address payable constant FUND_RECIPIENT = payable(address(5));
    uint96 constant ROYALTY_BIPS = 1000; // 10%

    uint256 constant INITIAL_DEAL_AMOUNT = 10000 ether;

    uint256 constant SALE_PRICE = 0.1 ether;
    uint256 constant MAX_PER_WALLET = 2;

    string NAME = "TestTicket";
    string SYMBOL = "TST";
    string UNREDEEMED_TOKEN_URI = "UNREDEEMED";
    string REDEEMED_TOKEN_URI = "REDEEMED";

    // Expected events
    event MaxSupplySet(uint256 maxSupply);
    event IsSaleActiveSet(bool isSaleActive);
    event RedeemerSet(address redeemer);
    event TokenRedeemed(uint256 tokenId, address owner);

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    // Expected errors
    error SaleNotActive();
    error SoldOut();
    error AlreadyMintedMaxPerWallet();
    error IncorrectValueSent(uint256 expected, uint256 received);
    error FailedToSendEtherToFundRecipient();
    error InvalidRedeemer();
    error AlreadyRedeemed();
    error MaxSupplyTooLow(uint256 currentSupply, uint256 attemptedMaxSupply);
    error CannotTransferRedeemedToken();
    error TokenNotFound(uint256 tokenId);

    ////
    // Setup Helpers
    ////

    function _basicSetup() internal {
        _setupDeal();

        // Deploy swapper
        vm.startPrank(DEPLOYER);

        ticket = new EventTicket({
            name: NAME,
            symbol: SYMBOL,
            _unredeemedTokenUri: UNREDEEMED_TOKEN_URI,
            _redeemedTokenUri: REDEEMED_TOKEN_URI,
            maxPerWallet: MAX_PER_WALLET,
            salePrice: SALE_PRICE,
            fundRecipient: FUND_RECIPIENT,
            royaltyBips: ROYALTY_BIPS
        });

        vm.stopPrank();
    }

    function _setupDeal() internal {
        // Give users ETH
        deal(DEPLOYER, INITIAL_DEAL_AMOUNT);
        deal(USER_A, INITIAL_DEAL_AMOUNT);
        deal(USER_B, INITIAL_DEAL_AMOUNT);
    }

    function _forceTransferTicket(address to, uint256 tokenId) internal {
        address owner = ticket.ownerOf(tokenId);

        vm.prank(owner);
        ticket.transferFrom(owner, to, tokenId);
    }

    ////
    // Event Helpers
    ////

    function _expectEventMaxSupplySet(uint256 newMaxSupply) internal {
        vm.expectEmit(true, true, true, true);
        emit MaxSupplySet(newMaxSupply);
    }

    function _expectEventIsSaleActiveSet(bool active) internal {
        vm.expectEmit(true, true, true, true);
        emit IsSaleActiveSet(active);
    }

    function _expectEventRedeemerSet(address redeemer) internal {
        vm.expectEmit(true, true, true, true);
        emit RedeemerSet(redeemer);
    }

    function _expectEventTokenRedeemed(uint256 tokenId, address owner) internal {
        vm.expectEmit(true, true, true, true);
        emit TokenRedeemed(tokenId, owner);
    }

    function _expectEventTransfer(address from, address to, uint256 tokenId) internal {
        vm.expectEmit(true, true, true, true);
        emit Transfer(from, to, tokenId);
    }

    ////
    // Error Helpers
    ////

    function _expectRevertSaleNotActive() internal {
        vm.expectRevert(abi.encodeWithSelector(SaleNotActive.selector));
    }

    function _expectRevertSoldOut() internal {
        vm.expectRevert(abi.encodeWithSelector(SoldOut.selector));
    }

    function _expectRevertAlreadyMintedMaxPerWallet() internal {
        vm.expectRevert(abi.encodeWithSelector(AlreadyMintedMaxPerWallet.selector));
    }

    function _expectRevertIncorrectValueSent(uint256 expected, uint256 received) internal {
        vm.expectRevert(abi.encodeWithSelector(IncorrectValueSent.selector, expected, received));
    }

    function _expectRevertFailedToSendEtherToFundRecipient() internal {
        vm.expectRevert(abi.encodeWithSelector(FailedToSendEtherToFundRecipient.selector));
    }

    function _expectRevertInvalidRedeemer() internal {
        vm.expectRevert(abi.encodeWithSelector(InvalidRedeemer.selector));
    }

    function _expectRevertAlreadyRedeemed() internal {
        vm.expectRevert(abi.encodeWithSelector(AlreadyRedeemed.selector));
    }

    function _expectRevertMaxSupplyTooLow(uint256 currentSupply, uint256 attemptedMaxSupply) internal {
        vm.expectRevert(abi.encodeWithSelector(MaxSupplyTooLow.selector, currentSupply, attemptedMaxSupply));
    }

    function _expectRevertCannotTransferRedeemedToken() internal {
        vm.expectRevert(abi.encodeWithSelector(CannotTransferRedeemedToken.selector));
    }

    function _expectRevertTokenNotFound(uint256 tokenId) internal {
        vm.expectRevert(abi.encodeWithSelector(TokenNotFound.selector, tokenId));
    }
}
