import { useReadContract } from "wagmi";
import { abi } from "../abi";
import { lotteryAddress } from "../addresses";

export function useEntryFee() {
  return useReadContract({
    address: lotteryAddress,
    abi: abi,
    functionName: "entryFee",
  });
}
