import { parseQRCode, validateAmount, validateWalletAddress } from '@/lib/utils';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Toast } from 'toastify-react-native';

const ERROR_INVALID_PAYMENT_CODE = 'Invalid payment code';
const ERROR_INVALID_ADDRESS = 'Invalid recipient address in payment code';
const ERROR_INVALID_ADDRESS_LENGTH = 'Invalid recipient address length in payment code';
const ERROR_INVALID_AMOUNT = 'Invalid amount in payment code';

export default function QrScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  const refDone = useRef<boolean>(false);
  const hRouter = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Scan',
        }}
      />
      <View className="flex-1 items-center justify-center bg-bgcolor">
        <CameraView
          style={{ width: '80%', height: '70%', borderRadius: 20 }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={(event) => {
            console.log('onBarcodeScanned', event);

            if (refDone.current) {
              console.info('already done');
              return;
            }

            if (event.type !== 'qr') {
              console.warn('event.type is not qr');
              Toast.warn(ERROR_INVALID_PAYMENT_CODE, 'center');
              return;
            }

            if (event.raw === undefined) {
              console.warn('event.raw is  undefined');
              Toast.warn(ERROR_INVALID_PAYMENT_CODE, 'center');
              return;
            }

            console.info('QR DATA', event.raw);
            // hb-wallet:://send-screen?to=0x764454bab772e1648856456464BFEf871cd5F877&amount=13131000000000000000000

            const paymentData = parseQRCode(event.raw);
            if (!paymentData) {
              Toast.warn(ERROR_INVALID_PAYMENT_CODE, 'center');
              return;
            }

            const addressError = validateWalletAddress(paymentData.to);
            if (addressError) {
              if (addressError === 'Invalid recipient address') {
                Toast.warn(ERROR_INVALID_ADDRESS, 'center');
              } else if (addressError === 'Invalid address length') {
                Toast.warn(ERROR_INVALID_ADDRESS_LENGTH, 'center');
              }
              return;
            }

            const amountError = validateAmount(paymentData.amount);
            if (amountError) {
              Toast.warn(ERROR_INVALID_AMOUNT, 'center');
              return;
            }

            console.info('Parsed to:', paymentData.to, 'amount:', paymentData.amount);

            hRouter.back();
            hRouter.replace({
              pathname: '/send-screen',
              params: { recipient: paymentData.to, amount: paymentData.amount },
            });

            refDone.current = true;
          }}
        />
      </View>
    </>
  );
}
