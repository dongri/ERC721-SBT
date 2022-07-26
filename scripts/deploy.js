// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // Fist time
  const SoulboundToken = await ethers.getContractFactory("SoulboundToken");
  const token = await upgrades.deployProxy(SoulboundToken);
  await token.deployed();
  console.log("SoulboundToken deployed to:", token.address);

  // Secound time
  // const SoulboundToken = await ethers.getContractFactory("SoulboundToken");
  // const token = await upgrades.upgradeProxy('0xf17aF3c38A154323DD6a7D92296Cfc798082e08E', SoulboundToken);
  // await token.deployed();
  // console.log("SoulboundToken deployed to:", token.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
