//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

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

    string[] votes;
    address[] voters;
    mapping(address => uint256) voteMap;
    mapping(string => uint256) optionMap;
    VoteOption[4] options;
    VoteResult[4] results;

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
        for (uint256 i = 0; i < results.length; i++) {
            results[i] = VoteResult(options[i], 0);
            optionMap[options[i].name] = i;
        }
        votes.push("");
        endtime = block.timestamp + 180;
    }

    function getOptions() public view returns (VoteOption[4] memory) {
        return options;
    }

    function getCurrentVote(address user) public view returns (string memory) {
        if (bytes(votes[voteMap[msg.sender]]).length == 0) {
            return "";
        } else {
            return votes[voteMap[user]];
        }
    }

    function getEndTime() public view returns (uint256) {
        return endtime;
    }

    function tallyVotes() public {
        for (uint256 i = 1; i < votes.length; i++) {
            results[optionMap[votes[i]]].count += 1;
        }
    }

    function getVoteCounts() public view returns (VoteResult[4] memory) {
        require(block.timestamp > endtime, "Election is still in progress.");
        return results;
    }

    function recordVote(string memory _vote) public {
        require(block.timestamp < endtime, "Election has closed.");
        if (bytes(votes[voteMap[msg.sender]]).length == 0) {
            votes.push(_vote);
            voteMap[msg.sender] = votes.length - 1;
        } else {
            votes[voteMap[msg.sender]] = _vote;
        }
    }
}
