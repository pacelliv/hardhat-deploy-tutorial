// SPDX-License-Identifier: MIT
// The line above is recommended and let you define the license of your contract

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.8;

import "hardhat/console.sol";

// This is the main building block for smart contracts.
contract Token {
    // Some string type variables to identify the token.
    // The `public` modifier makes a variable readable from outside the contract.
    string public name = "My New Token";
    string public symbol = "MNT";

    // The fixed amount of tokens stored in an unsigned integer type variable.
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    // Events helps off-chain application understand what happens
    // within your contract
    event Transfer(address indexed _from, address _to, uint256 _value);
    event Burn(address indexed _from, address _to, uint256 _value);

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     */
    constructor(address _owner) {
        // The totalSupply is assigned to transaction sender, which is the account
        // that is deploying the contract.
        balances[_owner] = totalSupply;
        owner = _owner;
    }

    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function transfer(address to, uint256 amount) external {
        console.log("Sender balance is %s tokens", balances[msg.sender]);
        console.log("Sending %s tokens to %s", amount, to);

        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;

        console.log("Balance of %s is %s tokens", to, balances[to]);

        emit Transfer(msg.sender, to, amount);
    }

    /**
     * A function to burn tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function burn(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // Burns the amount
        balances[msg.sender] -= amount;
        totalSupply -= amount;
        emit Burn(msg.sender, address(0), amount);
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
