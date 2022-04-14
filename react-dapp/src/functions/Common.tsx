import { ethers } from 'ethers';

import Election from '../artifacts/contracts/Election.sol/Election.json';
import { electionAddress } from '../Common';
import VoteOption from '../types/VoteOption';

declare let window: any;
export async function requestAccount() {
  const address = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return address;
}

export async function getTitle(inputAddress: string) {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(inputAddress, Election.abi, provider);
    try {
      console.log(inputAddress);
      const title = await contract.title();
      return title;
    } catch (err) {
      console.log("Error: ", err);
    }
  }
}

export async function getOptions() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      electionAddress,
      Election.abi,
      provider
    );
    try {
      const options = await contract.getOptions();
      return options.filter(function (option: VoteOption) {
        return option.name !== "";
      });
    } catch (err) {
      console.log("Error: ", err);
    }
  }
}

export async function getResultsPublished() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      electionAddress,
      Election.abi,
      provider
    );
    try {
      const resultsPublished = await contract.resultsPublished();
      return resultsPublished;
    } catch (err) {
      console.log("Error: ", err);
    }
  }
}

export async function getProofPublished() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      electionAddress,
      Election.abi,
      provider
    );
    try {
      const resultsPublished = await contract.proofPublished();
      return resultsPublished;
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
      const creator = await contract.creator();
      return creator;
    } catch (err) {
      console.log("Error: ", err);
    }
  }
}

export async function getPubkey() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      electionAddress,
      Election.abi,
      provider
    );
    try {
      const n = await contract.pubkeyN();
      const g = await contract.pubkeyG();
      return { n, g };
    } catch (err) {
      console.log("Error: ", err);
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
