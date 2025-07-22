"use client";

import { useContract } from "../shared/ContractContext";
import { ShimmerOverlay } from "../shared/Shimmer";

type AddressSummaryProps = {
  lastWinner: string;
  manager: string;
  isLoading: boolean;
};

export function AddressSummary({
  lastWinner,
  manager,
  isLoading,
}: AddressSummaryProps) {
  const { address } = useContract();
  const isManager = manager === address;

  return (
    <div className="relative sm:col-span-6 bg-gray-50 rounded-md p-4 flex flex-col justify-between">
      <ShimmerOverlay show={isLoading} />
      <div className="mb-4">
        <span className="text-sm text-gray-500">Last Winner</span>
        <p className="font-mono text-gray-800 text-sm break-all">
          {lastWinner}
        </p>
      </div>
      <div>
        <span className="text-sm text-gray-500">
          {isManager ? "🛠️ Deployed & managed by you" : "Manager"}
        </span>
        <p className="font-mono text-gray-800 text-sm break-all">{manager}</p>
      </div>
    </div>
  );
}
