"use client";

import React from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContractProvider } from "@/components/shared/ContractContext";
import { config as wagmiConfig } from "@/contract/wagmiConfig";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
  configOverride?: typeof wagmiConfig;
}

export default function Providers({
  children,
  configOverride,
}: ProvidersProps) {
  return (
    <WagmiProvider config={configOverride ?? wagmiConfig} reconnectOnMount>
      <QueryClientProvider client={queryClient}>
        <ContractProvider>{children}</ContractProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
