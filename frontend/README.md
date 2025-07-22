# SpinWyn: Frontend DApp

This directory contains the web application that talks to the SpinWyn smart contract.

Features:

- View the current entry fee, total pot, etc.
- Enter the lottery with one click (wallet prompt)
- If you are the manager, adjust entry fee and pick the winner
- Watch realtime transaction status updates

---

## Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) (which includes `npm`) installed on your system.
- A modern web-browser with MetaMask (or any EIP-1193 wallet)

## Step 1 – Install Dependencies

First, navigate to the frontend directory and install the required Node.js packages by running:

```bash
npm install
```

## Step 2 – Configure Environment Variables

Copy the example file and fill in all values:

```bash
cp .env.example .env
```

Open the newly created .env file and fill in all of the variables shown below

```
NEXT_PUBLIC_CHAIN_ID=<your_chain_id>
NEXT_PUBLIC_RPC_URL=https://holesky.gateway.tenderly.co/<your_access_token>
NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS=<your_contract_address>
```

- **`NEXT_PUBLIC_CHAIN_ID`** – Numeric chain ID that corresponds to the RPC URL (e.g., `17000` for Holesky, `11155111` for Sepolia).
- **`NEXT_PUBLIC_RPC_URL`** – JSON-RPC endpoint for the same network where you deployed your contract (see the [contracts README](../contracts/README.md#step-2-configure-environment-variables) for endpoint options).
- **`NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS`** – Address of the deployed `Lottery` contract.

> **Security:** The `.env` file is excluded by `.gitignore` and should **never** be committed to version control.

> All three variables **must** point to the same network that your smart-contracts were deployed to in the `smart-contracts/` project.

## Step 3 – Run the Development Server

```bash
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) and connect your wallet.

## Step 4 – Run Tests (optional)

```bash
npm run test
```

Runs component and unit tests.

## Step 5 – Build for Production

```bash
npm run build
npm run start
```

## Deployment

The app is a standard **Next.js** project and can be deployed to any environment that supports Node.js.

1. Ensure you have set the same environment variables (`NEXT_PUBLIC_*`) on the hosting platform.
2. Build the project:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm run start
   ```
