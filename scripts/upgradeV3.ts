export {};
const { ethers, upgrades } = require("hardhat");

const TOKENAVGPRICE_ADDRESS = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853';

async function main() {
  const TokenAvgPriceV3 = await ethers.getContractFactory("TokenAvgPriceV3");
  await upgrades.upgradeProxy(TOKENAVGPRICE_ADDRESS, TokenAvgPriceV3);
  console.log("TokenAvgPrice upgraded");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});