const { Web3 } = require("web3");
const dotenv = require("dotenv");
const path = require("path");
const compiledLottery = require("../artifacts/Lottery.json");

dotenv.config();

const lotteryActions = [
  "set-min",
  "balance",
  "players",
  "enter",
  "pick",
  "last-winner",
];

function printUsageAndExit() {
  console.error(`
Usage:

  Interact with deployed Lottery contract

    <lotteryAddress> set-min <minEther>
    <lotteryAddress> balance
    <lotteryAddress> players
    <lotteryAddress> enter <valueEther>
    <lotteryAddress> pick
    <lotteryAddress> last-winner
  `);
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) printUsageAndExit();

  const [address, action, ...params] = args;

  if (!lotteryActions.includes(action)) {
    console.error(`Unknown action: ${action}`);
    printUsageAndExit();
  }

  const { PRIVATE_KEY, RPC_URL } = process.env;
  if (!PRIVATE_KEY || !RPC_URL) {
    console.error("Error: PRIVATE_KEY and RPC_URL must be set in .env");
    process.exit(1);
  }

  const web3 = new Web3(RPC_URL);
  const privateKey = PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : "0x" + PRIVATE_KEY;
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
  const from = account.address;
  console.log(`\nUsing account ${from}`);

  const lottery = new web3.eth.Contract(compiledLottery.abi, address);

  switch (action) {
    case "set-min":
      await setMin(web3, lottery, params, from);
      break;
    case "balance":
      await showBalance(web3, lottery);
      break;
    case "players":
      await listPlayers(lottery);
      break;
    case "enter":
      await enterLottery(web3, lottery, from);
      break;
    case "pick":
      await pickWinner(lottery, from);
      break;
    case "last-winner":
      await showLastWinner(lottery);
      break;
    default:
      printUsageAndExit();
  }
}

async function setMin(web3, lottery, [minEther], from) {
  if (!minEther) throw new Error("set-min requires <minEther>");
  const minWei = web3.utils.toWei(minEther, "ether");
  console.log(`\nSetting minimum entry to ${minEther} ETH...`);
  await lottery.methods.setEntryFee(minWei).send({ from });
  console.log("\nMinimum set.");
}

async function showBalance(web3, lottery) {
  const balWei = await lottery.methods.getBalance().call();
  console.log(`\nContract balance: ${web3.utils.fromWei(balWei, "ether")} ETH`);
}

async function listPlayers(lottery) {
  const players = await lottery.methods.getPlayers().call();
  console.log("\nCurrent Players:");
  players.forEach((p, i) => console.log(`${i}: ${p}`));
}

async function enterLottery(web3, lottery, from) {
  const entryFeeWei = await lottery.methods.entryFee().call();
  const entryFee = web3.utils.fromWei(entryFeeWei, "ether");
  console.log(`\nEntering lottery with ${entryFee} ETH...`);
  await lottery.methods.enter().send({ from, value: entryFeeWei });
  console.log("\nEntered successfully.");
}

async function pickWinner(lottery, from) {
  console.log("\nPicking winner...");
  await lottery.methods.pickWinner().send({ from });
  console.log("\nWinner picked.");
}

async function showLastWinner(lottery) {
  const w = await lottery.methods.lastWinner().call();
  console.log(`\nLast Winner: ${w}`);
}

if (require.main === module) {
  main().catch((err) => console.error("\nError:", err.message));
}
