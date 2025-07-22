# SpinWyn: Smart Contracts

This project contains the Solidity contract that powers SpinWyn’s on-chain lottery.

## Prerequisites

- [Node.js](https://nodejs.org/) (includes `npm`)

## Step 1 – Install Dependencies

From the `smart-contracts` directory:

```bash
npm install
```

## Step 2 – Configure Environment Variables

Create a `.env` file (or copy the sample):

```bash
cp .env.example .env
```

Set the following variables:

```
PRIVATE_KEY="your_private_key"
```

- **`PRIVATE_KEY`**: This is the private key of an Ethereum account. For development, you should use a dedicated private key for a testnet account, not your personal wallet.
  - **Source:** You can get your private key from MetaMask or any Ethereum wallet.
  - **Note:** The account associated with your `PRIVATE_KEY` must have a balance of testnet ETH to pay for transaction fees (gas).
  - **Security:** Never share your private key with anyone and never commit it to version control

```
RPC_URL="your_rpc_url"
```

- **`RPC_URL`**: This is the URL of an Ethereum JSON-RPC provider that your application will use to interact with the blockchain.
  - **Note:** Below are two commonly used options for the RPC_URL value. You can also use any other Ethereum JSON-RPC provider of your choice.

**Option A: Using Tenderly Holesky Gateway**

```
RPC_URL="https://holesky.gateway.tenderly.co/<your_access_token>"
```

- **Note:** To use this option, you need to:
  1. Sign up for a Tenderly account at [tenderly.co](https://tenderly.co)
  2. Create a new project
  3. Get your access token from your Tenderly dashboard
  4. Replace `<your_access_token>` with your actual token
- You can get free testnet ETH from:
  - [Google Cloud Web3 Faucet](https://cloud.google.com/application/web3/faucet)

**Option B: Using Sepolia Testnet**

```
RPC_URL="https://sepolia.infura.io/v3/<your_project_id>"
```

- **Note:** To use this option, you need to:
  1. Sign up for an Infura account at [infura.io](https://infura.io)
  2. Create a new project
  3. Copy your Project ID from the project settings
  4. Replace `<your_project_id>` with your actual Infura Project ID
- You can get free testnet ETH from:
  - [Google Cloud Web3 Faucet](https://cloud.google.com/application/web3/faucet)
  - [Sepolia Faucet](https://sepolia-faucet.pk910.de/)

**Security Note:** The `.env` file should **never** be committed to version control. The provided `.gitignore` file already excludes it.

## Step 3 – Compile

Compile the smart contracts to generate the deployment artifacts (ABI & bytecode) into `artifacts/`:

```bash
npm run compile
```

## Step 4 – Run Tests

Before deploying, verify that everything is working correctly by running the test suite:

```bash
npm run test
```

A successful run will show a series of passing tests, confirming the contract logic is sound.

## Step 5 – Deploy to a Testnet

Deploy the smart contracts to the network specified in `.env`:

```bash
npm run deploy
```

This command compiles the contract and broadcasts a transaction to the selected network. When it finishes, it prints the **Lottery** contract address—copy this value for the steps below.

## Interacting with Lottery

A convenience script (`scripts/interact.js`) lets you call common functions without writing custom code.

### Command Structure

```bash
npm run interact -- <lotteryAddress> <action> [arguments]
```

- `<lotteryAddress>` – Deployed `Lottery` contract (e.g., `0xAbC...1234`).
- `<action>` – One of the supported commands listed below.
- `[arguments]` – Optional parameters for the action.

### Available Actions

| Action        | Arguments    | Description                                               |
| ------------- | ------------ | --------------------------------------------------------- |
| `set-min`     | `<minEther>` | Manager-only. Update the entry fee (must be >= 0.0001).   |
| `balance`     | –            | Show current contract balance in ETH.                     |
| `players`     | –            | List all current player addresses.                        |
| `enter`       | –            | Enter the lottery by sending exactly the entry fee.       |
| `pick`        | –            | Manager-only. Choose a random winner and pay out the pot. |
| `last-winner` | –            | Display the last winner address.                          |

### Example Workflow

1. **Check balance & players**
   ```bash
   npm run interact -- 0xAbC... balance
   npm run interact -- 0xAbC... players
   ```
2. **Manager sets a new minimum** (optional)
   ```bash
   npm run interact -- 0xAbC... set-min 0.0002
   ```
3. **Enter the lottery**
   ```bash
   npm run interact -- 0xAbC... enter
   ```
4. **Pick the winner**
   ```bash
   npm run interact -- 0xAbC... pick
   ```

> Remember to switch the `PRIVATE_KEY` in `.env` when acting as different accounts (manager vs participants).

## TODO

- Gas-optimised implementation using `struct` packing.
- Timelock governance for large transactions.
- Upgradeability via `TransparentUpgradeableProxy`.
