import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectWalletBtn } from './ConnectWalletBtn';
const { chains, provider } = configureChains(
  [chain.polygon, chain.polygonMumbai],
  [infuraProvider({ alchemyId: process.env.INFURA_ID }), publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const ConnectWallet = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ConnectWalletBtn />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
export default ConnectWallet;
