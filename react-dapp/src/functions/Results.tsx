import { ethers } from 'ethers';

import Election from '../artifacts/contracts/Election.sol/Election.json';
import { electionAddress } from '../Common';
import { handleRevert } from './Common';

declare let window: any;
export async function getResults() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      electionAddress,
      Election.abi,
      provider
    );
    try {
      const results = await contract.getResults();

      return results;
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
      handleRevert(err);
    }
  }
}
