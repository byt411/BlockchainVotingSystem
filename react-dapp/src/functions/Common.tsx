import { ethers } from "ethers";

import Election from "../artifacts/contracts/Election.sol/Election.json";
import { electionAddress, pubKey } from "../Election";
import VoteOption from "../types/VoteOption";

declare let window: any;
export async function requestAccount() {
  const address = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return address;
}

export async function getOptions() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
    const contract = new ethers.Contract(
      electionAddress,
      Election.abi,
      provider
    );
    try {
      const options = await contract.getOptions();
      return options;
    } catch (err) {
      console.log("Error: ", err);
    }
  }
}

export async function getCreator() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      electionAddress,
      Election.abi,
      provider
    );
    try {
      const creator = await contract.getCreator();
      return creator;
    } catch (err) {
      console.log("Error: ", err);
    }
  }
}

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
      await transaction.wait();
    } catch (err: unknown) {
      handleRevert(err);
    }
  }
}

export function handleRevert(err: unknown) {
  if (err instanceof Error) {
    console.log(err.message);
    const message = err.message.match(/"message":"(.*?)"/)![0].slice(11, -1);
    alert(message.replace("execution reverted: ", ""));
  }
}
