//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;
import "hardhat/console.sol";

contract Election {
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

    mapping(string => uint32) public voteCounts;

    constructor() {
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

        for (uint32 i = 0; i < options.length; i++) {
            voteCounts[options[i].name] = 0;
        }
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

    function getVoteCounts() public view returns (uint32[] memory) {
        uint32[] memory output = new uint32[](options.length);
        for (uint32 i = 0; i < options.length; i++) {
            output[i] = voteCounts[options[i].name];
        }
        return output;
    }

    function recordVote(address user, VoteOption memory _vote) public {
        if (voteCounts[votes[user].name] != 0) {
            voteCounts[votes[user].name] -= 1;
        }
        votes[user] = _vote;
        voteCounts[votes[user].name] += 1;
    }
}
