import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Text } from '@/components/ui/text';
import { useCtxWallet } from '@/context/wallet-context';
import { dynamicXYZ } from '@/lib/dynamic-utils';
import { fetchTokenPrice } from '@/lib/rpc';
import { cn, shortAddress } from '@/lib/utils';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatUnits } from 'viem';

export default function HomeScreen() {
  const { walletAddress } = useLocalSearchParams<{ walletAddress: string }>();
  const [sLoading, setLoading] = useState(false);

  const hCtxGlobal = useCtxWallet();
  const hRouter = useRouter();
  const [sBalance, setBalance] = useState<string>();
  const [sMarketPrice, setMarketPrice] = useState<string>();

  const shortWalletAddress = useMemo(() => {
    console.info('walletAddress', walletAddress);
    if (walletAddress === null) {
      return '';
    }

    return shortAddress(walletAddress ?? '');
  }, [walletAddress]);

  // balance를 재조회
  const refetchBalance = React.useCallback(async () => {
    console.info('refetchBalance begin');
    let myBalance: string = '';
    try {
      setLoading(true);
      myBalance = await dynamicXYZ.getVestBalance(walletAddress);
    } catch (error) {
    } finally {
      setLoading(false);
    }

    await changeBalance(myBalance);
  }, []);

  // balance가 변경됬을때 UI 업데이트
  const changeBalance = React.useCallback(async (myBalance: string) => {
    setLoading(true);
    try {
      console.info('changeBalance begin');
      console.info('myBalance', myBalance);
      const myBalanceFormatted = formatUnits(BigInt(myBalance), 18);
      console.info('myBalanceFormatted', myBalanceFormatted);
      setBalance(myBalanceFormatted);

      hCtxGlobal.updateCtx('balance', myBalance);

      const usd = await fetchTokenPrice();
      const price = parseFloat(myBalanceFormatted) * usd;
      setMarketPrice(price.toFixed(3));
    } catch (error) {
      console.error('Failed to update balance:', error);
      setBalance('0');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hCtxGlobal.ctx.balance == null) {
      return;
    }
    changeBalance(hCtxGlobal.ctx.balance ?? '0');
  }, [hCtxGlobal.ctx.balance]);

  useEffect(() => {
    refetchBalance();
  }, []);

  // 1000000_000000000000000000;

  // useFocusEffect(React.useCallback(() => {}, []));

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
                  <Text className="text-[40px]">{sMarketPrice ?? ''}</Text>
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
              <Button
                className="h-[48px] bg-white"
                onPress={() => {
                  // $dynamicClient.auth.logout();
                  // dynamicXYZ.getVestBalance(Const.testAddress.shchoi82);
                  // fetch('https://naver.com').then((res) => {
                  //   console.info('res', res);
                  // });

                  refetchBalance();
                }}>
                <Text className="text-[14px] text-[black]">Refresh</Text>
              </Button>
            </View>
          </View>
        </View>
        <LoadingOverlay visible={sLoading} />
      </SafeAreaView>
    </>
  );
}
