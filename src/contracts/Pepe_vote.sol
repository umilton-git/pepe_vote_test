pragma solidity ^0.6.12;
// SPDX-License-Identifier: Unlicensed

contract Story {

    // Structs

    struct Voter {
        bool voted;
        uint vote;
        bool whitelist;
    }

    struct Proposal {
        uint256 voteCount;
        uint256 nextMilestone; //When the vote wins, set next milestone
        string description;
        string name;
        uint256 proposalID;
    }

    struct milestoneProposals {
        uint256 milestoneID;
        Proposal proposal1;
        Proposal proposal2;
        Proposal proposal3;
    }

    struct Milestone {
    milestoneProposals proposals;
    uint256 ID;
    uint256 proposalID;
    string description;
    string name;
    string question;
    uint256 winningProposal;

    }


    // Variables

    address private Owner;
    mapping (address => Voter) public Voters;
    address[] public voterList;
    Milestone[] private milestones;
    uint256 public currentVotes = 0;
    uint256 public currentMilestone = 0;
    address[] public Whitelist;
    Proposal tempProposal = Proposal({voteCount: 0, nextMilestone: 0, description: "null", name: "null", proposalID: 0});


    // Events

    event Voted(
        address voter,
        uint256 proposal
        );

    event NewProposal(
        uint256 proposalID,
        uint256 nextMilestone,
        string description,
        string name
        );

    event NewMilestone(
        uint256 milestoneID,
        string description,
        string name,
        string question
        );

    event Win(
        uint256 newMilestone,
        uint256 proposalID
        );

    // Modifiers

    modifier OnlyOwner() {
        require(msg.sender == Owner, "Only the owner can do this.");
        _;
    }

    modifier OnlyWhitelist() {
        require(msg.sender == Owner || Voters[msg.sender].whitelist == true, "Only the contract deployer and whitelisted users can do this.");
        _;
    }

    constructor() public {
        Owner = msg.sender;
    }



    // Functions

    function createProposal(uint256 _milestone, uint256 _nextMilestone, string memory _message, string memory _name) public OnlyWhitelist {
        require(
            milestones[_milestone].proposalID < 3,
            "Milestone has 3 proposals already!"
            );
            if(milestones[_milestone].proposalID == 0){
            milestones[_milestone].proposals.proposal1 = Proposal({voteCount: 0, nextMilestone: _nextMilestone, description: _message, name: _name, proposalID: milestones[currentMilestone].proposalID});
            milestones[_milestone].proposalID += 1;}
            else if(milestones[_milestone].proposalID == 1){
            milestones[_milestone].proposals.proposal2 = Proposal({voteCount: 0, nextMilestone: _nextMilestone, description: _message, name: _name, proposalID: milestones[currentMilestone].proposalID});
            milestones[_milestone].proposalID += 1;}
            else if(milestones[_milestone].proposalID == 2){
            milestones[_milestone].proposals.proposal3 = Proposal({voteCount: 0, nextMilestone: _nextMilestone, description: _message, name: _name, proposalID: milestones[currentMilestone].proposalID});
            milestones[_milestone].proposalID += 1;}

            emit NewProposal(milestones[_milestone].proposalID - 1, _nextMilestone, _message, _name);
    }

    function createMilestone(uint256 _milestoneID, string memory _message, string memory _name, string memory _question) public OnlyWhitelist {
            milestones.push(Milestone({ID: _milestoneID, proposalID: 0, description: _message, name: _name, question: _question, winningProposal: 0, proposals: milestoneProposals({proposal1: tempProposal, proposal2: tempProposal, proposal3: tempProposal, milestoneID: _milestoneID})}));
            emit NewMilestone(_milestoneID, _message, _name, _question);
    }

    function whiteList(address _user) public OnlyOwner {
            Voters[_user].whitelist = true;
    }



    function vote(uint256 _proposalID) public {
        require(
        msg.sender.balance >= 1 ether,
        "Insufficient Voting Balance."
        );
        require(
        Voters[msg.sender].voted != true,
        "You have already voted!"
        );
        Voters[msg.sender].voted = true;
        voterList.push(msg.sender);
        if(_proposalID == 0){
        milestones[currentMilestone].proposals.proposal1.voteCount += 1;
        }
        if(_proposalID == 1){
        milestones[currentMilestone].proposals.proposal2.voteCount += 1;
        }
        if(_proposalID == 2){
        milestones[currentMilestone].proposals.proposal3.voteCount += 1;
        }
        currentVotes += 1;
        if (currentVotes == 1){
            declareWinner();
            currentVotes = 0;
        }

        emit Voted(msg.sender, _proposalID);
    }

    function declareWinner() private {
       uint256 currentWinner = milestones[currentMilestone].proposals.proposal1.nextMilestone;
       uint256 winningID = 0;
       if(milestones[currentMilestone].proposals.proposal1.voteCount > milestones[currentMilestone].proposals.proposal2.voteCount && milestones[currentMilestone].proposals.proposal1.voteCount > milestones[currentMilestone].proposals.proposal3.voteCount){
           currentWinner = milestones[currentMilestone].proposals.proposal1.nextMilestone;
           winningID = 0;
       }
       else if(milestones[currentMilestone].proposals.proposal2.voteCount > milestones[currentMilestone].proposals.proposal1.voteCount && milestones[currentMilestone].proposals.proposal2.voteCount > milestones[currentMilestone].proposals.proposal3.voteCount){
           currentWinner = milestones[currentMilestone].proposals.proposal2.nextMilestone;
           winningID = 1;
       }
       else if(milestones[currentMilestone].proposals.proposal3.voteCount > milestones[currentMilestone].proposals.proposal1.voteCount && milestones[currentMilestone].proposals.proposal3.voteCount > milestones[currentMilestone].proposals.proposal2.voteCount){
           currentWinner = milestones[currentMilestone].proposals.proposal3.nextMilestone;
           winningID = 2;
       }
      currentMilestone = currentWinner;
      for(uint256 i = 0; i < voterList.length; i++){
          Voters[voterList[i]].voted = false;
      }
      emit Win(currentMilestone, winningID);
    }


     function getProposalNextMilestone(uint256 proposalNum) public view returns (uint256) {
         require(
             proposalNum < 3,
             "Value does not exist"
             );
        if(proposalNum == 0){
            return milestones[currentMilestone].proposals.proposal1.nextMilestone;
        }
        else if(proposalNum == 1){
            return milestones[currentMilestone].proposals.proposal2.nextMilestone;
        }
         else if(proposalNum == 2){
            return milestones[currentMilestone].proposals.proposal3.nextMilestone;
        }
    }

    function getProposalDescription(uint256 proposalNum) public view returns (string memory) {
         require(
             proposalNum < 3,
             "Value does not exist"
             );
       if(proposalNum == 0){
            return milestones[currentMilestone].proposals.proposal1.description;
        }
        else if(proposalNum == 1){
            return milestones[currentMilestone].proposals.proposal2.description;
        }
         else if(proposalNum == 2){
            return milestones[currentMilestone].proposals.proposal3.description;
        }
    }

      function getProposalName(uint256 proposalNum) public view returns (string memory) {
         require(
             proposalNum < 3,
             "Value does not exist"
             );
       if(proposalNum == 0){
            return milestones[currentMilestone].proposals.proposal1.name;
        }
        else if(proposalNum == 1){
            return milestones[currentMilestone].proposals.proposal2.name;
        }
         else if(proposalNum == 2){
            return milestones[currentMilestone].proposals.proposal3.name;
        }
    }

        function getMilestoneDescription() public view returns (string memory) {
        return milestones[currentMilestone].description;
    }

        function getMilestoneQuestion() public view returns (string memory) {
        return milestones[currentMilestone].question;
    }

        function getMilestoneName() public view returns (string memory) {
        return milestones[currentMilestone].name;
    }
}
