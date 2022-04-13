import { ethers } from 'ethers';

import Deployer from '../artifacts/contracts/Deployer.sol/Deployer.json';
import { deployerAddress } from '../Common';
import VoteOption from '../types/VoteOption';
import { handleRevert } from './Common';

declare let window: any;

export async function deployElection(
  options: VoteOption[],
  endtime: string,
  title: string
) {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(deployerAddress, Deployer.abi, signer);
    try {
      const transaction = await contract.deployElection(
        options,
        Number(endtime),
        "123",
        title,
        "123"
      );
      const election = await transaction.wait();
      const electionData = election.events?.filter((x: any) => {
        return x.event === "ElectionCreated";
      })[0].args;
      return electionData.electionAddress;
    } catch (err: unknown) {
      handleRevert(err);
    }
  }
}
