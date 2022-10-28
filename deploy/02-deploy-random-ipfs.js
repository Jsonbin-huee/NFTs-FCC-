const { EtherscanProvider } = require("@ethersproject/providers")
const {network} = require("hardhat")
const {developmentChains, networkConfig} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function({getNamedAccounts, deployments}) {
    const {deploy, log} = deployments 
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId 
    let vrfCoordinatorV2Address, subscriptionId,VRFCoordinatorV2Mock

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    if (chainId == 31337) {
        // create VRFV2 Subscription 
        VRFCoordinatorV2Mock = await EtherscanProvider.getcontract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address
        const transctionResponse = await VRFCoordinatorV2Mock.createSubscriptionId()
        const transctionReceipt = await transctionResponse.wait()
        subscriptionId = transctionReceipt.events[0].args.subId
        // Fund the subscription
        // our mock makes it so we don't actually have to worry about sending fund
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkconfig[chainId].subscriptionId
    }

    log("------------------------------")
    arguments =[
        vrfCoordinatorV2Address,
        subscriptionId,
        networkconfig[chainId]["gasLane"],
        networkconfig[chainId]["mintFee"],
        networkconfig[chainId]["callbackgasLimit"],
    ]
    const randomIpfsNft =await deploy("RandomIpfsNFT", {
        from: deployer,
        args: arguments,
        log: true,
        waitcomfirmations: network.config.blockconfirmations || 1,
    })

    if (chainId == 31337) {
    await VRFCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address) 
    }

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")

        await verify(randomIpfsNft.address, arguments)
    }
}
async function handleTokenUris(){
    tokenUris = []
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs uploaded! They are:")
    console.log(tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]



