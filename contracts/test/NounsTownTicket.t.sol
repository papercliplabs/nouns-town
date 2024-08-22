// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {NounsTownTicket} from "../src/NounsTownTicket.sol";

contract NounsTownTicketTest is Test {
    NounsTownTicket public ticket;

    function setUp() public {
        ticket = new NounsTownTicket(0.1 ether, 200, payable(address(this)));
    }
}
