import { ethers } from 'ethers';

import Election from '../artifacts/contracts/Election.sol/Election.json';
import { electionAddress, pubKey } from '../Common';
import VoteOption from '../types/VoteOption';
import { handleRevert } from './Common';

declare let window: any;
export async function recordVote(vote: VoteOption) {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(electionAddress, Election.abi, signer);
    try {
      const voteAsInt = BigInt(10) ** (BigInt(9) * BigInt(vote.power));
      console.log(voteAsInt);
      const encryptedVote = pubKey.encrypt(voteAsInt);
      console.log(encryptedVote);
      const transaction = await contract.recordVote(encryptedVote.toString(), {
        gasPrice: provider.getGasPrice(),
        gasLimit: 1000000,
      });
      const response = await transaction.wait();
      const responseData = response.events?.filter((x: any) => {
        return x.event === "VoteCast";
      })[0].args;
      return responseData;
    } catch (err: unknown) {
      handleRevert(err);
    }
  }
}
