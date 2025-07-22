export function friendlyError(error: unknown): string {
  const err = error as { shortMessage?: string; message?: string };
  const msg = err?.shortMessage ?? err?.message ?? "";

  if (/insufficient funds/i.test(msg)) {
    return "Insufficient funds for transaction";
  }

  if (/denied|rejected|cancel/i.test(msg)) {
    return "Transaction was rejected by the user";
  }

  if (/execution reverted/i.test(msg)) {
    return "Transaction failed - please check your inputs and try again";
  }

  if (/network error|connection|timeout/i.test(msg)) {
    return "Network connection error - please try again";
  }

  if (/gas/i.test(msg) && /estimate/i.test(msg)) {
    return "Unable to estimate gas - transaction may fail";
  }

  if (/nonce/i.test(msg)) {
    return "Transaction nonce error - please try again";
  }

  return "Something went wrong";
}
