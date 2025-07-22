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

describe("Lottery – enter", () => {
  it("allows entry when sending exact entryFee", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.0001", "ether"),
    });
    const players = await lottery.methods.getPlayers().call();
    assert.strictEqual(players[0], accounts[1]);
  });

  it("should revert when sent Ether does not equal entry fee", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[2],
        value: web3.utils.toWei("0.0002", "ether"),
      });
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
      await lottery.methods.enter().send({
        from: accounts[3],
        value: web3.utils.toWei("0.0001", "ether"),
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
});
