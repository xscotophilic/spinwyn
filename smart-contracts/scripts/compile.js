const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const artifactsPath = path.resolve(__dirname, "..", "artifacts");
fs.ensureDirSync(artifactsPath);

const lotteryPath = path.resolve(__dirname, "..", "contracts", "Lottery.sol");
const lotterySource = fs.readFileSync(lotteryPath, "UTF-8");

const input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": {
      content: lotterySource,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

let output;
try {
  output = JSON.parse(solc.compile(JSON.stringify(input)));
} catch (err) {
  console.error("Compilation failed to run:", err);
  process.exit(1);
}


if (output.errors && output.errors.some((err) => err.severity === "error")) {
  console.error("Compiled with the following errors:\n");
  output.errors.forEach((err) => console.error(err.formattedMessage));
  process.exit(1);
} else {
  try {
    for (const sourceName in output.contracts) {
      console.log("Source name:", sourceName, "\n");
      for (const contractName in output.contracts[sourceName]) {
        const outputPath = path.resolve(artifactsPath, contractName + ".json");
        fs.outputJsonSync(outputPath, output.contracts[sourceName][contractName]);
      }
    }
    console.log("Compilation successful!", "\n");
  } catch (err) {
    console.error("Error writing compiled contract:", err, "\n");
    process.exit(1);
  }
}
