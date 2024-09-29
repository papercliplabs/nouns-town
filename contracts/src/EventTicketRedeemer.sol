// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EventTicket} from "./EventTicket.sol";

/// @title EventTicketRedeemer
/// @author Paperclip Labs
/// @notice A contract to help with batching event ticket redemptions
contract EventTicketRedeemer is Ownable {
    ////
    // Constants
    ////

    /// @notice The event ticket contract
    EventTicket public immutable EVENT_TICKET;

    ////
    // Constructor
    ////

    /// @notice EventTicketRedeemer constructor.
    /// @param eventTicket The event ticket contract address.
    constructor(EventTicket eventTicket) Ownable(msg.sender) {
        EVENT_TICKET = eventTicket;
    }

    ////
    // External functions
    ////

    /// @notice Batch redeems all tokenIds
    /// @param tokenIds The token IDs to redeem
    function redeemBatch(uint256[] calldata tokenIds) external onlyOwner {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            EVENT_TICKET.redeem(tokenIds[i]);
        }
    }
}
