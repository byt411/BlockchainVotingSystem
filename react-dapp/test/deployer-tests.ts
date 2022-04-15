import { expect } from 'chai';
import { Contract, ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

import VoteOption from '../src/types/VoteOption';

describe("Deployer", function () {
    let DeployerContract;
    let Deployer: Contract;
    let ElectionContract: ContractFactory;
    let Election;
    let electionManager;
    let alice;
    let bob;
    let chris;
    let addrs;
    let options: VoteOption[];
    
    beforeEach(async () => {
        options = [new VoteOption("A", "PartyA", "", 0), new VoteOption("B", "PartyB", "", 1)]
        DeployerContract = await ethers.getContractFactory("Deployer");
        [electionManager, alice, bob, chris, addrs] = await ethers.getSigners();
        Deployer = await DeployerContract.deploy();
        ElectionContract = await ethers.getContractFactory("Election");
        await Deployer.deployed();
    })

    describe("Create Election", () => {
        it("Deployer deploys new Election successfully", async function () {
            
            const tx = await Deployer.deployElection(options, 1649631600, "123", "Test Election", "0", "0", "0");
            const receipt = await tx.wait();
            expect(receipt.events.length == 1);
            Election = await ElectionContract.attach(receipt.events[0].args.electionAddress);
            const retrievedTitle = await Election.title();
            const retrievedOptions = await Election.getOptions();
            const retrievedE = await Election.e()
            expect(retrievedTitle).to.equal("Test Election");
            expect(retrievedOptions[0].name).to.equal("PartyA");
            expect(retrievedOptions[1].name).to.equal("PartyB");
            expect(retrievedE).to.equal("123");
        })
    })
})