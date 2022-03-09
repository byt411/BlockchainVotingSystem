//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

contract Election {
    address creator;
    uint256 endtime;

    string encryptedTotal;
    string encodedTotal;
    string encryptedNegativeTotal;
    string randomPrime;
    string encryptedZero;

    struct VoteOption {
        string name;
        string acronym;
        string logourl;
        uint16 power;
    }

    struct VoteResult {
        VoteOption option;
        uint32 count;
    }

    string[] votes;
    address[] voters;
    mapping(address => uint256) voteMap;
    mapping(string => uint256) optionMap;
    VoteOption[4] options;
    VoteResult[4] results;

    constructor() {
        options[0] = VoteOption(
            "Partido Popular",
            "PP",
            "https://upload.wikimedia.org/wikipedia/commons/3/38/PP_icono_2019.svg",
            0
        );
        options[1] = VoteOption(
            "Partido Socialista Obrero Espanol",
            "PSOE",
            "https://upload.wikimedia.org/wikipedia/commons/4/41/Logotipo_del_PSOE.svg",
            1
        );
        options[2] = VoteOption(
            "Unidas Podemos",
            "UP",
            "https://upload.wikimedia.org/wikipedia/commons/7/7d/Logo_Unidas_Podemos_2019b.png",
            2
        );
        options[3] = VoteOption(
            "Ciudadanos",
            "Cs",
            "https://upload.wikimedia.org/wikipedia/commons/7/76/Logo_oficial_Ciudadanos.svg",
            3
        );
        for (uint256 i = 0; i < results.length; i++) {
            results[i] = VoteResult(options[i], 0);
            optionMap[options[i].name] = i;
        }
        votes.push(
            "185256432340099500352033148713155027221627463789452885620061689158826305307784303286988719736079812527512658842120519940475892009979127494440640915762756710804446612622319177322741215383832272117439462468768526052022108852853886555445512299704498965067656244918112433280999540856408703823998043704081924667577033317548316611377326056748853106619200446373484994946692751523165198372388686151197491198646722076135350130286138170479237325973572598138473250885956045459833805231736951229300325061703076376536125084720451382595629661502655440057522877199775516974798936828941951888583696760753550330759494513594680243558574036380143632708799730114171643056746737368546270865079098756224250274028368104625862863350941069452618894510361194417473913877610555849345586509154226574211695278069986803044575318031245250580254759615869196612433187314298137974138064389309734861250214525193738714707447318908939314711584989437297431592974785562157648182189209110393367445890956365302579061733389742948681700736297587753043804669303765477641400321703965898910680844062954368684813368499595687609788897361898848511635294481060968056016597665400047444410419092853186657902021613306323584277364316129573295411778099951599971003832949258421142431772737"
        );
        endtime = block.timestamp + 180;
        creator = msg.sender;
    }

    function getOptions() public view returns (VoteOption[4] memory) {
        return options;
    }

    function getCreator() public view returns (address) {
        return creator;
    }

    function getEndTime() public view returns (uint256) {
        return endtime;
    }

    function publishResults(VoteResult[] memory submittedResults) public {
        require(
            msg.sender == creator,
            "You are not authorized to perform this action."
        );
        require(block.timestamp > endtime, "Election is still in progress.");
        for (uint256 i = 0; i < results.length; i++) {
            results[i].count = submittedResults[i].count;
        }
    }

    function publishVerification(
        string memory calcEncryptedTotal,
        string memory calcEncodedTotal,
        string memory calcEncryptedNegativeTotal,
        string memory calcRandomPrime,
        string memory calcEncryptedZero
    ) public {
        require(
            msg.sender == creator,
            "You are not authorized to perform this action."
        );
        require(block.timestamp > endtime, "Election is still in progress.");
        encryptedTotal = calcEncryptedTotal;
        encodedTotal = calcEncodedTotal;
        encryptedNegativeTotal = calcEncryptedNegativeTotal;
        randomPrime = calcRandomPrime;
        encryptedZero = calcEncryptedZero;
    }

    function getVerification()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (
            encryptedTotal,
            encodedTotal,
            encryptedNegativeTotal,
            randomPrime,
            encryptedZero
        );
    }

    function getVotes() public view returns (string[] memory) {
        return votes;
    }

    function getResults() public view returns (VoteResult[4] memory) {
        return results;
    }

    function recordVote(string memory _vote) public {
        // require(block.timestamp < endtime, "Election has closed.");
        if (voteMap[msg.sender] == 0) {
            votes.push(_vote);
            voteMap[msg.sender] = votes.length - 1;
        } else {
            votes[voteMap[msg.sender]] = _vote;
        }
    }
}
