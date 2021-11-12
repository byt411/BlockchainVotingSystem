//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    mapping(address => string) public greeting;
    address[] public addresses;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter:");
        addresses = new address[](10);
    }

    function greet(address user) public view returns (string memory) {
        return greeting[user];
    }

    function setGreeting(address user, string memory _greeting) public {
        greeting[user] = _greeting;
        addresses.push(user);
    }

    function getAllGreetings() public view returns (string[] memory) {
        string[] memory allGreetings = new string[](addresses.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            allGreetings[i] = greeting[addresses[i]];
        }

        return allGreetings;
    }
}
