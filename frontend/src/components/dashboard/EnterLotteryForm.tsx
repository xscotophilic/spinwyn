import { useEffect, useState } from "react";
import { friendlyError } from "@/lib/friendlyError";
import { enterLottery } from "@/contract/hooks/useEnterLottery";

import { useContract } from "../shared/ContractContext";
import { TransactionStatus } from "../shared/TransactionStatus";
import { zeroAddress } from "@/lib/utils";

interface EnterLotteryFormProps {
  isLoading: boolean;
  minEthReq: string;
  onSuccess?: () => void;
}

export function EnterLotteryForm({
  isLoading,
  minEthReq,
  onSuccess,
}: EnterLotteryFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessing(true);
    setTxError(null);

    try {
      await enterLottery(minEthReq);
      onSuccess?.();
    } catch (error) {
      setTxError(friendlyError(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  const { address } = useContract();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
      onSubmit={handleSubmit}
    >
      <h2 className="sm:col-span-10 text-xl font-semibold text-gray-800">
        Enter Lottery
      </h2>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isLoading || isProcessing || !address}
          className={`w-full rounded-md p-2 text-white transition ${
            isLoading || isProcessing || !address
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Enter
        </button>
      </div>
      {(mounted && (!address || address === zeroAddress)) && (
        <p className="sm:col-span-12 text-sm text-gray-600">
          Please connect your wallet to enter the lottery.
        </p>
      )}
      <TransactionStatus
        isProcessing={isProcessing}
        error={txError}
        className="sm:col-span-12"
      />
    </form>
  );
}
