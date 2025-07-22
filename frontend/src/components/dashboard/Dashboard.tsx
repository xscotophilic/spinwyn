"use client";

import { useGetBalance } from "@/contract/hooks/useGetBalance";
import { useLastWinner } from "@/contract/hooks/useLastWinner";
import { useEntryFee } from "@/contract/hooks/useEntryFee";
import { useManager } from "@/contract/hooks/useManager";
import { weiToEth, zeroAddress } from "@/lib/utils";

import { AddressSummary } from "./AddressSummary";
import { StatBox } from "./StatBox";
import { EnterLotteryForm } from "./EnterLotteryForm";
import { ManagerControls } from "./ManagerControls";

export default function Dashboard() {
  const {
    data: balance,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useGetBalance();

  const {
    data: entryFee,
    isLoading: entryFeeLoading,
    error: entryFeeError,
    refetch: refetchEntryFee,
  } = useEntryFee();

  const {
    data: lastWinner,
    isLoading: lastWinnerLoading,
    error: lastWinnerError,
    refetch: refetchLastWinner,
  } = useLastWinner();

  const {
    data: manager,
    isLoading: managerLoading,
    error: managerError,
  } = useManager();

  const isLoading =
    balanceLoading || entryFeeLoading || lastWinnerLoading || managerLoading;
  const hasError =
    balanceError || entryFeeError || lastWinnerError || managerError;

  if (hasError) {
    return (
      <section className="w-full flex items-center justify-center text-sm text-gray-600 p-4 rounded-md">
        <span>😬 Yikes! Something went sideways.</span>
      </section>
    );
  }

  return (
    <div className="w-full">
      <section className="bg-white shadow-sm rounded-md p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🎲 Lottery Summary
        </h2>

        {!hasError && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <StatBox
              label="Contract Balance"
              value={weiToEth(balance || 0)}
              isLoading={balanceLoading}
            />
            <StatBox
              label="Entry Threshold"
              value={weiToEth(entryFee || 0)}
              isLoading={entryFeeLoading}
            />
            <AddressSummary
              lastWinner={lastWinner || zeroAddress}
              manager={manager || zeroAddress}
              isLoading={lastWinnerLoading || managerLoading}
            />
          </div>
        )}
      </section>
      <section className="bg-white shadow-sm rounded-md p-4 mt-4">
        <EnterLotteryForm
          isLoading={isLoading}
          minEthReq={weiToEth(entryFee || 0)}
          onSuccess={refetchBalance}
        />
      </section>

      <section className="bg-white shadow-sm rounded-md">
        <ManagerControls
          isLoading={isLoading}
          manager={manager || zeroAddress}
          balance={BigInt(balance || 0)}
          onSetMinEthReqSuccess={refetchEntryFee}
          onPickWinnerSuccess={() => {
            refetchBalance();
            refetchLastWinner();
          }}
        />
      </section>
    </div>
  );
}
