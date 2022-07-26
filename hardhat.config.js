require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require('solidity-coverage');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const WALLET_PRIVATE_KEY = process.env.MY_WALLET_PRIVATE_KEY;
const ALCHEMY_API_KEY_RINKEBY = process.env.ALCHEMY_API_KEY_RINKEBY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY_RINKEBY}`,
      accounts: [`${WALLET_PRIVATE_KEY}`]
    },
  },
  etherscan: {
    apiKey: `${ETHERSCAN_API_KEY}`
  }
};
