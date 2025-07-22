import { parseEther } from "viem";
import { writeContract } from "wagmi/actions";
import { config, publicClient } from "../wagmiConfig";
import { lotteryAddress } from "../addresses";
import { abi } from "../abi";

export async function enterLottery(amountEth?: string) {
  const value = amountEth ? parseEther(amountEth) : undefined;

  const tx = await writeContract(config, {
    abi: abi,
    address: lotteryAddress,
    functionName: "enter",
    ...(value ? { value } : {}),
  });

  await publicClient?.waitForTransactionReceipt({ hash: tx });
}
