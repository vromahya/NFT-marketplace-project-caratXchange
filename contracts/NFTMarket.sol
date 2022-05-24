// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarket is ReentrancyGuard, ERC721URIStorage {
    address payable marketplaceOwner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => MarketItem) private tokenToMarketItem;

    struct MarketItem {
        uint256 price;
        bool sold;
        bool onLiveAuction;
        bool onDirectSale;
    }

    uint256 constant MIN_BID_INCREMENT_PERCENTAGE = 10;

    mapping(uint256 => Auction) public auctionForNFT;

    struct Auction {
        address payable seller;
        address payable sellerAddress;
        uint96 price;
        uint96 highestBid;
        address payable highestBidder;
        uint48 duration;
        uint256 startTime;
        uint256 firstBidTime;
    }

    event AuctionCreated(uint256 indexed tokenId, Auction auction, MarketItem);
    event DirectSaleCreated(uint256 indexed tokenId, uint256 price, MarketItem);
    event AuctionCancelled(
        uint256 indexed tokenId,
        Auction auction,
        MarketItem
    );
    event AuctionBid(uint256 indexed tokenId, Auction auction, MarketItem);
    event AuctionEnded(uint256 indexed tokenId, Auction auction, MarketItem);
    event DirectSaleDone(uint256 indexed tokenId, uint256 price, MarketItem);

    // emit event to get tokenId?

    /*

functions and constructor 
*/

    constructor() ERC721("JewelVerse Tokens", "JWT") {
        marketplaceOwner = payable(msg.sender);
    }

    function mintToken(string memory _tokenURI) public returns (uint256) {
        require(msg.sender == marketplaceOwner, "ONLY_OWNER_CAN_BID");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId); // emits transfer event
        _setTokenURI(newTokenId, _tokenURI);
        return (newTokenId);
    }

    //create market item and auction

    function createAuction(
        uint256 _tokenId,
        uint96 _price,
        uint48 _duration
    ) public nonReentrant {
        address tokenOwner = ownerOf(_tokenId);

        require(
            msg.sender == tokenOwner ||
                isApprovedForAll(tokenOwner, msg.sender),
            "ONLY_TOKEN_OWNER_OR_OPERATOR"
        );
        require(
            !tokenToMarketItem[_tokenId].onDirectSale,
            "ALREADY_ON_DIRECT_SALE"
        );
        /*
        Updating details of the auction in the mapping
        */

        auctionForNFT[_tokenId].price = _price;
        auctionForNFT[_tokenId].duration = _duration;
        auctionForNFT[_tokenId].seller = payable(tokenOwner);
        auctionForNFT[_tokenId].sellerAddress = payable(tokenOwner);
        auctionForNFT[_tokenId].startTime = uint256(block.timestamp);
        /*
        Updating details of the market item in the mapping
        */
        tokenToMarketItem[_tokenId].onLiveAuction = true;
        tokenToMarketItem[_tokenId].sold = false;
        tokenToMarketItem[_tokenId].onDirectSale = false;

        emit AuctionCreated(
            _tokenId,
            auctionForNFT[_tokenId],
            tokenToMarketItem[_tokenId]
        );
    }

    function cancelAuction(uint256 _tokenId) external nonReentrant {
        // Get the auction for the specified token
        Auction memory auction = auctionForNFT[_tokenId];

        // Ensure the auction has not started
        require(auction.firstBidTime == 0, "AUCTION_STARTED");

        // Ensure the caller is the seller or a new owner
        require(
            msg.sender == auction.seller || msg.sender == ownerOf(_tokenId),
            "ONLY_SELLER_OR_TOKEN_OWNER"
        );

        emit AuctionCancelled(_tokenId, auction, tokenToMarketItem[_tokenId]);

        // Remove the auction from storage
        delete auctionForNFT[_tokenId];
        delete tokenToMarketItem[_tokenId];
    }

    function placeBid(uint256 _tokenId) public payable nonReentrant {
        Auction storage auction = auctionForNFT[_tokenId];
        address seller = auction.seller;

        require(seller != address(0), "AUCTION_DOES_NOT_EXIST");
        require(msg.sender != seller, "SELLER_CANNOT_BID");
        require(block.timestamp >= auction.startTime);

        uint256 firstBidTime = auction.firstBidTime;
        uint256 duration = auction.duration;

        if (firstBidTime == 0) {
            // Ensure the bid meets the reserve price
            require(msg.value >= auction.price, "RESERVE_PRICE_NOT_MET");

            // Store the current time as the first bid time
            auction.firstBidTime = uint32(block.timestamp);

            // Mark the bid as the first
        } else {
            require(
                block.timestamp < (firstBidTime + duration),
                "AUCTION_OVER"
            );
            uint256 highestBid = auction.highestBid;
            uint256 minValidBid;
            unchecked {
                minValidBid =
                    highestBid +
                    ((highestBid * MIN_BID_INCREMENT_PERCENTAGE) / 100);
            }

            // Ensure the incoming bid meets the minimum
            require(msg.value >= minValidBid, "MINIMUM_BID_NOT_MET");
            //transfer funds to previous bidder
            payable(auction.highestBidder).transfer(highestBid);
            /*
        This will emit transfer event?  confirm and update the subgraph code?
        answer for 2nd try will be no. will change the subgraph if there is a problem
        */
        }

        auction.highestBid = uint96(msg.value);

        auction.highestBidder = payable(msg.sender);

        emit AuctionBid(_tokenId, auction, tokenToMarketItem[_tokenId]);
    }

    function settleAuction(uint256 _tokenId) public nonReentrant {
        Auction memory auction = auctionForNFT[_tokenId];

        uint256 firstBidTime = auction.firstBidTime;

        address fundsRecipient = auction.sellerAddress;

        // Ensure the auction had started
        require(block.timestamp > auction.startTime, "AUCTION_NOT_STARTED");

        // Ensure the auction has ended
        require(
            block.timestamp >= (firstBidTime + auction.duration),
            "AUCTION_NOT_OVER"
        );
        // transfer auction highest bid to the seller
        payable(fundsRecipient).transfer(auction.highestBid); // check the transfer event

        transferFrom(auction.seller, auction.highestBidder, _tokenId);

        // transfer event emitted

        tokenToMarketItem[_tokenId].sold = true;
        tokenToMarketItem[_tokenId].onLiveAuction = false;
        emit AuctionEnded(_tokenId, auction, tokenToMarketItem[_tokenId]);
    }

    function createDirectSaleItem(uint256 _tokenId, uint256 _price) public {
        require(!tokenToMarketItem[_tokenId].onLiveAuction, "ITEM_IN_AUCTION");

        tokenToMarketItem[_tokenId].price = _price;
        tokenToMarketItem[_tokenId].onDirectSale = true;

        tokenToMarketItem[_tokenId].sold = false;

        emit DirectSaleCreated(_tokenId, _price, tokenToMarketItem[_tokenId]);
    }

    function createDirectSale(uint256 _tokenId) public payable {
        require(
            msg.value == tokenToMarketItem[_tokenId].price,
            "PRICE_NOT_MET"
        );
        address _owner = ownerOf(_tokenId);
        require(msg.sender == _owner);

        transferFrom(_owner, msg.sender, _tokenId); //transfer event emitted

        tokenToMarketItem[_tokenId].sold = true;
        tokenToMarketItem[_tokenId].onDirectSale = false;
        payable(_owner).transfer(msg.value);
        //transfer event emitted
        emit DirectSaleDone(_tokenId, msg.value, tokenToMarketItem[_tokenId]);
    }
}
