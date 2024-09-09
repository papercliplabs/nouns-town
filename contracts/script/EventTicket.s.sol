// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {EventTicket} from "../src/EventTicket.sol";

contract EventTicketDeployBase is Script {
    address payable constant FUND_RECEIPIENT = payable(0x45654B6CcbeE91774f203fF60631E583846021cC); // Bens multisig
    address constant REDEEMER = address(0x1aa7e3Af810c0E93629F50f771548B03B095CFFA); // Dev OS2
    uint96 constant ROYALTY_BIPS = 1000; // 10%

    uint256 constant SALE_PRICE = 0.042 ether;

    string UNCLAIMED_TOKEN_URI = "ipfs://QmY8aMqX2bSw1ykcHE4VeeEEgv538VagbTN2rYqEpt1Eqq";
    string CLAIMED_TOKEN_URI = "ipfs://QmXdBvebmRXcuBZyjrCBPswKFFUDcLnah3t3rduH3dKFVd";

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        EventTicket ticket = new EventTicket({
            name: "Nouns Town Pass 2024",
            symbol: "NTP2024",
            _unredeemedTokenUri: UNCLAIMED_TOKEN_URI,
            _redeemedTokenUri: CLAIMED_TOKEN_URI,
            maxPerWallet: 1,
            salePrice: SALE_PRICE,
            fundRecipient: FUND_RECEIPIENT,
            royaltyBips: ROYALTY_BIPS
        });

        ticket.setRedeemer(REDEEMER);
        ticket.setMaxSupply(50);

        vm.stopBroadcast();
    }
}

contract EventTicketDeployTestnet is Script {
    address payable constant FUND_RECEIPIENT = payable(0x267B3d36f6927928BdeaE220Aa525E21e1ACf0e7); // Dev 1
    address constant REDEEMER = address(0xC1681CDBeA156fEF6152C746E25fC73C1739f933); // Dev 2
    uint96 constant ROYALTY_BIPS = 1000; // 10%

    string UNCLAIMED_TOKEN_URI = "ipfs://QmY8aMqX2bSw1ykcHE4VeeEEgv538VagbTN2rYqEpt1Eqq";
    string CLAIMED_TOKEN_URI = "ipfs://QmXdBvebmRXcuBZyjrCBPswKFFUDcLnah3t3rduH3dKFVd";

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        EventTicket ticket = new EventTicket({
            name: "Nouns Town 2024 Test 2",
            symbol: "NTT2",
            _unredeemedTokenUri: UNCLAIMED_TOKEN_URI,
            _redeemedTokenUri: CLAIMED_TOKEN_URI,
            maxPerWallet: 1,
            salePrice: 0.069 ether,
            fundRecipient: FUND_RECEIPIENT,
            royaltyBips: ROYALTY_BIPS
        });

        ticket.setRedeemer(REDEEMER);
        ticket.setMaxSupply(50);

        vm.stopBroadcast();
    }
}
