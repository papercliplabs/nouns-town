// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Royalty} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title EventTicket
/// @author Paperclip Labs
/// @notice A contract to enable NFT event ticketing.
///         Each ticket mint costs SALE_PRICE ETH, which is sent to the FUND_RECIPIENT.
///         Secondary sale royalties (royaltyBips) are sent to the FUND_RECIPIENT.
///         Each wallet is only allowed to mint MAX_PER_WALLET tickets.
/// @dev The owner can call setMaxSupply to roll out ticket sales in phases.
///      The owner can call setIsSaleActive to pause/resume ticket sales.
///      The redeemer can call redeem to mark tickets as redeemed, which changes the tokenUri and prevents transfers (off chain redemption).
contract EventTicket is ERC721, ERC721Royalty, Ownable, ReentrancyGuard {
    ////
    // Constants
    ////

    /// @notice The maximum number of tickets that can be minted per wallet.
    uint256 public immutable MAX_PER_WALLET;

    /// @notice Sale price per ticket in wei.
    uint256 public immutable SALE_PRICE;

    /// @notice The address that will receive the funds from ticket sales.
    address payable public immutable FUND_RECIPIENT;

    ////
    // Storage
    ////

    /// @notice The URI for unredeemed tickets, this is the default URI.
    string public unredeemedTokenUri;

    /// @notice The URI for redeemed tickets.
    string public redeemedTokenUri;

    /// @notice The current supply of tickets.
    uint256 public currentSupply = 0;

    /// @notice The address of the redeemer, who can call redeem to mark tickets as redeemed.
    address public redeemer = address(0);

    /// @notice The maximum number of tickets that can be minted.
    uint256 public maxSupply = 0;

    /// @notice Whether ticket sales are active.
    bool public isSaleActive = false;

    /// @notice A mapping of tokenIds to whether they have been redeemed.
    mapping(uint256 tokenId => bool redeemed) public redeemedTokens;

    ////
    // Events
    ////

    /// @notice Emitted when the max supply is set.
    /// @param maxSupply The new max supply.
    event MaxSupplySet(uint256 maxSupply);

    /// @notice Emitted when the sale status is set.
    /// @param isSaleActive The new sale status.
    event IsSaleActiveSet(bool isSaleActive);

    /// @notice Emitted when the redeemer is set.
    /// @param redeemer The new redeemer.
    event RedeemerSet(address redeemer);

    /// @notice Emitted when a token is redeemed.
    /// @param tokenId The token that was redeemed.
    /// @param owner The owner of the token.
    event TokenRedeemed(uint256 tokenId, address owner);

    ////
    // Errors
    ////

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
    // Modifiers
    ////

    /// @notice Ensure that ticket sales are active.
    modifier saleActive() {
        if (!isSaleActive) revert SaleNotActive();
        _;
    }

    /// @notice Ensure that the max supply has not been reached.
    modifier notSoldOut() {
        if (currentSupply >= maxSupply) revert SoldOut();
        _;
    }

    /// @notice Ensure that the sender has not minted the max per wallet.
    modifier belowMaxPerWallet() {
        if (balanceOf(msg.sender) >= MAX_PER_WALLET) revert AlreadyMintedMaxPerWallet();
        _;
    }

    /// @notice Ensure that the sender is the redeemer.
    modifier onlyRedeemer() {
        if (msg.sender != redeemer) revert InvalidRedeemer();
        _;
    }

    ////
    // Constructor
    ////

    /// @notice EventTicket constructor.
    /// @param name The name of the NFT collection.
    /// @param symbol The symbol of the NFT collection.
    /// @param _unredeemedTokenUri The URI for all unredeemed tickets.
    /// @param _redeemedTokenUri The URI for all redeemed tickets.
    /// @param maxPerWallet The maximum number of tickets that can be minted per wallet.
    /// @param salePrice The sale price per ticket in wei.
    /// @param fundRecipient The address that will receive the funds from ticket sales.
    /// @param royaltyBips The royalty on secondary sales in bips.
    constructor(
        string memory name,
        string memory symbol,
        string memory _unredeemedTokenUri,
        string memory _redeemedTokenUri,
        uint256 maxPerWallet,
        uint256 salePrice,
        address payable fundRecipient,
        uint96 royaltyBips
    ) ERC721(name, symbol) Ownable(msg.sender) {
        unredeemedTokenUri = _unredeemedTokenUri;
        redeemedTokenUri = _redeemedTokenUri;

        MAX_PER_WALLET = maxPerWallet;
        SALE_PRICE = salePrice;
        FUND_RECIPIENT = fundRecipient;

        _setDefaultRoyalty(FUND_RECIPIENT, royaltyBips);
    }

    ////
    // Mint functions
    ////

    /// @notice Mints a ticket to the sender.
    /// @dev emits a Transfer event from the zero address to the sender.
    /// @return The tokenId of the minted ticket.
    function mint() external payable nonReentrant saleActive notSoldOut belowMaxPerWallet returns (uint256) {
        if (msg.value != SALE_PRICE) revert IncorrectValueSent(SALE_PRICE, msg.value);

        uint256 tokenId = currentSupply;
        _safeMint(msg.sender, tokenId);

        ++currentSupply;

        (bool sent,) = FUND_RECIPIENT.call{value: msg.value}("");
        if (!sent) revert FailedToSendEtherToFundRecipient();

        return tokenId;
    }

    ////
    // Redeemer functions
    ////

    /// @notice Redeems a ticket, marking it as redeemed.
    /// @dev emits a TokenRedeemed event.
    /// @param tokenId The token to redeem.
    function redeem(uint256 tokenId) external onlyRedeemer {
        address owner = _ownerOf(tokenId);
        if (owner == address(0)) revert TokenNotFound(tokenId);
        if (redeemedTokens[tokenId]) revert AlreadyRedeemed();

        redeemedTokens[tokenId] = true;
        emit TokenRedeemed(tokenId, owner);
    }

    ////
    // Owner functions
    ////

    /// @notice Sets the max supply of tickets.
    /// @dev The max supply must be greater than the current supply.
    /// @dev Emits a MaxSupplySet event.
    /// @param _maxSupply The new max supply.
    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        if (_maxSupply < currentSupply) revert MaxSupplyTooLow(currentSupply, _maxSupply);
        maxSupply = _maxSupply;
        emit MaxSupplySet(_maxSupply);
    }

    /// @notice Sets whether ticket sales are active.
    /// @dev Emits an IsSaleActiveSet event.
    /// @param active The new sale status.
    function setIsSaleActive(bool active) external onlyOwner {
        isSaleActive = active;
        emit IsSaleActiveSet(active);
    }

    /// @notice Sets the redeemer.
    /// @dev Emits a RedeemerSet event.
    /// @param _redeemer The new redeemer.
    function setRedeemer(address _redeemer) external onlyOwner {
        redeemer = _redeemer;
        emit RedeemerSet(_redeemer);
    }

    ////
    // Overrides
    ////

    /// @inheritdoc ERC721
    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        if (redeemedTokens[tokenId]) {
            return redeemedTokenUri;
        } else {
            return unredeemedTokenUri;
        }
    }

    /// @inheritdoc ERC721
    /// @dev Transfers are prevented if the tokenId is redeemed.
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        // Prevent transfers if the tokenId is redeemed
        if (redeemedTokens[tokenId]) revert CannotTransferRedeemedToken();

        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
