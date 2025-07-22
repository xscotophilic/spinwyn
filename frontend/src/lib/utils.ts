import { formatUnits } from "viem";

export const zeroAddress = "0x0000000000000000000000000000000000000000";

export function weiToEth(wei: bigint | string | number, decimals = 4): string {
  try {
    const eth = formatUnits(BigInt(wei), 18);
    const num = parseFloat(eth);
    return num.toFixed(decimals).replace(/\.?0+$/, "");
  } catch {
    return "-";
  }
}