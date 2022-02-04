pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract LotterySystem is VRFConsumerBase {
    address payable public lotteryowner;
    address[] public players;
    uint256 public expiry;
    uint256 public defaultExpiry;

    // VRF initialisations
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    // constructor(){
    //     // Set the executor as owner 
    //     lotteryowner = payable(msg.sender);

    //     // Set the lottery deadline of 1 hour
    //     expiry = block.timestamp + 1 hours;
    // }

    constructor() VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        ){

        // Set the executor as owner 
        lotteryowner = payable(msg.sender);

        // Set the lottery deadline of 1 hour
        expiry = block.timestamp + 1 hours;

        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    }
       
    receive() external payable{}

    modifier isPlayDuplicate(address _playeraddr) {
        bool isDuplicate = false;
        for(uint i =0; i < players.length; i++ )
        {
            if(players[i] == _playeraddr){
                isDuplicate = true;
            }
        }
        require(!isDuplicate,'Already a player');
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == lotteryowner,'Only owner can call this function');
        _;
    }

    function join(address _player) public payable isPlayDuplicate(_player){
        require(_player != lotteryowner,'Onwer cannot be player');
        require(block.timestamp < expiry,'Lottery join time has expired');
        require(msg.value == 0.3 ether,'You need to deposit 0.3 ether to join');
        players.push(_player);
    }

    function getOwnerBalance() external view returns(uint amt){
        return address(this).balance;
    }

    function getPlayersLength() external view returns(uint length){
        return players.length;
    }

    // chainlink VRF Functions

    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override{
         randomResult = randomness % players.length + 1;
    }

    // Pick winner 
    function pickWinner() public onlyOwner() returns (address winnerAddress){
        require(block.timestamp > expiry,'Cannot pick winner before lottery expires');
        require(players.length > 0,'No player has joined');
        getRandomNumber();
        return players[randomResult];
    }

}
