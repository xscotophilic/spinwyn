import { createPublicClient, defineChain, type Chain } from "viem";
import * as allChains from "viem/chains";
import { createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors";

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 1);
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL ?? "";

if (!rpcUrl) {
  throw new Error("Missing NEXT_PUBLIC_RPC_URL in environment");
}

let selectedChain: Chain | undefined = (
  Object.values(allChains) as Chain[]
).find((c) => c.id === chainId);

if (!selectedChain) {
  selectedChain = defineChain({
    id: chainId,
    name: `Chain-${chainId}`,
    network: `net-${chainId}`,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [rpcUrl] } },
    testnet: chainId !== 1,
  });
}

const chains = [selectedChain] as const;

export const config = createConfig({
  chains,
  connectors: [metaMask()],
  transports: {
    [selectedChain.id]: http(rpcUrl),
  },
});

export const publicClient = createPublicClient({
  chain: selectedChain,
  transport: http(rpcUrl),
});
