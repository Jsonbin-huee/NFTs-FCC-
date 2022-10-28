const pinataSDK =require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const piantaSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []
    for (fileIndex in files ) {
        const readableStramforFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`) 
        try {
            const respone = await pinataApiKey.pinFileToIPFS(readableStramforFile)
            responses.push(respone)
        } catch (error){
            console.log(error)
        }
    }
    return{responses, files}
}  
moudle.exports = { storeImages }