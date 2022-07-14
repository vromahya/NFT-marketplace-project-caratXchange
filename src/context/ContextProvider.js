import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [web3Signer, setWeb3Signer] = useState();
  const [FirstLoad, setFirstLoad] = useState(true);
  return (
    <StateContext.Provider
      value={{
        web3Signer,
        setWeb3Signer,
        FirstLoad,
        setFirstLoad,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
