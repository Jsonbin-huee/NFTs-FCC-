require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")



const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xc7b8d6a987e898556daf089d831b21b1a208fdc81e18e2f5530104c8d4b6b647"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


module.exports = {
  // solidty 
  solidity: {
    compilers: [
      { version: "0.8.7" },
      { version: "0.6.6" },
      { version: "0.6.12" },
      { version: "0.4.19" },
    ]
  },
  defaultNetwork: "hardhat",
  networks: {
      hardhat: {
          chainId: 31337,
          forking: {
              url: MAINNET_RPC_URL,
          },
      },
      localhost: {
          chainId: 31337,
      },
      goerli: {
          url: GOERLI_RPC_URL,
          account: [`0x${process.env.RCP_PRIVATE_KEY}`],
          chainId: 5,
          blockConfirmations: 6,
      },
  },
  etherscan: {
      apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
      enabled: true,
      currency: "USD",
      outputFile: "gas-report.txt",
      noColors: true,
      // coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
      deployer: {
          default: 0, // here this will by default take the first account as deployer
          1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      },
  },
}

