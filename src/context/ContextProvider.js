import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
  login: false,
};

export const ContextProvider = ({ children }) => {
  const [web3Signer, setWeb3Signer] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <StateContext.Provider
      value={{
        web3Signer,
        setWeb3Signer,
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
