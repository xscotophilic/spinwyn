"use client";

import { ShimmerOverlay } from "../shared/Shimmer";

type StatBoxProps = {
  label: string;
  value: string;
  isLoading: boolean;
};

export function StatBox({ label, value, isLoading }: StatBoxProps) {
  return (
    <div className="relative sm:col-span-3 bg-gray-50 rounded-md p-4 flex flex-col justify-between">
      <ShimmerOverlay show={isLoading} />
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="text-3xl font-mono font-semibold text-gray-900">
          {value}
        </span>
        <span className="text-sm font-semibold text-gray-500">ETH</span>
      </div>
    </div>
  );
}
