import { createContext, useContext } from "react";
import { useAccount } from "wagmi";

type ContractContextType = {
  address: string | undefined;
};

const ContractContext = createContext<ContractContextType>({
  address: undefined,
});

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();

  return (
    <ContractContext.Provider value={{ address }}>
      {children}
    </ContractContext.Provider>
  );
}

export const useContract = () => useContext(ContractContext);
