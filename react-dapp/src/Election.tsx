import * as paillierBigint from "paillier-bigint";
export const electionAddress = "0xd77c0579f91f2a2d7455e2b3724545e5e4babba1";
export const pubKey = new paillierBigint.PublicKey(
  BigInt(
    "25160611769890536150149208058983587828594280917424491046622213241988178677913752750016014070067137039996887727404721677629133959297465403590497257379688665956781309828518371983975670591219957504499225725629514544935412208470742080825378680762960960419020340129904459256650070189333911381598140583958384451950946496938566343324574235016084226677947607863716022038820863587177844635431983350189823752347907459224150714733821663324177079536839557438176858894369456570760940684544089150601696100773833913110441973359305381563335871034955298583915398301181123511290458897689108112156021144957165224683419166757052189868163"
  ),
  BigInt(
    "25160611769890536150149208058983587828594280917424491046622213241988178677913752750016014070067137039996887727404721677629133959297465403590497257379688665956781309828518371983975670591219957504499225725629514544935412208470742080825378680762960960419020340129904459256650070189333911381598140583958384451950946496938566343324574235016084226677947607863716022038820863587177844635431983350189823752347907459224150714733821663324177079536839557438176858894369456570760940684544089150601696100773833913110441973359305381563335871034955298583915398301181123511290458897689108112156021144957165224683419166757052189868164"
  )
);
export const privKey = new paillierBigint.PrivateKey(
  BigInt(
    "25160611769890536150149208058983587828594280917424491046622213241988178677913752750016014070067137039996887727404721677629133959297465403590497257379688665956781309828518371983975670591219957504499225725629514544935412208470742080825378680762960960419020340129904459256650070189333911381598140583958384451950608525241825527291129261539377822435322985519202528923090064672979219562417873565700634228584511484177139535793062780468275957381174017016439199177877440750373019845081718494570513235050981220515920225516246597138613470909280560828140631327890881451019602434448332564999165748055436386062677215597080209030920"
  ),
  BigInt(
    "4813209844548769260358174113806098762637840830399298173775494711679548757676766434435463524918788314538722296293074157059172323938909939975041583040714710255133192062589544424053304761806157573638660410891201943272546854570640188901350743406748269730700935868691829259560416434304915989750622992165183122473831840900861404554829614486805797841492827145568150405998134235299060697770534809358304688838718588126292388667175386317186301479076250680323001685691851003268944179066379020877081563599148562497689445167318214659654549990425277201336339917650469553405451438030830833002578668642338478406402447509575572661862"
  ),
  pubKey,
  BigInt(
    "227257669858808339514983816728589207553408476626570685892608564688467122835447293051382286764647108981351216910827491281987779932861639493898015750895200972517097100591959087274405505960648819581792548024389982093715674924094349971690213378445052459553184539940702376439122177721179628495884791523585849655933"
  ),
  BigInt(
    "110714026882007693929989659977815035071213867886922429838190349510157950178662491437807236998748866065659962029931391573913342222803900927839643965596814847870823738870411568756777359762203873012729199818668802331006725201580387784084553594845189600717671923300073170717733219180549210124857159636386131181311"
  )
);
export const maxVotes = 9;
