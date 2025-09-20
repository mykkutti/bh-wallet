import { cn } from '@/lib/utils';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SendScreen() {
  const { qrCode } = useLocalSearchParams<{ qrCode: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Request',
        }}
      />
      <SafeAreaView className={cn('bg-bgcolor flex-1 items-center justify-center p-[20px]')}>
        <View className={cn('bg-white p-[10px]')}>
          <QRCode value={qrCode} size={300} />
        </View>
      </SafeAreaView>
    </>
  );
}
