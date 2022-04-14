import * as paillierBigint from 'paillier-bigint';

export const deployerAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export let electionAddress: string = "";
export let electionTitle: string = "";
export function setElectionAddress(address: string) {
  electionAddress = address;
}
export function setElectionTitle(title: string) {
  electionTitle = title;
}
export let pubKey = new paillierBigint.PublicKey(
  BigInt(
    "25160611769890536150149208058983587828594280917424491046622213241988178677913752750016014070067137039996887727404721677629133959297465403590497257379688665956781309828518371983975670591219957504499225725629514544935412208470742080825378680762960960419020340129904459256650070189333911381598140583958384451950946496938566343324574235016084226677947607863716022038820863587177844635431983350189823752347907459224150714733821663324177079536839557438176858894369456570760940684544089150601696100773833913110441973359305381563335871034955298583915398301181123511290458897689108112156021144957165224683419166757052189868163"
  ),
  BigInt(
    "25160611769890536150149208058983587828594280917424491046622213241988178677913752750016014070067137039996887727404721677629133959297465403590497257379688665956781309828518371983975670591219957504499225725629514544935412208470742080825378680762960960419020340129904459256650070189333911381598140583958384451950946496938566343324574235016084226677947607863716022038820863587177844635431983350189823752347907459224150714733821663324177079536839557438176858894369456570760940684544089150601696100773833913110441973359305381563335871034955298583915398301181123511290458897689108112156021144957165224683419166757052189868164"
  )
);

export function setPubKey(n: string, g: string) {
  pubKey = new paillierBigint.PublicKey(BigInt(n), BigInt(g));
}
export const maxVotes = 9;
