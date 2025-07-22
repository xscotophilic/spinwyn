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

describe("Lottery – setEntryFee", () => {
  it("allows manager to update minimum", async () => {
    await lottery.methods.setEntryFee(web3.utils.toWei("0.05", "ether")).send({
      from: accounts[0],
    });
    const min = await lottery.methods.entryFee().call();
    assert.strictEqual(min.toString(), web3.utils.toWei("0.05", "ether"));
  });

  it("should revert when caller is not the manager", async () => {
    try {
      await lottery.methods.setEntryFee(10).send({ from: accounts[1] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("should revert when entry fee is below 0.0001 ETH", async () => {
    try {
      await lottery.methods
        .setEntryFee(web3.utils.toWei("0.00009", "ether"))
        .send({ from: accounts[0] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("should revert when contract holds active funds", async () => {
    // fund contract first
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.0001", "ether"),
    });
    try {
      await lottery.methods
        .setEntryFee(web3.utils.toWei("0.0002", "ether"))
        .send({ from: accounts[0] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
});
