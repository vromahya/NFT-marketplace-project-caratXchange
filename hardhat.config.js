require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// url: "https://rpc-mumbai.matic.today",
// url: "https://rpc-mainnet.maticvigil.com",

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    local: {
      url: `http://127.0.0.1:8545/`,
      accounts: [
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      ],
    },
    mumbai: {
      // Infura
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    matic: {
      // Infura
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: '0.8.10',
};
