const setUsers = async (accounts, contracts) => {
    let users = []
    await new Promise(async (resolve, reject) => {
        try {
            for (const account of accounts) {
                users.push(await setUser(account, contracts))
            }
            resolve()
        } catch (e) {
            reject(e)
        }
    })
    return users
}

const setUser = async (address, contracts) => {
    let user
    await new Promise(async (resolve, reject) => {
        try {
            for (const key of Object.keys(contracts)) {
                user = await contracts[key].connect(
                    await ethers.getSigner(address)
                )
            }
            resolve()
        } catch (e) {
            reject(e)
        }
    })
    return {
        Token: user,
        address: user.signer.address,
    }
}

module.exports = {
    setUsers,
    setUser,
}
