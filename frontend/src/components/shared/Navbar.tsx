"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

import { useContract } from "./ContractContext";

function truncateAddress(addr: string) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

export default function Navbar() {
  const [hydrated, setHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const chainId = useChainId();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const { address } = useContract();

  const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 1);
  const wrongNetwork = chainId !== undefined && chainId !== targetChainId;

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => setHydrated(true), []);

  const ChainStatus = chainId && (
    <span className="rounded-md bg-gray-200 px-4 py-1.5 text-sm text-gray-600 text-center">
      {wrongNetwork ? "Wrong network" : `Chain ${chainId}`}
    </span>
  );

  const WalletButton = (
    <button
      onClick={
        isConnected
          ? () => disconnect()
          : () => connect({ connector: metaMask() })
      }
      className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm text-white hover:bg-indigo-700"
    >
      {isConnected ? truncateAddress(address ?? "") : "Connect Wallet"}
    </button>
  );

  const ToggleButton = (
    <button
      className="sm:hidden text-2xl font-semibold"
      onClick={toggleMenu}
      aria-label="Toggle menu"
    >
      {menuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">
          SpinWyn
        </Link>

        <div className="hidden sm:flex items-center gap-2">
          {hydrated && ChainStatus}
          {hydrated && WalletButton}
        </div>

        {ToggleButton}
      </div>

      {menuOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="flex flex-col gap-2">
            {hydrated && ChainStatus}
            {hydrated && WalletButton}
          </div>
        </div>
      )}
    </header>
  );
}
