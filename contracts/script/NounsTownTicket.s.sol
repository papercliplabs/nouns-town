// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {NounsTownTicket} from "../src/NounsTownTicket.sol";

contract NounsTownTicketScript is Script {
    NounsTownTicket public ticket;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // ticket = new NounsTownTicket();

        vm.stopBroadcast();
    }
}
