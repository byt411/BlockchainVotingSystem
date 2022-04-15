import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { el } from 'date-fns/locale';
import { Contract, ContractFactory, Signer } from 'ethers';
import { ethers } from 'hardhat';

import { Provider } from '@ethersproject/abstract-provider';

import VoteOption from '../src/types/VoteOption';
import VoteResult from '../src/types/VoteResult';

const expect = chai.expect
chai.use(chaiAsPromised);
describe("Election", () => {
    let DeployerContract;
    let Deployer: Contract;
    let ElectionContract: ContractFactory;
    let Election: Contract;
    let electionManager: string | Signer | Provider;
    let alice: string | Signer | Provider;
    let bob: string | Signer | Provider;;
    let chris: string | Signer | Provider;;
    let addrs;
    let options: VoteOption[];
    let now: number;
    
    async function createElection(_options: VoteOption[], _endtime: number, _e: string, _encryptedZero: string, _pubkeyN: string, _pubkeyG: string) {
        const tx = await Deployer.deployElection(_options, _endtime, _e, "Test Election", _encryptedZero, _pubkeyN, _pubkeyG);
        const receipt = await tx.wait();
        Election = await ElectionContract.attach(receipt.events[0].args.electionAddress);
    }   

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

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
        beforeEach(async () => {
            now = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
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

        it("Votes are retrieved correctly", async () => {
            await Election.connect(alice).recordVote("testVote");
            await Election.connect(bob).recordVote("secondTestVote");
            await Election.connect(chris).recordVote("chrisVoteThree");
            const retrievedVotes = await Election.getVotes();
            expect(retrievedVotes[1]).to.equal("testVote");
            expect(retrievedVotes[2]).to.equal("secondTestVote");
            expect(retrievedVotes[3]).to.equal("chrisVoteThree");
        })
    })
    describe("Publish Results Fail", () => {
        let results: VoteResult[];
        beforeEach(async () => {
            now = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
            results = [new VoteResult(options[0], 0), new VoteResult(options[1], 0)];
            await createElection(options, now + 60, "0", "0", "0", "0");
        })

        it("Unauthorised user cannot publish results", async () => {
            
            async function publishAttempt() {await Election.connect(alice).publishResults(results);}
            await expect(publishAttempt()).to.be.rejectedWith("VM Exception while processing transaction: reverted with reason string 'You are not authorized to perform this action.'");
        })

        it("Cannot publish results for ongoing Election", async () => {
            async function publishAttempt() {await Election.connect(electionManager).publishResults(results);}
            await expect(publishAttempt()).to.be.rejectedWith("VM Exception while processing transaction: reverted with reason string 'Election is still in progress.'");
        })

        it("Cannot publish results again if already published", async () => {
            async function publishAttempt() {await Election.connect(electionManager).publishResults(results);}
            ethers.provider.send('evm_increaseTime', [100]);
            await publishAttempt();
            await expect(publishAttempt()).to.be.rejectedWith("VM Exception while processing transaction: reverted with reason string 'The results have already been published.'");
        })

        it("Cannot publish invalid results", async () => {
            results = [new VoteResult(options[0], 100), new VoteResult(options[1], 0)];
            ethers.provider.send('evm_increaseTime', [100]);
            async function publishAttempt() {await Election.connect(electionManager).publishResults(results);}
            await expect(publishAttempt()).to.be.rejectedWith("VM Exception while processing transaction: reverted with reason string 'Number of votes cast and votes tallied do not match.'");
        })
    })

    describe("Publish Results Success", () => {
        let results: VoteResult[];
        beforeEach(async () => {
            now = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
            await createElection(options, now + 60, "0", "0", "0", "0");
            results = [new VoteResult(options[0], 0), new VoteResult(options[1], 0)];
        })

        it("Authorised user can publish results", async () => {

            async function publishAttempt() {await Election.connect(electionManager).publishResults(results);}
            ethers.provider.send('evm_increaseTime', [100]);
            await publishAttempt();
            const retrievedResults = await Election.getResults();
            expect(retrievedResults[0].option.name).to.equal(options[0].name);
            expect(retrievedResults[0].count).to.equal(0);
            expect(retrievedResults[1].option.name).to.equal(options[1].name);
            expect(retrievedResults[1].count).to.equal(0);
        })
    })

    describe("Publish Verification Fail", () => {
        let results: VoteResult[];
        beforeEach(async () => {
            now = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
            await createElection(options, now + 60, "0", "0", "0", "0");
            results = [new VoteResult(options[0], 0), new VoteResult(options[1], 0)];
        })

        it("Unauthorised user cannot publish verification", async () => {
            ethers.provider.send('evm_increaseTime', [100]);
            await Election.connect(electionManager).publishResults(results);
            async function publishAttempt() {await Election.connect(alice).publishVerification("0", "1", "2", "3", "4", "5");}
            await expect(publishAttempt()).to.be.rejectedWith("VM Exception while processing transaction: reverted with reason string 'You are not authorized to perform this action.'");
        })

        it("Cannot publish results for ongoing Election", async () => {
            async function publishAttempt() {await Election.connect(electionManager).publishVerification("0", "1", "2", "3", "4", "5");}
            await expect(publishAttempt()).to.be.rejectedWith("VM Exception while processing transaction: reverted with reason string 'Election is still in progress.'");
        })

        it("Cannot publish results again if already published", async () => {
            ethers.provider.send('evm_increaseTime', [100]);
            await Election.connect(electionManager).publishResults(results);
            async function publishAttempt() {await Election.connect(electionManager).publishVerification("0", "1", "2", "3", "4", "5");}
            await publishAttempt();
            await expect(publishAttempt()).to.be.rejectedWith("VM Exception while processing transaction: reverted with reason string 'The verification proof has already been published.'");
        })
    })

    describe("Publish Verification Success", () => {
        let results: VoteResult[];
        beforeEach(async () => {
            now = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
            await createElection(options, now + 60, "e", "0", "0", "0");
            results = [new VoteResult(options[0], 0), new VoteResult(options[1], 0)];
            ethers.provider.send('evm_increaseTime', [100]);
            await Election.connect(electionManager).publishResults(results);
        })

        it("Authorised user can publish results", async () => {
            async function publishAttempt() {await Election.connect(electionManager).publishVerification("0", "1", "2", "3", "4", "5");}
            await publishAttempt();
            const retrievedVerification = await Election.getVerification();
            expect(retrievedVerification[0]).to.equal("0");
            expect(retrievedVerification[1]).to.equal("1");
            expect(retrievedVerification[2]).to.equal("2");
            expect(retrievedVerification[3]).to.equal("3");
            expect(retrievedVerification[4]).to.equal("4");
            expect(retrievedVerification[5]).to.equal("e");
            expect(retrievedVerification[6]).to.equal("5");
        })
    })

})