require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require("solidity-coverage")
require("dotenv").config()

const GOERLI_RPC_URL = process.env.RPC_URL_GOERLI_ALCHEMY
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
    solidity: {
        version: "0.8.8",
    },
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        tokenOwner: {
            default: 1,
        },
    },
    paths: {
        sources: "src",
    },
}
