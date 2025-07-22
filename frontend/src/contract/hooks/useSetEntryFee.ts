import { writeContract } from "wagmi/actions";

import { config, publicClient } from "../wagmiConfig";
import { lotteryAddress } from "../addresses";
import { abi } from "../abi";

export async function setEntryFee(minEthReq: bigint) {
  const tx = await writeContract(config, {
    abi: abi,
    address: lotteryAddress,
    functionName: "setEntryFee",
    args: [minEthReq],
  });

  await publicClient?.waitForTransactionReceipt({ hash: tx });

  return;
}
