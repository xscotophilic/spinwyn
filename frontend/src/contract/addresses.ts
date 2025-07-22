const rawLotteryAddress = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS;

export const lotteryAddress = rawLotteryAddress
  ? ((rawLotteryAddress.startsWith("0x") ? rawLotteryAddress : `0x${rawLotteryAddress}`) as `0x${string}`)
  : ("0x0000000000000000000000000000000000000000" as const);
