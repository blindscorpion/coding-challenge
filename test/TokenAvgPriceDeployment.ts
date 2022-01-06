import { expect } from "chai";
import { ethers } from "hardhat";
import '@nomiclabs/hardhat-waffle';
import { Contract, ContractFactory, Signer } from 'ethers';


describe("Token Avg Price Deployment", function () {
    let accounts: Signer[];
    let provider: any;
    let deployer: Signer;
    let testUsers: Signer[];
    let tokenAvgPrice: Contract;
    let tokenAvgPriceUser2: Contract;
    const weth: string = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";


    before(async () => {
        accounts = await ethers.getSigners();
        provider = await ethers.getDefaultProvider();
        [deployer, ...testUsers] = accounts;
    });

    it("Should deploy Token Avg Price V1", async function () {
        const TokenAvgPrice: ContractFactory = await ethers.getContractFactory("contracts/TokenAvgPrice.sol:TokenAvgPrice");
        tokenAvgPrice = await upgrades.deployProxy(TokenAvgPrice, [1609459200]);
        await tokenAvgPrice.deployed();
        expect(await tokenAvgPrice.yearStart()).to.equal(1609459200);
    });

    it("Should allow anyone to set daily price", async function () {
        tokenAvgPriceUser2 = await tokenAvgPrice.connect(testUsers[0]);
        await tokenAvgPrice.setDailyPrice(weth, 0, 500);
        await tokenAvgPriceUser2.setDailyPrice(weth, 1, 1200);
        expect(await tokenAvgPrice.tokenPrice(weth, 0)).to.equals(500);        
        expect(await tokenAvgPrice.tokenPrice(weth, 1)).to.equals(1200);
    });

    it("Should pause and unpause", async function () {
        await tokenAvgPrice.pause();
        await expect(tokenAvgPrice.setDailyPrice(weth, 2, 2000)).to.be.revertedWith("Pausable: paused");
        await tokenAvgPrice.unpause();
        await tokenAvgPrice.setDailyPrice(weth, 2, 2000);
        expect(await tokenAvgPrice.tokenPrice(weth, 2)).to.equals(2000);
    });

    it("Should calculate average price over a given period", async function () {
        let avgPrice: number = await tokenAvgPrice.getAveragePrice(weth, 0, 1);
        let expectedAvgPrice: number = (500 + 1200) / 2;
        expect(avgPrice).to.equals(expectedAvgPrice);
    });

    it("Should upgrade to TokenAvgPriceV2 amd only allow owner to set price", async function () {
        const TokenAvgPriceV2: ContractFactory = await ethers.getContractFactory("contracts/TokenAvgPriceV2.sol:TokenAvgPriceV2");
        await upgrades.upgradeProxy(tokenAvgPrice.address, TokenAvgPriceV2);
        await tokenAvgPrice.setDailyPrice(weth, 0, 500);
        expect(await tokenAvgPrice.tokenPrice(weth, 0)).to.equals(500);
        await expect(tokenAvgPriceUser2.setDailyPrice(weth, 1, 1200)).to.be.reverted;
    });

    it("Should upgrade to TokenAvgPriceV3 and only allow owner to set the current day's price", async function () {
        const TokenAvgPriceV3: ContractFactory = await ethers.getContractFactory("contracts/TokenAvgPriceV3.sol:TokenAvgPriceV3");
        await upgrades.upgradeProxy(tokenAvgPrice.address, TokenAvgPriceV3);
        await tokenAvgPrice.setDailyPrice(weth, 0, 500);
        expect(await tokenAvgPrice.tokenPrice(weth, 0)).to.equals(500);
        await expect(tokenAvgPrice.setDailyPrice(weth, 8, 800)).to.be.revertedWith("Can only set current day's price");
    });

    it("Should get average price from August to September 2021", async function () {
        for(let i=0; i<365; i++) {
            const rndInt: number = Math.floor(Math.random() * 10000) + 1
            await tokenAvgPrice.setDailyPrice(weth, i, rndInt);
            await ethers.provider.send('evm_increaseTime', [24 * 60 * 60]);
        }
        let avgPrice: number = await tokenAvgPrice.getAveragePrice(weth, 211, 242);
        console.log(avgPrice);

    });
});
