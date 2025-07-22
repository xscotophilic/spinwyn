const assert = require("assert");
const hre = require("hardhat");
const { Web3 } = require("web3");

const compiledLottery = require("../artifacts/Lottery.json");

let provider;
let web3;
let accounts;
let lottery;

beforeEach(async () => {
  provider = hre.network.provider;
  if (typeof provider.setMaxListeners === "function") {
    provider.setMaxListeners(0);
  }
  web3 = new Web3(provider);
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(compiledLottery.abi)
    .deploy({ data: compiledLottery.evm.bytecode.object })
    .send({ from: accounts[0], gas: "3000000" });
});

describe("Lottery – pickWinner", () => {
  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("sends funds to winner and resets players", async () => {
    for (const acc of accounts.slice(1, 4)) {
      await lottery.methods.enter().send({
        from: acc,
        value: web3.utils.toWei("0.0001", "ether"),
      });
    }

    await provider.send("hardhat_setBalance", [
      lottery.options.address,
      "0x1BC16D674EC80000",
    ]);

    const initialBalances = await Promise.all(
      accounts.slice(1, 4).map((a) => web3.eth.getBalance(a))
    );
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const winner = await lottery.methods.lastWinner().call();
    const finalBalance = await web3.eth.getBalance(winner);
    const idx = accounts.findIndex((a) => a === winner) - 1;
    const difference = BigInt(finalBalance) - BigInt(initialBalances[idx]);
    assert(difference >= BigInt(web3.utils.toWei("2", "ether")));
    const playersAfter = await lottery.methods.getPlayers().call();
    assert.strictEqual(playersAfter.length, 0);
  });

  it("should revert when there are no players", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[0] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("should revert when balance is zero but players exist", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.0001", "ether"),
    });
    await provider.send("hardhat_setBalance", [lottery.options.address, "0x0"]);
    try {
      await lottery.methods.pickWinner().send({ from: accounts[0] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("should revert when lottery state is CALCULATING", async () => {
    const slot = 4;
    await provider.send("hardhat_setStorageAt", [
      lottery.options.address,
      web3.utils.numberToHex(slot),
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    ]);
    await provider.send("hardhat_mine", ["0x1"]);
    try {
      await lottery.methods.pickWinner().send({ from: accounts[0] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
});
