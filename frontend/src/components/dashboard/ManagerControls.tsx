import { useState } from "react";
import { parseEther } from "viem";

import { pickWinner } from "@/contract/hooks/usePickWinner";
import { setEntryFee } from "@/contract/hooks/useSetEntryFee";
import { friendlyError } from "@/lib/friendlyError";
import { useContract } from "../shared/ContractContext";
import { TransactionStatus } from "../shared/TransactionStatus";

interface ManagerControlsProps {
  isLoading: boolean;
  manager: string;
  balance: bigint;
  onPickWinnerSuccess?: () => void;
  onSetMinEthReqSuccess?: () => void;
}

export function ManagerControls({
  isLoading,
  manager,
  balance,
  onPickWinnerSuccess,
  onSetMinEthReqSuccess,
}: ManagerControlsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [minEthReq, setMinEthReq] = useState<string>("");

  const { address } = useContract();
  const isManager = manager === address;
  if (!isManager) {
    return null;
  }

  const handlePickWinner = async () => {
    setIsProcessing(true);
    setTxError(null);

    try {
      if(balance === BigInt(0)) {
        setTxError("Contract balance must be greater than zero");
        return;
      }

      await pickWinner();
      onPickWinnerSuccess?.();
    } catch (error) {
      setTxError(friendlyError(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetMinEthReq = async () => {
    setIsProcessing(true);
    setTxError(null);

    try {
      if (!minEthReq) {
        setTxError("Threshold cannot be empty");
        return;
      }

      if(balance > 0) {
        setTxError("Contract balance must be zero");
        return;
      }

      const minEthReqWei = parseEther(minEthReq);
      await setEntryFee(minEthReqWei);

      setMinEthReq("");
      onSetMinEthReqSuccess?.();
    } catch (error) {
      setTxError(friendlyError(error));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-6 p-4 mt-4">
        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">Pick Winner</h2>
          <button
            type="button"
            disabled={isLoading || isProcessing}
            className={`w-full rounded-md p-2 text-white transition ${
              isLoading || isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            onClick={handlePickWinner}
          >
            Pick
          </button>
        </div>

        <div className="hidden sm:flex justify-center items-stretch">
          <div className="w-px bg-gray-300 h-full" />
        </div>

        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Set Entry Threshold
          </h2>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter threshold"
              className="flex-1 rounded-md p-2 border border-gray-300"
              value={minEthReq}
              onChange={(e) => setMinEthReq(e.target.value)}
            />
            <button
              type="button"
              disabled={isLoading || isProcessing}
              className={`rounded-md p-2 text-white transition min-w-[80px] ${
                isLoading || isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={handleSetMinEthReq}
            >
              Set
            </button>
          </div>
        </div>
      </div>
      <TransactionStatus
        className="pl-4 pr-4 pb-4"
        isProcessing={isProcessing}
        error={txError}
      />
    </div>
  );
}
