# SpinWyn

SpinWyn is a provably-fair on-chain **lottery**. Anyone can enter by paying a small, fixed entry fee; at any time the contract manager can trigger winner selection, and one participant receives the entire pot automatically. All logic lives in the smart-contract, so the draw cannot be tampered with or faked.

## How It Works (Non-Technical)

1. **Set Entry Fee** – The contract manager defines the minimum ticket price (e.g., 0.0001 ETH).
2. **Enter Lottery** – Anyone can purchase exactly one ticket per transaction by sending the entry fee.
3. **View Pot & Players** – The contract publicly exposes the list of players and current pot size.
4. **Pick Winner** – When ready, the manager triggers pick winner. The contract calculates a random index and transfers the entire balance to that address.
5. **Start New Round** – The players array is cleared and the lottery re-opens automatically.
