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

describe("Lottery – Deployment", () => {
  it("should deploy successfully and set manager", async () => {
    assert.ok(lottery.options.address);
    const manager = await lottery.methods.manager().call();
    assert.strictEqual(manager, accounts[0]);
  });
});
