import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Text } from '@/components/ui/text';
import { useCtxWallet } from '@/context/wallet-context';
import { ASSERT } from '@/lib/assert';
import { dynamicXYZ } from '@/lib/dynamic-utils';
import { convertFormatedVest } from '@/lib/vest';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { QrCode } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { Platform, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatUnits, parseUnits } from 'viem';

export default function SendScreen() {
  const hCtxWallet = useCtxWallet();
  const hRouter = useRouter();

  const [sProcessing, setProcessing] = useState(false);

  const { recipient, amount } = useLocalSearchParams<{ recipient?: string; amount?: string }>();

  const hSafeAreaInsets = useSafeAreaInsets();

  const [sRecipient, setRecipient] = useState<string | undefined>(recipient);
  const [sAmount, setAmount] = useState<string | undefined>(() => {
    if (amount) {
      const formartted = formatUnits(BigInt(amount), 18);
      return formartted;
    }
  });

  const [sBalance, setBalance] = useState<string>();

  React.useEffect(() => {
    if (hCtxWallet.ctx.balance === null) {
      return;
    }

    if (hCtxWallet.ctx.balance.length === 0) {
      return;
    }

    const formatted = convertFormatedVest(hCtxWallet.ctx.balance);

    setBalance(formatted);
  }, [hCtxWallet.ctx.balance]);

  const handleSendTransaction = async () => {
    console.info('Send pressed');
    setProcessing(true);

    ASSERT(sAmount !== undefined, 'sAmount !== undefined');
    ASSERT(parseFloat(sAmount) > 0, 'parseFloat(sAmount) > 0');
    ASSERT(sRecipient !== undefined, 'sRecipient !== undefined');
    ASSERT(sRecipient.length > 0, 'sRecipient.length > 0');

    const parsedAmountBN = parseUnits(sAmount, 18);

    try {
      const txHash = await dynamicXYZ.transferVest({
        to: sRecipient as `0x${string}`,
        amount: parsedAmountBN.toString(),
      });

      hRouter.replace({
        pathname: '/send-result-screen',
        params: {
          isSucc: 'true',
          txHash: txHash,
        },
      });
      dynamicXYZ.getVestBalance(hCtxWallet.ctx.walletAddress as `0x${string}`).then((balance) => {
        console.info('updated balance', balance);
        hCtxWallet.updateCtx('balance', balance);
      });
    } catch (error) {
      hRouter.replace({
        pathname: '/send-result-screen',
        params: {
          isSucc: 'false',
        },
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Send',
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={hSafeAreaInsets.bottom}
        style={{ flex: 1 }}>
        <View className="flex-1 gap-y-[15px] bg-bgcolor p-[20px]">
          <View className="flex-1 justify-center gap-y-[15px]">
            {/* Recipient */}
            <View className="gap-y-[7px]">
              <Text>Recipient</Text>
              <View className="flex-row items-center border-b-[2px] border-b-white">
                <Input
                  className="mr-[10px] flex-1 border-[0px] text-[14px] text-white"
                  // placeholderClassName={cn('text-[#ffff]')}
                  placeholder="0x"
                  placeholderTextColor={'#ffffff90'}
                  onChangeText={(text) => {
                    setRecipient(text);
                  }}
                  value={sRecipient}
                />
                <Icon
                  as={QrCode}
                  color={'white'}
                  size={30}
                  onPress={() => {
                    hRouter.push('/qr-scaner-screen');
                  }}
                />
              </View>
            </View>

            {/* Amount */}
            <View className="gap-y-[7px]">
              <Text>Amount</Text>
              <View className="flex-row items-center border-b-[2px] border-b-white">
                <Input
                  keyboardType="numeric"
                  className="mr-[10px] flex-1 border-[0px] text-[14px] text-white"
                  onChangeText={(text) => {
                    // 숫자와 소수점만 허용
                    if (/^\d*\.?\d*$/.test(text)) {
                      setAmount(text);
                    }
                  }}
                  value={sAmount}
                />
                <Text>Max</Text>
              </View>
            </View>
            <Text className="text-[14px]">{`Balance: ${sBalance} VEST`}</Text>
          </View>

          <View className="mt-auto" style={{ marginBottom: hSafeAreaInsets.bottom }}>
            <Button
              disabled={
                !(
                  sRecipient &&
                  sAmount &&
                  parseFloat(sAmount) > 0 &&
                  parseFloat(sAmount) <= parseFloat(sBalance || '0')
                )
              }
              className="bg-white"
              onPress={handleSendTransaction}>
              <Text className="text-black">Send</Text>
            </Button>
          </View>
        </View>
        <LoadingOverlay visible={sProcessing} />
      </KeyboardAvoidingView>
    </>
  );
}
