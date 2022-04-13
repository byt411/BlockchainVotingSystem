//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;
import {VoteOption} from "./ElectionStructs.sol";

contract Election {
    string public title;
    address public creator;
    uint256 public endtime;
    bool public resultsPublished;
    bool public proofPublished;
    string encryptedTotal;
    string encodedTotal;

    string u;
    string a;
    string z;
    string public e;
    string negativeR;
    string public pubkeyN;
    string public pubkeyG;

    struct VoteResult {
        VoteOption option;
        uint32 count;
    }

    string[] public votes;
    mapping(address => uint256) voteMap;
    mapping(string => uint256) optionMap;
    VoteOption[10] public options;
    VoteResult[10] public results;

    constructor(
        VoteOption[] memory _options,
        uint256 _endtime,
        string memory _e,
        string memory _title,
        string memory _encryptedZero,
        string memory _pubkeyN,
        string memory _pubkeyG,
        address _creator
    ) {
        /* options[0] = VoteOption(
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
            "385022654119480293953703250755947873552098288436724940480982790373957428040919070955264274511609204042130050823321735732193545661655231007976296239423376741268484102689057570132162439180627237642469898058496264031739057635654204588713054044876757360592664320971398241663516728217855408346382318710852663288808036899604506994520751201024089948340852406779573397166906835864826853054767868267588141990686213491313193162915522227575743499832148070380520666883686090895114981319652479557983684626335960547008320866319873826702683285309268822120453874997206280374236463875487384919127698663604487686287649918157704473844555647501469257697241703695822899465420170328772042754502750848938226593183889118255352722826827418824172837672125754420020452094362127557530812048613744645181092548144509856351167101453734327721786766007975593931128104884445693729827106569310192745701503294438045323368652053178142286054156051420931474206283955894652332165156754962324585619084416004756318520463927789533395397552339854255104224303886704026556235245951441925951385604511900658999320834281249338578517187598237012724666539648888044265164362338538014064373407325653962813213857424266473216132879856469133651245023176083592097379103504281984068415573029"
        );
        endtime = block.timestamp + 180;
        creator = msg.sender;
        e = "1234"; */
        for (uint256 i = 0; i < _options.length; i++) {
            options[i] = VoteOption(
                _options[i].name,
                _options[i].acronym,
                _options[i].logourl,
                _options[i].power
            );
            results[i] = VoteResult(options[i], 0);
            optionMap[options[i].name] = i;
        }
        votes.push(_encryptedZero);
        endtime = _endtime;
        e = _e;
        title = _title;
        creator = msg.sender;
        proofPublished = false;
        resultsPublished = false;
        pubkeyN = _pubkeyN;
        pubkeyG = _pubkeyG;
        creator = _creator;
    }

    function publishResults(VoteResult[] memory submittedResults) public {
        require(
            msg.sender == creator,
            "You are not authorized to perform this action."
        );
        require(
            proofPublished,
            "The verification proof has not yet been published."
        );
        require(!resultsPublished, "The results have already been published.");
        for (uint256 i = 0; i < submittedResults.length; i++) {
            results[i].count = submittedResults[i].count;
        }
        resultsPublished = true;
    }

    function publishVerification(
        string memory calcEncryptedTotal,
        string memory calcEncodedTotal,
        string memory calcU,
        string memory calcA,
        string memory calcZ,
        string memory calcNegativeR
    ) public {
        require(
            msg.sender == creator,
            "You are not authorized to perform this action."
        );
        // require(block.timestamp > endtime, "Election is still in progress.");
        require(
            !proofPublished,
            "The verification proof has already been published."
        );
        encryptedTotal = calcEncryptedTotal;
        encodedTotal = calcEncodedTotal;
        u = calcU;
        a = calcA;
        z = calcZ;
        negativeR = calcNegativeR;
        proofPublished = true;
    }

    function getVerification()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (encryptedTotal, encodedTotal, u, a, z, e, negativeR);
    }

    function recordVote(string memory _vote) public {
        // require((block.timestamp < endtime) && !resultsPublished && !proofPublished, "Election has closed.");
        if (voteMap[msg.sender] == 0) {
            votes.push(_vote);
            voteMap[msg.sender] = votes.length - 1;
        } else {
            votes[voteMap[msg.sender]] = _vote;
        }
    }

    function getOptions() public view returns (VoteOption[10] memory) {
        return options;
    }

    function getResults() public view returns (VoteResult[10] memory) {
        return results;
    }

    function getVotes() public view returns (string[] memory) {
        return votes;
    }
}
