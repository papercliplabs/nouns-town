// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {EventTicketRedeemer} from "../src/EventTicketRedeemer.sol";
import {EventTicket} from "../src/EventTicket.sol";

contract EventTicketRedeemerDeployBase is Script {
    address constant EVENT_TICKET_ADDRESS = address(0x04Db84527ecC5414B7FaDaeBE03fcADD978Ef5dF);

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        EventTicketRedeemer redeemer = new EventTicketRedeemer({eventTicket: EventTicket(EVENT_TICKET_ADDRESS)});

        vm.stopBroadcast();
    }
}

contract EventTicketRedeemerDeployTestnet is Script {
    address constant EVENT_TICKET_ADDRESS = address(0x64c1aF051aDB77C4091C073eFdDc86d140131fde);

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        EventTicketRedeemer redeemer = new EventTicketRedeemer({eventTicket: EventTicket(EVENT_TICKET_ADDRESS)});

        vm.stopBroadcast();
    }
}
