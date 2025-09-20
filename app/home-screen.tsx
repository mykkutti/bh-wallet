import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCtxWallet } from '@/context/wallet-context';
import { ASSERT } from '@/lib/assert';
import { dynamicXYZ } from '@/lib/dynamic-utils';
import { fetchMarketPrice } from '@/lib/rpc';
import { cn, shortAddress } from '@/lib/utils';
import { formatUnits } from 'ethers';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MarketPrice {
  decimal: string;
  frac: string;
}

export default function HomeScreen() {
  const { walletAddress } = useLocalSearchParams<{ walletAddress: string }>();

  const hCtxGlobal = useCtxWallet();
  const hRouter = useRouter();
  const [sBalance, setBalance] = useState<string>();
  const [sMarketPrice, setMarketPrice] = useState<MarketPrice>();

  const shortWalletAddress = useMemo(() => {
    console.info('walletAddress', walletAddress);
    if (walletAddress === null) {
      return '';
    }

    return shortAddress(walletAddress ?? '');
  }, [walletAddress]);

  const updateBalance = React.useCallback(async () => {
    try {
      console.info('updateBalance begin');
      ASSERT(walletAddress !== null, 'walletAddress is null');
      const myBalance = await dynamicXYZ.getVestBalance(walletAddress);
      console.info('myBalance', myBalance);
      const myBalanceFormatted = formatUnits(myBalance, 18);
      console.info('myBalanceFormatted', myBalanceFormatted);
      setBalance(myBalanceFormatted);

      hCtxGlobal.updateCtx('balance', myBalance);
    } catch (error) {
      console.error('Failed to update balance:', error);
      setBalance('0');
    }
  }, []);

  useEffect(() => {
    updateBalance();
  }, [hCtxGlobal.ctx.balance]);

  // 1000000_000000000000000000;

  useEffect(() => {
    updateBalance();

    fetchMarketPrice().then((price) => {
      setMarketPrice(price);
    });
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 justify-center bg-bgcolor p-[20px]">
          <View className="absolute left-[20px] top-[20px]">
            <Text className="text-[18px]">Welcome,</Text>
            <Text className="text-[12px]">{`${shortWalletAddress}`}</Text>
          </View>

          <View className="flex-col">
            <Text className="text-[16px]">Total Balance</Text>
            <View className="flex-row items-end justify-between">
              <View
                className={cn('flex-row items-center', sMarketPrice ? 'opacity-1' : 'opacity-0')}>
                <Text className="text-[32px]">$</Text>
                <View className="flex-row items-baseline">
                  <Text className="text-[40px]">{sMarketPrice?.decimal ?? ''}</Text>
                  <Text className="text-[36px]">.{sMarketPrice?.frac ?? ''}</Text>
                </View>
              </View>
              <Text className="text-[14px]">{`${sBalance} VEST`}</Text>
            </View>
            <View className="mt-[50px] gap-[10px]">
              <Button
                className="h-[48px] bg-white"
                onPress={() => {
                  hRouter.push('/send-screen');
                }}>
                <Text className="text-[14px] text-[black]">Send</Text>
              </Button>
              <Button
                className="h-[48px] bg-white"
                onPress={() => {
                  hRouter.push('/request-screen');
                }}>
                <Text className="text-[14px] text-[black]">Request</Text>
              </Button>
              {/* <Button
                className="h-[48px] bg-white"
                onPress={() => {
                  $dynamicClient.auth.logout();
                }}>
                <Text className="text-[14px] text-[black]">Logout</Text>
              </Button> */}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
