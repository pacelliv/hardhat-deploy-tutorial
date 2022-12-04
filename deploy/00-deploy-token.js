module.exports = async (hre) => {
    const { deployments, getNamedAccounts } = hre // we get the deployments and the getNamedAccounts which are provided by Hardhat Runtime Environment (hre)
    const { deploy } = deployments // the deployment field itself contains the deploy function from hardhat-deploy
    const { deployer, tokenOwner } = await getNamedAccounts() // fetch the accounts. This can be configure in hardhat.config

    await deploy("Token", {
        // This will create a deployment called "Token". By default hardhat-deploy will look for an artifact with the same name.
        from: deployer, // the deployer will be executing the transaction deployment.
        args: [tokenOwner], // tokenOwner is the address used as the first argument to the Token's contract constructor.
        log: true, // Display the address and gas used in the console (not when run when in test)
    })
}

module.exports.tags = ["token"] // this set up a tag so you can execute the script on its own.
