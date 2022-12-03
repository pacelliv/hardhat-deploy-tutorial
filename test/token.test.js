const { expect } = require("chai")
const { setUsers, setUser } = require("../utils/users")
const {
    ethers,
    deployments,
    getNamedAccounts,
    getUnnamedAccounts,
} = require("hardhat")

async function setup() {
    await deployments.fixture(["token"])
    const contracts = {
        Token: await ethers.getContract("Token"),
    }

    const { tokenOwner } = await getNamedAccounts()
    const users = await setUsers(await getUnnamedAccounts(), contracts)

    return {
        ...contracts,
        users,
        tokenOwner: await setUser(tokenOwner, contracts),
    }
}

describe("Token contract", function () {
    let tokenOwner, Token, users
    beforeEach(async function () {
        tokenOwner = (await setup()).tokenOwner
        Token = (await setup()).Token
        users = (await setup()).users
    })

    describe("Constructor/deployment", function () {
        it("Set the owner correctly", async function () {
            expect(await Token.owner()).to.equal(tokenOwner.address)
        })

        it("Assign the total supply of tokens the owner", async function () {
            expect(await Token.totalSupply()).to.equal(
                await Token.balanceOf(tokenOwner.address)
            )
        })
    })

    describe("Transactions", function () {
        it("Tx should fail if sender doesn't have enough tokens", async function () {
            await expect(
                users[0].Token.transfer(users[1].address, 100000)
            ).to.be.revertedWith("Not enough tokens")

            expect(await Token.balanceOf(users[1].address)).to.equal(0) // balance must not have changed
        })

        it("Allows transactions between accounts if sender have enough tokens", async function () {
            await tokenOwner.Token.transfer(users[0].address, 500000)
            await users[0].Token.transfer(users[1].address, 250000)

            expect(await Token.balanceOf(users[1].address)).to.equal(250000)
        })

        it("Emits event on transfering tokens", async function () {
            await expect(
                tokenOwner.Token.transfer(users[0].address, 100000)
            ).to.emit(Token, "Transfer")
        })

        it("Updates the balances correctly after transactions", async function () {
            const initialOwnerBalance = await Token.balanceOf(
                tokenOwner.address
            )
            await tokenOwner.Token.transfer(users[0].address, 250000)
            await tokenOwner.Token.transfer(users[1].address, 125000)
            const endingOwnerBalance = await Token.balanceOf(tokenOwner.address)

            expect(endingOwnerBalance).to.equal(
                initialOwnerBalance - (250000 + 125000)
            )
        })
    })

    describe("Burning", function () {
        it("Burn should fail if sender doesn't have enough tokens", async function () {
            await expect(users[0].Token.burn(100000)).to.be.revertedWith(
                "Not enough tokens"
            )
        })

        it("Allows to burn tokens", async function () {
            const initialTokenSupply = await Token.totalSupply()
            await tokenOwner.Token.transfer(users[0].address, 175000)
            await users[0].Token.burn(175000)
            const endingTokenSupply = await Token.totalSupply()

            expect(endingTokenSupply).to.equal(initialTokenSupply - 175000)
        })

        it("Emits event on burning tokens", async function () {
            await expect(tokenOwner.Token.burn(100000)).to.emit(Token, "Burn")
        })
    })
})
