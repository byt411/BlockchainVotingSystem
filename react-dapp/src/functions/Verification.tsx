import { ethers } from 'ethers';

import Election from '../artifacts/contracts/Election.sol/Election.json';
import { electionAddress } from '../Common';
import { handleRevert } from './Common';

declare let window: any;
export async function getVerification() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      electionAddress,
      Election.abi,
      provider
    );
    try {
      const results = await contract.getVerification();
      return results;
    } catch (err: unknown) {
      handleRevert(err);
    }
  }
}
