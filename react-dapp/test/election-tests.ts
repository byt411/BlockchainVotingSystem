import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Contract, ContractFactory, Signer } from 'ethers';
import { ethers } from 'hardhat';

import { Provider } from '@ethersproject/abstract-provider';

import VoteOption from '../src/types/VoteOption';

const expect = chai.expect
chai.use(chaiAsPromised);
describe("Election", () => {
    let DeployerContract;
    let Deployer: Contract;
    let ElectionContract: ContractFactory;
    let Election: Contract;
    let electionManager;
    let alice: string | Signer | Provider;
    let bob;
    let chris;
    let addrs;
    let options: VoteOption[];
    
    async function createElection(_options: VoteOption[], _endtime: number, _e: string, _encryptedZero: string, _pubkeyN: string, _pubkeyG: string) {
        const tx = await Deployer.deployElection(_options, _endtime, _e, "Test Election", _encryptedZero, _pubkeyN, _pubkeyG);
        const receipt = await tx.wait();
        Election = await ElectionContract.attach(receipt.events[0].args.electionAddress);
    }   

    before(async () => {
        options = [new VoteOption("A", "PartyA", "", 0), new VoteOption("B", "PartyB", "", 1)]
        DeployerContract = await ethers.getContractFactory("Deployer");
        [electionManager, alice, bob, chris, addrs] = await ethers.getSigners();
        Deployer = await DeployerContract.deploy();
        ElectionContract = await ethers.getContractFactory("Election");
        await Deployer.deployed();
    })



    describe("Voting Fail", () => {

        it("Cannot vote if Election closed", async () => {
            await createElection(options, Math.ceil(new Date().getTime() / 1000) - 60, "0", "0", "0", "0");
            async function voteAttempt() {await Election.connect(alice).recordVote("test");}
            await expect(voteAttempt()).to.be.rejectedWith("VM Exception while processing transaction: reverted with reason string 'Election has closed.'");
        })
    })

    describe("Voting Success", () => {
        let now: number;
        beforeEach(async () => {
            now = Math.ceil(new Date().getTime() / 1000)
            await createElection(options, now + 60, "0", "0", "0", "0");
        })
        it("Can cast vote", async () => {
            const voteAttempt = await Election.connect(alice).recordVote("testVote");
            const receipt = await voteAttempt.wait();
            const vote = receipt.events[0].args.vote;
            const timestamp = receipt.events[0].args.timestamp;
            expect(vote).to.equal("testVote");
            expect(Number(timestamp)).to.be.greaterThan(now);
        })

        it("Can re-cast vote", async () => {
            const voteAttempt1 = await Election.connect(alice).recordVote("testVote");
            const receipt1 = await voteAttempt1.wait();
            const vote1 = receipt1.events[0].args.vote;
            const timestamp1 = Number(receipt1.events[0].args.timestamp);
            expect(vote1).to.equal("testVote");
            expect(timestamp1).to.be.greaterThan(now);

            const voteAttempt2 = await Election.connect(alice).recordVote("secondTestVote");
            const receipt2 = await voteAttempt2.wait();
            const vote2 = receipt2.events[0].args.vote;
            const timestamp2 = Number(receipt2.events[0].args.timestamp);
            expect(vote2).to.equal("secondTestVote");
            expect(timestamp2).to.be.greaterThan(now).and.to.be.greaterThan(timestamp1);
        })
    })
})