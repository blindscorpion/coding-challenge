export {};

const { ethers, upgrades } = require("hardhat");

async function main() {
  const TokenAvgPrice = await ethers.getContractFactory("TokenAvgPrice");
  const tokenAvgPrice = await upgrades.deployProxy(TokenAvgPrice, [1609459200]);
  await tokenAvgPrice.deployed();
  console.log("TokenAvgPrice deployed to:", tokenAvgPrice.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});