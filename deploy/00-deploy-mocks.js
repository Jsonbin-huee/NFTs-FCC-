const { network } = require("hardhat")
const { DECIMALS, INITIAL_PRICE  } = require("../helper-hardhat-config")

moudle.exports = async ({ getNamedAccounts, deployments}) => {
    const { deploy, log} = deployments 
    const {deployer} = await getNamedAccounts()
    const chainID = network.config.chainId

    // If we are on a local devlopment network, we need to deploy mocks!!>
    if (chainID == 31337) {
        log("Local network detected! Deploying mock..")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true, 
            args: [BASE_FEE, GAS_PRICE_LINK],
        })
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        

        log("Mocks Deployed!")
        log("-------------------------")
        log("You are deploying to a local network, you'll need a local network runnign to interact")
        log("Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!")
        log("------------------------")
    }
}
module.exports.tags = ["all", "mocks", "main"]