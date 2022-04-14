//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

struct VoteOption {
    string name;
    string acronym;
    string logourl;
    uint16 power;
}

struct VoteResult {
    VoteOption option;
    uint32 count;
}
