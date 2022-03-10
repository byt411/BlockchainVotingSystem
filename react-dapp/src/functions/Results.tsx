import { ethers } from "ethers";
import { handleRevert } from "./Common";
import { electionAddress } from "../Election";
import Election from "../artifacts/contracts/Election.sol/Election.json";
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
