const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const Auction = await hre.ethers.getContractFactory('ReserveAuction');
  const auction = await Auction.deploy();

  await auction.deployed();

  const Marketplace = await hre.ethers.getContractFactory('MarketPlace');

  const marketplace = await Marketplace.deploy(auction.address);

  await marketplace.deployed();

  const NFTMint = await hre.ethers.getContractFactory('NFTMint');

  const nftMint = await NFTMint.deploy(marketplace.address, auction.address);

  await nftMint.deployed();

  fs.writeFileSync(
    './config.js',
    `
  export const auctionAddress = "${auction.address}"
  export const marketplaceAddress = "${marketplace.address}"
  export const nftMintAddress = "${nftMint.address}"
  `
  );

  console.log('Contracts deployed');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
