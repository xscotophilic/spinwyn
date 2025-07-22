import { writeContract } from "wagmi/actions";

import { config, publicClient } from "../wagmiConfig";
import { lotteryAddress } from "../addresses";
import { abi } from "../abi";

export async function pickWinner() {
  const tx = await writeContract(config, {
    abi: abi,
    address: lotteryAddress,
    functionName: "pickWinner",
  });

  await publicClient?.waitForTransactionReceipt({ hash: tx });

  return;
}
