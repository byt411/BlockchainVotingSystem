//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;
import {VoteOption} from "./ElectionStructs.sol";
import "./Election.sol";

contract Deployer {
    constructor() {}

    function deployElection(
        VoteOption[] memory options,
        uint256 endtime,
        string memory e,
        string memory title,
        string memory encryptedZero
    ) public returns (Election) {
        Election newElection = new Election(
            options,
            endtime,
            e,
            title,
            encryptedZero
        );
        return newElection;
    }
}
