//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;
import "hardhat/console.sol";

contract Greeter {
    struct VoteOption {
        string name;
        string acronym;
    }

    struct Vote {
        uint256 timestamp;
        VoteOption vote;
    }
    mapping(address => VoteOption) public votes;
    VoteOption[] options;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter:");
        options.push(VoteOption("Partido Popular", "PP"));
        options.push(VoteOption("Partido Socialista Obrero Espanol", "PSOE"));
        options.push(VoteOption("Unidas Podemos", "UP"));
        options.push(VoteOption("Ciudadanos", "Cs"));
    }

    function getOptions()
        public
        view
        returns (VoteOption[] memory retrievedOptions)
    {
        return options;
    }

    function getCurrentVote(address user)
        public
        view
        returns (VoteOption memory)
    {
        return votes[user];
    }

    function recordVote(address user, VoteOption memory _vote) public {
        votes[user] = _vote;
    }
}
