//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;
import {VoteOption} from "./ElectionStructs.sol";
import "./Election.sol";

contract Deployer {
    event ElectionCreated(
        address electionAddress,
        string electionTitle,
        uint256 electionEndtime
    );

    function deployElection(
        VoteOption[] memory options,
        uint256 endtime,
        string memory e,
        string memory title,
        string memory encryptedZero
    ) public {
        Election newElection = new Election(
            options,
            endtime,
            e,
            title,
            encryptedZero,
            msg.sender
        );
        emit ElectionCreated(address(newElection), title, endtime);
    }
}
