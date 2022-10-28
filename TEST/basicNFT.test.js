const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")


!deploymentChain.includes(network.name) 
    ? describe.skip
    : describe("Basic NFT uint TEST", function () {
        let basicNFt, deployer

        beforeEach(async () => {
            accounts = await ethers.getSigner()
            deployer = accounts[0]
            await deployments.fixture(["basicnft"])
            basicNFt = await ethers.getContract("BasicNFT")
        })
         //test01

         describe("constructor", () => {
            it("Initializes the NFT Corrwctly.", async  () => {
                const name = await basicNFT.name()
                const symbol = await basicNFt.symbol()
                const tokenCounter=await basicNft.getTokenCounter()
                assert.equal(name, " Dogie")
                assert.equal(symbol,"DOG")
                assert.equal(tokenCounter.tostring(), "0")
            })
         })
         //test02

         describ("Mint NFT", () => {
            beforeEach(async () => {
                const txResponse = await basicNFT.mintNFt()
                await txResponse.wait(1)
            })
            it("Allowes users to mint an NFT update appropriately", async function () {
                const tokenURI = await basicNFt.tokenURI(0)
                const tokenCounter = await basicNFt.getTokenCounter()

                assert.equal(tokenCounter.tostring(), "1")
                assert.equal(tokenURI, await basicNft.TOKEN_URI())
            })
            it("shows the correct balnce and owner of an NFT", async function () {
                const deployerAddress = deployer.address;
                const deployerBalance = await besicNFt.balanceOf(deployerAddress)
                const owner = await basicNFt.ownerof("1")

                assert.equal(deployerBalance.tostring(), "1")
                assert.equal(owner, deployerAddress)
            })
         })
    })