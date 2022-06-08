//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NFTMint is ERC721URIStorage, ReentrancyGuard , AccessControl {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenId;

    address marketplace;
    address auctionContract;
    
    address private admin;
    bytes32 public constant SELLER = keccak256("seller");
    bytes32 public constant ADMIN = keccak256("admin"); 
    

    constructor(address _marketplace, address _auctionContract) ERC721("Forever Carat", "FCT"){
        admin = _msgSender();
        
        marketplace = _marketplace;
        auctionContract = _auctionContract;          

        _grantRole(ADMIN, admin);

        _setRoleAdmin(SELLER, ADMIN);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mint(string memory tokenURI) public nonReentrant  {
        require(hasRole(SELLER, msg.sender)|| msg.sender==admin, "ER_CODE_1");
        _tokenId.increment();
        
        uint256 newTokenId = _tokenId.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        setApprovalForAll(marketplace,true);

        setApprovalForAll(auctionContract,true);

    } //emits transfer event
    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId)==msg.sender, "ERR_CODE_2");
        _burn(tokenId);
    }//emits transfer event

    
    function updateAdmin(address _admin) external nonReentrant{
        require(msg.sender == admin, "ERR_CODE_3" );
        revokeRole(ADMIN, admin);
        _grantRole(ADMIN, _admin);
        admin = _admin;
    }

    function updateTokenURI(uint256 tokenId, string memory _tokenURI) nonReentrant public {
        require(msg.sender == admin, "ERR_CODE_3" );
        _setTokenURI(tokenId, _tokenURI);
    }

    function setSellerRole(address _seller) public {
        grantRole(SELLER, _seller);        
    }
    function revokeSellerRole(address _seller) public nonReentrant {
        revokeRole(SELLER, _seller);
    }
} 


