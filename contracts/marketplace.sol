// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {Iauction} from "./Iauction.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MarketPlace is ReentrancyGuard {
    address auctionContract;

    address tokenContract;

    address admin;

    uint256 listingFee = 1 ether;

    event DirectSaleCreated(uint256 indexed tokenId, uint256 indexed price);
    event DirectSaleDone(uint256 indexed tokenId, uint256 indexed price);
    event OrderInTransit(uint256 indexed tokenId);
    event OrderCompleted(uint256 indexed tokenId);

    constructor(address _auctionContract) {
        auctionContract = _auctionContract;
        admin = msg.sender;
    }

    struct MarketItemMetadata {
        address seller;
        uint256 reservePrice;
        bool onAuction;
        bool onDirectSale;
        OrderState orderState;
    }

    struct OrderState {
        bool started;
        bool inTransit;
        bool completed;
    }
    mapping(uint256 => MarketItemMetadata) tokenIdToMarketItemMeta;

    function setTokenContract(address _tokenContract) external {
        tokenContract = _tokenContract;
    }

    function updateListingFee(uint256 _listingFee) public {
        require(msg.sender == admin, "ONLY_OWNER_CAN_CHANGE_LISTING_FEE");
        listingFee = _listingFee;
    }

    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    function createAuction(
        address _tokenContract,
        uint256 _tokenId,
        uint256 _duration,
        uint256 _reservePrice,
        address _sellerFundsRecipient,
        uint256 _startTime
    ) external payable nonReentrant {
        require(
            tokenIdToMarketItemMeta[_tokenId].onDirectSale == false,
            "ITEM_ALREADY_ON_DIRECT_SALE"
        );
        require(
            tokenIdToMarketItemMeta[_tokenId].onAuction != true,
            "AUCTION_ALREADY_EXISTS"
        );

        require(msg.value == listingFee, "PROVIDE_LISTING_FEE");

        payable(admin).transfer(msg.value);

        Iauction(auctionContract).createAuction(
            _tokenContract,
            _tokenId,
            _duration,
            _reservePrice,
            _sellerFundsRecipient,
            _startTime
        );

        tokenIdToMarketItemMeta[_tokenId].seller = IERC721(tokenContract)
            .ownerOf(_tokenId);
        tokenIdToMarketItemMeta[_tokenId].reservePrice = _reservePrice;
        tokenIdToMarketItemMeta[_tokenId].onAuction = true;
        tokenIdToMarketItemMeta[_tokenId].onDirectSale = false;
    }

    function createDirectSaleItem(uint256 _tokenId, uint256 _reservePrice)
        external
        payable
        nonReentrant
    {
        require(
            tokenIdToMarketItemMeta[_tokenId].onAuction == false,
            "ITEM_ALREADY_ON_AUCTION"
        );

        require(
            IERC721(tokenContract).ownerOf(_tokenId) == msg.sender,
            "ONLY_OWNER_CAN_PUT_ITEMS_ON_SALE"
        );

        require(msg.value == listingFee);

        payable(admin).transfer(msg.value);

        tokenIdToMarketItemMeta[_tokenId].seller = IERC721(tokenContract)
            .ownerOf(_tokenId);
        tokenIdToMarketItemMeta[_tokenId].reservePrice = _reservePrice;
        tokenIdToMarketItemMeta[_tokenId].onAuction = false;
        tokenIdToMarketItemMeta[_tokenId].onDirectSale = true;

        emit DirectSaleCreated(_tokenId, _reservePrice);
    }

    function cancelAuction(uint256 _tokenId) external nonReentrant {
        Iauction(auctionContract).cancelAuction(tokenContract, _tokenId);
        tokenIdToMarketItemMeta[_tokenId].onAuction = false;
        tokenIdToMarketItemMeta[_tokenId].reservePrice = 0;
    }

    function changeReservePrice(uint256 _tokenId, uint256 _reservePrice)
        external
        nonReentrant
    {
        Iauction(auctionContract).setAuctionReservePrice(
            tokenContract,
            _tokenId,
            _reservePrice
        );
        tokenIdToMarketItemMeta[_tokenId].reservePrice = _reservePrice;
    }

    function placeBid(uint256 _tokenId) external payable nonReentrant {
        Iauction(auctionContract).createBid{value: msg.value}(
            _tokenId,
            msg.sender
        );
    }

    function settleAuction(uint256 _tokenId) external payable nonReentrant {
        Iauction(auctionContract).settleAuction(tokenContract, _tokenId);
        tokenIdToMarketItemMeta[_tokenId].reservePrice = Iauction(
            auctionContract
        ).getHighestBid(_tokenId);
        tokenIdToMarketItemMeta[_tokenId].onAuction = false;
        tokenIdToMarketItemMeta[_tokenId].onDirectSale = false;
        tokenIdToMarketItemMeta[_tokenId].orderState.started = true;
    }

    function settleDirectSale(uint256 _tokenId) external payable nonReentrant {
        uint256 price = tokenIdToMarketItemMeta[_tokenId].reservePrice;

        address seller = tokenIdToMarketItemMeta[_tokenId].seller;

        require(msg.sender != seller, "SELLER_CANNOT_BUY");

        require(msg.value >= price, "INSUFFICIENT_ETHER_SENT");

        tokenIdToMarketItemMeta[_tokenId].onAuction = false;
        tokenIdToMarketItemMeta[_tokenId].onDirectSale = false;
        tokenIdToMarketItemMeta[_tokenId].orderState.started = true;

        payable(seller).transfer(msg.value);

        IERC721(tokenContract).safeTransferFrom(seller, msg.sender, _tokenId);

        emit DirectSaleDone(_tokenId, msg.value);
    }

    function setOrderInTransit(uint256 _tokenId) external nonReentrant {
        require(
            msg.sender == tokenIdToMarketItemMeta[_tokenId].seller,
            "only seller initiate order in transit"
        );
        tokenIdToMarketItemMeta[_tokenId].orderState.started = false;
        tokenIdToMarketItemMeta[_tokenId].orderState.inTransit = true;
        emit OrderInTransit(_tokenId);
    }

    function orderCompleted(uint256 _tokenId) external nonReentrant {
        require(msg.sender == admin, "Order complted requires admins approval");

        tokenIdToMarketItemMeta[_tokenId].orderState.started = false;
        tokenIdToMarketItemMeta[_tokenId].orderState.inTransit = false;
        tokenIdToMarketItemMeta[_tokenId].orderState.completed = true;
        Iauction(auctionContract).releaseFunds(_tokenId);
        emit OrderCompleted(_tokenId);
    }

    function updateAdmin(address _admin) external nonReentrant {
        require(msg.sender == admin);
        admin = _admin;
    }
}
