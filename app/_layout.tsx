import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

import '@react-native-anywhere/polyfill-base64';
import { Buffer } from 'buffer';
import 'react-native-get-random-values';

import { Icon } from '@/components/ui/icon';
import { Const } from '@/config/const';
import { CtxWalletProvider } from '@/context/wallet-context';
import { createClient } from '@dynamic-labs/client';
import { ReactNativeExtension } from '@dynamic-labs/react-native-extension';
import { ViemExtension } from '@dynamic-labs/viem-extension';
import { ChevronLeft } from 'lucide-react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import ToastManager from 'toastify-react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Polyfill for @dynamic-labs/solana-extension
global.TextEncoder = require('text-encoding').TextEncoder;
global.Buffer = Buffer;

export const $dynamicClient = createClient({
  environmentId: 'f64062d1-3582-46f3-848a-ab7cd8ed81df',
  // Optional:
  appLogoUrl: 'https://app.dynamic.xyz/assets/networks/eth.svg',
  appName: 'HB Wallet test',
  evmNetworks: [
    // Stable Testnet 관련 정보
    {
      blockExplorerUrls: ['https://stable-explorer.testnet.chain0.dev/'],
      chainId: Const.chainInfo.chainID,
      networkId: Const.chainInfo.chainID,
      name: 'bh',
      iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
      nativeCurrency: {
        decimals: 18,
        name: 'USDT',
        symbol: 'USDT',
        iconUrl: 'https://app.dynamic.xyz/assets/networks/eth.svg',
        pricingProviderTokenId: 'ethereum',
      },
      rpcUrls: [Const.chainInfo.rpc],
      vanityName: Const.chainInfo.name,
    },
  ],
})
  .extend(ReactNativeExtension())
  .extend(ViemExtension());
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const hRouter = useRouter();

  return (
    <>
      <KeyboardProvider>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <CtxWalletProvider>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack
              screenOptions={{
                animation: 'none',
                // animation: 'slide_from_right',
                // headerTitle: 'Send',
                headerTitleStyle: { color: 'white', fontSize: 18 },
                headerStyle: {
                  backgroundColor: '#4a735d',
                },
                headerShadowVisible: false,

                headerLeft: (props) => (
                  <Icon
                    as={ChevronLeft}
                    size={30}
                    hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                    color="white"
                    onPress={() => {
                      hRouter.canGoBack() && hRouter.back();
                    }}
                  />
                ),
              }}
            />
            <PortalHost />
          </CtxWalletProvider>
        </ThemeProvider>
      </KeyboardProvider>
      <ToastManager />
      <$dynamicClient.reactNative.WebView />
    </>
  );
}
