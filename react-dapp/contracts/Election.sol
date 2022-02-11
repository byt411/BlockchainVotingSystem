//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;
import "hardhat/console.sol";

contract Election {
    uint256 endtime;
    struct VoteOption {
        string name;
        string acronym;
        string logourl;
    }

    struct VoteResult {
        VoteOption option;
        uint32 count;
    }
    VoteOption[4] options;
    VoteResult[4] results;

    mapping(address => VoteOption) voteMap;
    mapping(string => uint8) optionIndex;

    constructor() {
        options[0] = VoteOption(
            "Partido Popular",
            "PP",
            "https://upload.wikimedia.org/wikipedia/commons/3/38/PP_icono_2019.svg"
        );
        options[1] = VoteOption(
            "Partido Socialista Obrero Espanol",
            "PSOE",
            "https://upload.wikimedia.org/wikipedia/commons/4/41/Logotipo_del_PSOE.svg"
        );
        options[2] = VoteOption(
            "Unidas Podemos",
            "UP",
            "https://upload.wikimedia.org/wikipedia/commons/7/7d/Logo_Unidas_Podemos_2019b.png"
        );
        options[3] = VoteOption(
            "Ciudadanos",
            "Cs",
            "https://upload.wikimedia.org/wikipedia/commons/7/76/Logo_oficial_Ciudadanos.svg"
        );

        for (uint256 i = 0; i < options.length; i++) {
            results[i] = VoteResult(options[i], 0);
        }

        endtime = block.timestamp + 180;
    }

    function getOptions() public view returns (VoteOption[4] memory) {
        return options;
    }

    function getCurrentVote(address user)
        public
        view
        returns (VoteOption memory)
    {
        return voteMap[user];
    }

    function getEndTime() public view returns (uint256) {
        return endtime;
    }

    function getVoteCounts() public view returns (VoteResult[4] memory) {
        require(block.timestamp > endtime, "Election is still in progress.");
        return results;
    }

    function recordVote(address user, string memory _vote) public {
        require(block.timestamp < endtime, "Election has closed.");
        VoteOption memory recordedVote = options[optionIndex[_vote]];
        VoteOption memory existingVote = voteMap[user];
        if (results[optionIndex[existingVote.name]].count != 0) {
            results[optionIndex[existingVote.name]].count -= 1;
        }
        voteMap[user] = recordedVote;
        results[optionIndex[recordedVote.name]].count += 1;
    }
}
