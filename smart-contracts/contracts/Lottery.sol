// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    enum LotteryState {
        OPEN,
        CALCULATING
    }

    address public manager;
    uint256 public entryFee;
    address[] public players;
    address public lastWinner;
    LotteryState private lotteryState;

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this");
        _;
    }

    constructor() {
        manager = msg.sender;
        entryFee = 1e14;
        lotteryState = LotteryState.OPEN;
    }

    function getPlayersCount() external view returns (uint256) {
        return players.length;
    }

    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function setEntryFee(uint256 value) external onlyManager {
        require(value >= 1e14, "Entry fee must be >= 0.0001 ETH");
        require(
            address(this).balance == 0,
            "Can't change fee with active funds"
        );
        entryFee = value;
    }

    function enter() external payable {
        require(lotteryState == LotteryState.OPEN, "Lottery not open");
        require(msg.value == entryFee, "Must send exact entry fee");
        players.push(msg.sender);
    }

    function pickWinner() external onlyManager {
        require(players.length > 0, "No players");
        require(address(this).balance > 0, "No funds");
        require(lotteryState == LotteryState.OPEN, "Already picking");

        lotteryState = LotteryState.CALCULATING;

        uint256 index = random() % players.length;
        address winner = players[index];
        lastWinner = winner;

        (bool sent, ) = winner.call{value: address(this).balance}("");
        require(sent, "Transfer failed");

        players = new address[](0);
        lotteryState = LotteryState.OPEN;
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.prevrandao, block.timestamp, players)
                )
            );
    }
}
