import { useReadContract } from 'wagmi';
import { abi } from '../abi';
import { lotteryAddress } from '../addresses';

export function useLastWinner() {
  return useReadContract({
    abi: abi,
    address: lotteryAddress,
    functionName: 'lastWinner',
  });
}
