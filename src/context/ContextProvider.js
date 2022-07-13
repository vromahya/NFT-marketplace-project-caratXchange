import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [web3Signer, setWeb3Signer] = useState();

  return (
    <StateContext.Provider
      value={{
        web3Signer,
        setWeb3Signer,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
