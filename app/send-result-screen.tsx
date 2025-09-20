import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Check, Minus, SquareArrowOutUpRightIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

// Result Status Component
interface ResultStatusProps {
  isSuccess: boolean;
  txHash?: string;
}

const ResultStatus = ({ isSuccess, txHash }: ResultStatusProps) => {
  const [webLoading, setWebLoading] = React.useState(false);
  const IconComponent = isSuccess ? Check : Minus;
  const iconColor = isSuccess ? '#27C840' : 'red';
  const statusText = isSuccess ? 'Complete' : 'Failed';

  const handleExplorerPress = async () => {
    if (!txHash) return;
    
    setWebLoading(true);
    try {
      // stable chain: https://stable-explorer.testnet.chain0.dev/tx/${txHash}
      const url = `https://sepolia.etherscan.io/tx/${txHash}`;
      console.info('openBrowserAsync', url);
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Failed to open explorer:', error);
      Toast.error('Failed to open the explorer. Please try again.', 'center');
    } finally {
      setWebLoading(false);
    }
  };

  return (
    <View className="items-center">
      <View className="h-[36px] w-[36px] items-center justify-center rounded-full bg-white">
        <Icon as={IconComponent} size={30} color={iconColor} />
      </View>
      <Text>{statusText}</Text>

      {isSuccess && txHash && (
        <Pressable onPress={handleExplorerPress} disabled={webLoading}>
          <View className="mt-[100px] flex-row items-center gap-x-[10px]">
            <Text className={webLoading ? "underline opacity-50" : "underline"}>
              {webLoading ? "Opening..." : "View on explorer"}
            </Text>
            <Icon 
              as={SquareArrowOutUpRightIcon} 
              size={20} 
              color={webLoading ? "#ffffff80" : "#fff"} 
            />
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default function SendResultScreen() {
  const hRouter = useRouter();

  const { isSucc, txHash } = useLocalSearchParams<{ isSucc: string; txHash?: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView className="flex-1 bg-bgcolor">
        <View className="flex-1 items-center justify-center space-y-8">
          <View className="flex-1 justify-center">
            <ResultStatus isSuccess={isSucc === 'true'} txHash={txHash} />
          </View>

          <View className="mt-auto self-stretch p-[20px]">
            <Button
              className="bg-white"
              onPress={() => {
                if (hRouter.canGoBack()) {
                  hRouter.back();
                }
              }}>
              <Text className="text-black">Back</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
