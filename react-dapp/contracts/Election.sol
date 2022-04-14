//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;
import {VoteOption, VoteResult} from "./ElectionStructs.sol";

contract Election {
    event VoteCast(string vote, uint256 timestamp);

    string public title;
    address public creator;
    uint256 public endtime;
    bool public resultsPublished;
    bool public proofPublished;
    string encryptedTotal;
    string encodedTotal;

    string u;
    string a;
    string z;
    string public e;
    string negativeR;
    string public pubkeyN;
    string public pubkeyG;

    string[] public votes;
    mapping(address => uint256) voteMap;
    mapping(string => uint256) optionMap;
    VoteOption[10] public options;
    VoteResult[10] public results;

    constructor(
        VoteOption[] memory _options,
        uint256 _endtime,
        string memory _e,
        string memory _title,
        string memory _encryptedZero,
        string memory _pubkeyN,
        string memory _pubkeyG,
        address _creator
    ) {
        for (uint256 i = 0; i < _options.length; i++) {
            options[i] = VoteOption(
                _options[i].name,
                _options[i].acronym,
                _options[i].logourl,
                _options[i].power
            );
            results[i] = VoteResult(options[i], 0);
            optionMap[options[i].name] = i;
        }
        votes.push(_encryptedZero);
        endtime = _endtime;
        e = _e;
        title = _title;
        creator = msg.sender;
        proofPublished = false;
        resultsPublished = false;
        pubkeyN = _pubkeyN;
        pubkeyG = _pubkeyG;
        creator = _creator;
    }

    function publishResults(VoteResult[] memory submittedResults) public {
        require(
            msg.sender == creator,
            "You are not authorized to perform this action."
        );
        require(block.timestamp > endtime, "Election is still in progress.");
        require(!resultsPublished, "The results have already been published.");
        uint256 totalVoteCount = 0;
        for (uint256 i = 0; i < submittedResults.length; i++) {
            totalVoteCount += submittedResults[i].count;
        }
        require(
            totalVoteCount == votes.length - 1,
            "Number of votes cast and votes tallied do not match."
        );
        for (uint256 i = 0; i < submittedResults.length; i++) {
            results[i].count = submittedResults[i].count;
        }
        resultsPublished = true;
    }

    function publishVerification(
        string memory calcEncryptedTotal,
        string memory calcEncodedTotal,
        string memory calcU,
        string memory calcA,
        string memory calcZ,
        string memory calcNegativeR
    ) public {
        require(
            msg.sender == creator,
            "You are not authorized to perform this action."
        );
        require(block.timestamp > endtime, "Election is still in progress.");
        require(
            resultsPublished,
            "The election results have not yet been published."
        );
        require(
            !proofPublished,
            "The verification proof has already been published."
        );
        encryptedTotal = calcEncryptedTotal;
        encodedTotal = calcEncodedTotal;
        u = calcU;
        a = calcA;
        z = calcZ;
        negativeR = calcNegativeR;
        proofPublished = true;
    }

    function getVerification()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (encryptedTotal, encodedTotal, u, a, z, e, negativeR);
    }

    function recordVote(string memory _vote) public {
        require(
            (block.timestamp < endtime) && !resultsPublished && !proofPublished,
            "Election has closed."
        );
        if (voteMap[msg.sender] == 0) {
            votes.push(_vote);
            voteMap[msg.sender] = votes.length - 1;
        } else {
            votes[voteMap[msg.sender]] = _vote;
        }
        emit VoteCast(_vote, block.timestamp);
    }

    function getOptions() public view returns (VoteOption[10] memory) {
        return options;
    }

    function getResults() public view returns (VoteResult[10] memory) {
        return results;
    }

    function getVotes() public view returns (string[] memory) {
        return votes;
    }
}
