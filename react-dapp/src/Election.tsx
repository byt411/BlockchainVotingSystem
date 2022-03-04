import * as paillierBigint from "paillier-bigint";
export const electionAddress = "0x5d37e251da0c4d09d4b0269c29206237d45db925";
export const pubKey = new paillierBigint.PublicKey(
  BigInt(
    "23887010820738940184376978775095137097407075755820241849675667344549655040826893898651499174154305754407685907017166822246885335055988915217054904210996835969645724149669253130435058417145607207943175901764713928131407873743249832381758479458745795300753271834595741442143133427988627165702813027003607579954439231340603435941053484359383805495562303162716634779567233298478083227766633641978636417664321938974764772327358877579601671564707952644543376217346716374851740059803819350790007564414568677497844187360531465492798178734397634076077444668757697506675393707023062527238109389708654148401762219555160774548261"
  ),
  BigInt(
    "256413518612717708049664067870925594641550071250071625287060836089692416568528025825412410801147857641991837786955674836923973686907060164732085720662768896755860922374846172347979357584824382289462469907936484184574966803427471853587992388905114285359068375355840312679127870566171000793861737151148554571614068510020858664008573645206926676985510626080584071420738457531585711136866623174118528469009468440242264356374476368846151195209308821320173898712817359997189170058306796734997185492475738496099572905056190067455093387942340288046014849539206911715512405664168429832706156571650272287156899993373538003669744795202091566589865247755309830947663330740140276224043543184018928825142049196133888293061547023765639645507623124793924387449001385090829372817390196001286353986944317051042333138269449600092111969090490179952370984031680469330654015656508615294505523462927201635098746347007130680094095456697894536445929502021199971739462868294210495933686880671423096223425413891687520018842031998031862687630142593103146958120870126308289498873560140599601570055038236435363818024643237190719131175280329516624327282147671283859820722342504692199062100425571469939667166099269902938816222438201814692189250474939602399841634709"
  )
);
export const privKey = new paillierBigint.PrivateKey(
  BigInt(
    "11943505410369470092188489387547568548703537877910120924837833672274827520413446949325749587077152877203842953508583411123442667527994457608527452105498417984822862074834626565217529208572803603971587950882356964065703936871624916190879239729372897650376635917297870721071566713994313582851406513501803789977055914076499314880967663467444229394028213237178082645200427922736154745897182534070649270745855704996855188617229412834329907926675085672545312080070704029285940715576973150844584709307031609522346515659840259850487726709265066880531343290829429354603805882236821035912497484733843209925158215522447573104406"
  ),
  BigInt(
    "11232158129145677952027409723455594322825342233710805911621416077040691879309915150285972781632382042589711163977991149587393810344865908631342620102194468289842065501717281930454194516747228172866605210224511650627832925985759301831484263271749676581304233094506237057799634478932513322164373272099144098911345299091773937305445200069395796335975936470017386758987541268352429005326709648634321680692954122194676859906277554287291784236933826525364463978262767324292556395660737386329095664587756063695420076015480121824724224590359934216638810255588531474435243756833181102854206584290274018523628784062615729489793"
  ),
  pubKey
);
export const maxVotes = 9;