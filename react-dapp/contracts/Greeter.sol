//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;
import "hardhat/console.sol";

contract Greeter {
    struct VoteOption {
        string name;
        string acronym;
        string logourl;
    }

    struct Vote {
        uint256 timestamp;
        VoteOption vote;
    }
    mapping(address => VoteOption) public votes;
    VoteOption[] options;

    constructor(string memory _greeting) {
        options.push(
            VoteOption(
                "Partido Popular",
                "PP",
                "https://upload.wikimedia.org/wikipedia/commons/3/38/PP_icono_2019.svg"
            )
        );
        options.push(
            VoteOption(
                "Partido Socialista Obrero Espanol",
                "PSOE",
                "https://upload.wikimedia.org/wikipedia/commons/4/41/Logotipo_del_PSOE.svg"
            )
        );
        options.push(
            VoteOption(
                "Unidas Podemos",
                "UP",
                "https://upload.wikimedia.org/wikipedia/commons/7/7d/Logo_Unidas_Podemos_2019b.png"
            )
        );
        options.push(
            VoteOption(
                "Ciudadanos",
                "Cs",
                "https://upload.wikimedia.org/wikipedia/commons/7/76/Logo_oficial_Ciudadanos.svg"
            )
        );
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
