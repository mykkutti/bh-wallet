import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Const } from '@/config/const';
import { useCtxWallet } from '@/context/wallet-context';
import { ASSERT } from '@/lib/assert';
import { validateDecimalAmount } from '@/lib/utils';
import { parseUnits } from 'viem';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { Platform, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// QR 코드 생성 함수
const generateRequestQRCode = (walletAddress: string, amount: string): string => {
  const parsedAmount = parseUnits(amount, Const.chainInfo.tokenDecimals);
  return `${Const.urlScheme}send-screen?to=${walletAddress}&amount=${parsedAmount}`;
};

export default function SendScreen() {
  const hCtxGlobal = useCtxWallet();
  const [sAmount, setAmount] = useState<string>();
  const [sQrCode, setQrCode] = useState<string>();
  const hRouter = useRouter();
  const hSafeAreaInsets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Request',
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={hSafeAreaInsets.bottom}
        style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center gap-[15px] bg-bgcolor pb-[20px] pl-[20px] pr-[20px]">
          <View className="flex-1 justify-center self-stretch">
            <View className="border-b-[2px] border-b-white">
              <Text>{`Enter amount\nyou want to request`}</Text>
              <Input
                keyboardType="numeric"
                className="border-[0px] text-[14px] text-white"
                onChangeText={(text) => {
                  // 숫자와 소수점만 허용
                  if (validateDecimalAmount(text)) {
                    setAmount(text);
                  } else {
                    return;
                  }

                  if (text.length === 0) {
                    setQrCode(undefined);
                    return;
                  }
                  const walletAddress = hCtxGlobal.ctx.walletAddress;
                  ASSERT(walletAddress !== null, 'walletAddress is null');

                  const qrCode = generateRequestQRCode(walletAddress, text);
                  setQrCode(qrCode);
                }}
                value={sAmount}
              />
            </View>
          </View>

          <View className="mt-auto self-stretch" style={{ marginBottom: hSafeAreaInsets.bottom }}>
            <Button
              disabled={sQrCode === undefined}
              className="bg-white"
              onPress={() => {
                hRouter.push({
                  pathname: '/request-qr-screen',
                  params: {
                    qrCode: sQrCode,
                  },
                });
              }}>
              <Text className="text-black">Create QR Code</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
