import React, { createContext, useContext, ReactNode } from 'react';

interface SellerContextType {
  sellerId: string | null;
}

const SellerContext = createContext<SellerContextType>({ sellerId: null });

export const useSeller = () => useContext(SellerContext);

interface SellerProviderProps {
  children: ReactNode;
  sellerId: string;
}

export const SellerProvider: React.FC<SellerProviderProps> = ({ children, sellerId }) => {
  return (
    <SellerContext.Provider value={{ sellerId }}>
      {children}
    </SellerContext.Provider>
  );
};