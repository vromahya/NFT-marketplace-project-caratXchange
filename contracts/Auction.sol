// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ReserveAuction {
    uint8 constant MIN_BID_INCREMENT_PERCENTAGE = 10;

    address escrow;

    mapping(uint256 => Auction) public auctionForNFT;

    struct Auction {
        address seller;
        uint96 reservePrice;
        address sellerFundsRecipient;
        uint96 highestBid;
        address highestBidder;
        uint32 duration;
        uint32 startTime;
        uint32 firstBidTime;
    }
    /// @notice Emitted when an auction is created
    /// @param tokenId The ERC-721 token id of the created auction
    /// @param auction The metadata of the created auction
    event AuctionCreated(uint256 indexed tokenId, Auction auction);

    /// @notice Emitted when a reserve price is updated
    /// @param tokenId The ERC-721 token id of the updated auction
    /// @param auction The metadata of the updated auction
    event AuctionReservePriceUpdated(uint256 indexed tokenId, Auction auction);

    /// @notice Emitted when an auction is canceled
    /// @param tokenId The ERC-721 token id of the canceled auction
    /// @param auction The metadata of the canceled auction
    event AuctionCanceled(uint256 indexed tokenId, Auction auction);

    /// @notice Emitted when a bid is placed
    /// @param tokenId The ERC-721 token id of the auction
    /// @param auction The metadata of the auction
    event AuctionBid(uint256 indexed tokenId, Auction auction);

    /// @notice Emitted when an auction has ended
    /// @param tokenId The ERC-721 token id of the auction
    /// @param auction The metadata of the settled auction
    event AuctionEnded(uint256 indexed tokenId, Auction auction);

    function setEscrowContract(address _escrow) external {
        escrow = _escrow;
    }

    function createAuction(
        address _tokenContract,
        uint256 _tokenId,
        uint256 _duration,
        uint256 _reservePrice,
        address _sellerFundsRecipient,
        uint256 _startTime
    ) external {
        // Get the owner of the specified token
        address tokenOwner = IERC721(_tokenContract).ownerOf(_tokenId);

        // Ensure the caller is the owner or an approved operator
        require(
            msg.sender == tokenOwner ||
                IERC721(_tokenContract).isApprovedForAll(
                    tokenOwner,
                    msg.sender
                ),
            "ONLY_TOKEN_OWNER_OR_OPERATOR"
        );

        // Ensure the funds recipient is specified
        require(_sellerFundsRecipient != address(0), "INVALID_FUNDS_RECIPIENT");

        // Store the auction metadata
        auctionForNFT[_tokenId].seller = tokenOwner;
        auctionForNFT[_tokenId].reservePrice = uint96(_reservePrice);
        auctionForNFT[_tokenId].sellerFundsRecipient = _sellerFundsRecipient;
        auctionForNFT[_tokenId].duration = uint32(_duration);
        auctionForNFT[_tokenId].startTime = uint32(_startTime);

        emit AuctionCreated(_tokenId, auctionForNFT[_tokenId]);
    }

    function setAuctionReservePrice(
        address _tokenContract,
        uint256 _tokenId,
        uint256 _reservePrice
    ) external {
        address tokenOwner = IERC721(_tokenContract).ownerOf(_tokenId);
        // Get the auction for the specified token
        Auction storage auction = auctionForNFT[_tokenId];
        require(
            tokenOwner == auction.seller ||
                IERC721(_tokenContract).isApprovedForAll(
                    tokenOwner,
                    msg.sender
                ),
            "ONLY_OWNER_CAN_INCREASE_RESERVED_PRICE"
        );
        // Ensure the auction has not started
        require(auction.startTime < block.timestamp, "AUCTION_STARTED");

        // Ensure the caller is the seller
        require(msg.sender == auction.seller, "ONLY_SELLER");

        // Update the reserve price
        auction.reservePrice = uint96(_reservePrice);

        emit AuctionReservePriceUpdated(_tokenId, auction);
    }

    function cancelAuction(address _tokenContract, uint256 _tokenId) external {
        // Get the auction for the specified token
        Auction memory auction = auctionForNFT[_tokenId];

        // Ensure the auction has not started
        require(auction.startTime <= block.timestamp, "AUCTION_STARTED");

        address tokenOwner = IERC721(_tokenContract).ownerOf(_tokenId);
        // Ensure the caller is the seller or a new owner
        require(
            msg.sender == auction.seller ||
                msg.sender == tokenOwner ||
                IERC721(_tokenContract).isApprovedForAll(
                    tokenOwner,
                    msg.sender
                ),
            "ONLY_SELLER_OR_TOKEN_OWNER"
        );

        emit AuctionCanceled(_tokenId, auction);

        // Remove the auction from storage
        delete auctionForNFT[_tokenId];
    }

    function createBid(uint256 _tokenId, address bidder) external payable {
        // Get the auction for the specified token
        Auction storage auction = auctionForNFT[_tokenId];

        // Cache the seller
        address seller = auction.seller;
        require(bidder != seller);

        // Ensure the auction exists
        require(seller != address(0), "AUCTION_DOES_NOT_EXIST");

        // Ensure the auction has started or is valid to start
        require(block.timestamp >= auction.startTime, "AUCTION_NOT_STARTED");

        // Cache more auction metadata
        uint256 firstBidTime = auction.firstBidTime;
        uint256 duration = auction.duration;
        uint256 startTime = auction.startTime;

        // If this is the first bid, start the auction
        if (firstBidTime == 0) {
            // Ensure the bid meets the reserve price
            require(msg.value >= auction.reservePrice, "RESERVE_PRICE_NOT_MET");

            // Store the current time as the first bid time
            auction.firstBidTime = uint32(block.timestamp);
            // Else this is a subsequent bid, so refund the previous bidder
        } else {
            // Ensure the auction has not ended
            require(block.timestamp < (startTime + duration), "AUCTION_OVER");

            // Cache the highest bid
            uint256 highestBid = auction.highestBid;

            // Used to store the minimum bid required to outbid the highest bidder
            uint256 minValidBid;

            // Calculate the minimum bid required (10% higher than the highest bid)
            // Cannot overflow as the highest bid would have to be magnitudes higher than the total supply of ETH
            unchecked {
                minValidBid =
                    highestBid +
                    ((highestBid * MIN_BID_INCREMENT_PERCENTAGE) / 100);
            }

            // Ensure the incoming bid meets the minimum
            require(msg.value >= minValidBid, "MINIMUM_BID_NOT_MET");

            // Refund the previous bidder
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        // Store the attached ETH as the highest bid
        auction.highestBid = uint96(msg.value);

        // Store the caller as the highest bidder
        auction.highestBidder = bidder;

        emit AuctionBid(_tokenId, auction);
    }

    function settleAuction(address _tokenContract, uint256 _tokenId)
        external
        payable
    {
        // require(escrow!=address(0),"PLEASE_SET_ESCROW_ACCOUNT_FIRST");
        // Get the auction for the specified token
        Auction memory auction = auctionForNFT[_tokenId];

        address seller = auction.seller;
        // Cache the time of the first bid
        uint256 firstBidTime = auction.firstBidTime;

        // Ensure the auction had started
        if (firstBidTime == 0) {
            delete auctionForNFT[_tokenId];
            return;
        }

        // Ensure the auction has ended
        require(
            block.timestamp >= (auction.startTime + auction.duration),
            "AUCTION_NOT_OVER"
        );

        // Payout associated token royalties, if any
        // (uint256 remainingProfit, ) = _handleRoyaltyPayout(_tokenContract, _tokenId, auction.highestBid, address(0), 300000);

        // Payout the module fee, if configured by the owner
        // remainingProfit = _handleProtocolFeePayout(remainingProfit, address(0));

        // Transfer the remaining profit to the funds recipient
        // _handleOutgoingTransfer(auction.sellerFundsRecipient, remainingProfit, address(0), 50000);
        // payable(escrow).transfer(auction.highestBid);
        // Transfer the NFT to the winning bidder
        IERC721(_tokenContract).transferFrom(
            seller,
            auction.highestBidder,
            _tokenId
        );
        
        emit AuctionEnded(_tokenId, auction);

        // Remove the auction from storage
    }

    function releaseFunds(uint256 _tokenId) external {
        Auction memory auction = auctionForNFT[_tokenId];
        payable(auction.sellerFundsRecipient).transfer(auction.highestBid);
        delete auctionForNFT[_tokenId];
    }

    function getHighestBid(uint256 _tokenId) external view returns (uint256) {
        return auctionForNFT[_tokenId].highestBid;
    }

    function getHighestBidder(uint256 _tokenId)
        external
        view
        returns (address)
    {
        return auctionForNFT[_tokenId].highestBidder;
    }
}
