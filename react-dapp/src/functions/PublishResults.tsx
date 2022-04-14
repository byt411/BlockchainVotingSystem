import { ethers } from 'ethers';
import * as paillierBigint from 'paillier-bigint';

import Election from '../artifacts/contracts/Election.sol/Election.json';
import { electionAddress, maxVotes, pubKey } from '../Common';
import VoteResult from '../types/VoteResult';
import { handleRevert } from './Common';

declare let window: any;
export function tallyVotes(votes: string[]) {
  let voteResult = BigInt(votes[0]);

  for (let i = 1; i < votes.length; i++) {
    voteResult = pubKey.addition(voteResult, BigInt(votes[i]));
  }
  return voteResult;
}

export function decryptTotal(
  privKey: paillierBigint.PrivateKey,
  encryptedTotal: bigint,
  numOptions: number
) {
  let decryptedResult = privKey.decrypt(encryptedTotal).toString();
  while (decryptedResult.length < maxVotes * numOptions)
    decryptedResult = "0" + decryptedResult;
  console.log(decryptedResult);
  return decryptedResult;
}

export function decodeResult(encodedResult: string) {
  const decodedResult = encodedResult
    .toString()
    .match(/\d{1,9}/g)
    ?.map((x) => +x.toString());
  decodedResult?.reverse();
  return decodedResult;
}

export async function publishResults(calculatedResults: VoteResult[]) {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(electionAddress, Election.abi, signer);
    try {
      const transaction = await contract.publishResults(calculatedResults, {
        gasPrice: provider.getGasPrice(),
        gasLimit: 1000000,
      });
      await transaction.wait();
    } catch (err: unknown) {
      handleRevert(err);
    }
  }
}

export async function publishProofs(
  encryptedTotal: string,
  encodedTotal: string,
  u: string,
  a: string,
  z: string,
  r: string
) {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(electionAddress, Election.abi, signer);
    try {
      const transaction = await contract.publishVerification(
        encryptedTotal,
        encodedTotal,
        u,
        a,
        z,
        r,
        {
          gasPrice: provider.getGasPrice(),
          gasLimit: 4000000,
        }
      );
      await transaction.wait();
    } catch (err: unknown) {
      console.log(err);
      console.log(typeof err);
      handleRevert(err);
    }
  }
}

export async function getVotes() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      electionAddress,
      Election.abi,
      provider
    );
    try {
      const raw_results = await contract.getVotes();
      return raw_results;
    } catch (err) {
      console.log("Error: ", err);
    }
  }
}

export async function getE() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      electionAddress,
      Election.abi,
      provider
    );
    try {
      const e = await contract.e();
      console.log(e);
      return e;
    } catch (err: unknown) {
      handleRevert(err);
    }
  }
}
