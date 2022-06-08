// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface Iauction {

    
    function setEscrowContract(address _escrow) external;
    function createAuction(
        address _tokenContract,
        uint256 _tokenId,
        uint256 _duration,
        uint256 _reservePrice,
        address _sellerFundsRecipient,
        uint256 _startTime
    ) external;

    function setAuctionReservePrice(
        address _tokenContract,
        uint256 _tokenId,
        uint256 _reservePrice
    ) external;

    function cancelAuction(address _tokenContract, uint256 _tokenId) external;

    function createBid(uint256 _tokenId, address bidder) external payable;

    function settleAuction(address _tokenContract, uint256 _tokenId) external;

    function releaseFunds(uint _tokenId) external;

    function getHighestBid(uint _tokenId) external view returns(uint);

    function getHighestBidder(uint _tokenId) external view returns(address);
}
