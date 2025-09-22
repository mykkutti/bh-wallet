import { $dynamicClient } from '@/app/_layout';
import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Text } from '@/components/ui/text';
import { useCtxWallet } from '@/context/wallet-context';
import { dynamicXYZ } from '@/lib/dynamic-utils';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  const hRouter = useRouter();

  const hCtxWallet = useCtxWallet();

  const [sReadyState, setReadyState] = useState({
    sdkReady: false,
    authChecked: false,
    authReady: false,
  });

  useEffect(() => {
    const handleLoadedChanged = (loaded: boolean) => {
      console.info('dynamicClient.sdk loaded', loaded);
      setReadyState((prev) => ({ ...prev, sdkReady: loaded }));
    };

    const handleUserAuthenticated = async (user: any) => {
      console.info('userAuthenticated', JSON.stringify(user, null, 2));
      setReadyState((prev) => ({ ...prev, authChecked: true, authReady: true }));
    };

    const handleAuthenticatedUserChanged = async (auth: any) => {
      console.info('authenticatedUserChanged', JSON.stringify(auth, null, 2));

      if (auth == null) {
        console.info('authenticatedUserChanged auth is null');
        setReadyState((prev) => ({ ...prev, authChecked: true }));
        return;
      }

      setReadyState((prev) => ({ ...prev, authChecked: true }));
      setReadyState((prev) => ({ ...prev, authChecked: true, authReady: true }));
    };

    $dynamicClient.sdk.on('loadedChanged', handleLoadedChanged);
    $dynamicClient.auth.setHandler('userAuthenticated', handleUserAuthenticated);
    $dynamicClient.auth.on('authenticatedUserChanged', handleAuthenticatedUserChanged);

    return () => {
      // $dynamicClient.sdk.off('loadedChanged', handleLoadedChanged);
      $dynamicClient.auth.off('authenticatedUserChanged', handleAuthenticatedUserChanged);
    };
  }, []);

  useEffect(() => {
    console.info('useEffect - readyState', sReadyState);
    if (!sReadyState.sdkReady) {
      console.info('sdk not ready');
      return;
    }
    if (!sReadyState.authChecked) {
      console.info('auth not checked');
      return;
    }

    if (!sReadyState.authReady) {
      console.info('auth not ready');
      return;
    }

    const goHome = async () => {
      const walletAddress = dynamicXYZ.getPrimaryAddressOrNull();
      if (walletAddress === null) {
        console.info('walletAddress is null, route to index');
        throw new Error('walletAddress is null');
      }
      hCtxWallet.updateCtx('walletAddress', walletAddress);
      console.info('route to home-screen');
      hRouter.replace({ pathname: '/home-screen', params: { walletAddress } });
    };

    goHome();
  }, [sReadyState]);

  console.info('RENDER app/index.tsx');

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center bg-[#4a735d]">
          <Button
            className="w-[50%]"
            onPress={() => {
              dynamicXYZ.login();
            }}>
            <Text>Login</Text>
          </Button>
        </View>
        <LoadingOverlay visible={!sReadyState.authChecked || !sReadyState.sdkReady} />
      </SafeAreaView>
    </>
  );
}
