import './App.css';
import { Routes, Route } from 'react-router-dom';
import routes from './pages/index';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  useSigner,
} from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { useEffect } from 'react';
import { useStateContext } from './context/ContextProvider';

const { chains, provider } = configureChains(
  [chain.polygon, chain.polygonMumbai],
  [infuraProvider({ alchemyId: process.env.INFURA_ID }), publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: 'CaratXchange',
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  const { data: signer, isError, isLoading } = useSigner();
  const { setWeb3Signer } = useStateContext();

  useEffect(() => {
    if (!isError && !isLoading) {
      setWeb3Signer(signer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, isError, isLoading]);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Routes>
          {routes.map((data, index) => (
            <Route
              onUpdate={() => window.scrollTo(0, 0)}
              exact={true}
              path={data.path}
              element={data.component}
              key={index}
            />
          ))}
        </Routes>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
