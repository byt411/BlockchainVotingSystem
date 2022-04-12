import { ethers } from "ethers";

import Deployer from "../artifacts/contracts/Deployer.sol/Deployer.json";
import VoteOption from "../types/VoteOption";
import { handleRevert } from "./Common";

declare let window: any;

export async function deployElection(
  options: VoteOption[],
  endtime: string,
  title: string
) {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      Deployer.abi,
      signer
    );
    try {
      const transaction = await contract.deployElection(
        options,
        Number(endtime),
        "123",
        title,
        "123"
      );
      await transaction.wait();
    } catch (err: unknown) {
      handleRevert(err);
    }
  }
}
