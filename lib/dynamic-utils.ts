import { $dynamicClient } from '@/app/_layout';
import { Const } from '@/config/const';
import { ASSERT } from '@/lib/assert';
import { Toast } from 'toastify-react-native';
import { parseUnits } from 'viem';

const login = async () => {
  console.info('login');
  const ret = await $dynamicClient.ui.auth.show();
  console.info('Dynamic Login Promise', ret);

  const authenticatedUser = $dynamicClient.auth.authenticatedUser;
  console.info('authenticatedUser', authenticatedUser);
};

const logout = async () => {
  const ret = await $dynamicClient.auth.logout();
  console.info('Dynamic logout Promise', ret);

  const authenticatedUser = $dynamicClient.auth.authenticatedUser;
  console.info('authenticatedUser', authenticatedUser);
};

const getPrimaryAddressOrNull = (): string | null => {
  const authenticatedUser = $dynamicClient.auth.authenticatedUser;
  console.info('authenticatedUser', authenticatedUser);
  if (authenticatedUser == null) {
    return null;
  }

  ASSERT(authenticatedUser.verifiedCredentials.length !== 0, 'No verified credentials found');
  const verifiedCredential = authenticatedUser.verifiedCredentials[0];
  const address = verifiedCredential.address;
  return address ?? null;
};

const debug = () => {
  const authenticatedUser = $dynamicClient.auth.authenticatedUser;
  console.info('authenticatedUser', JSON.stringify(authenticatedUser, null, 2));
};

const getViemClient = async () => {
  const publicClient = $dynamicClient.viem.createPublicClient({
    chain: {
      id: Const.chainInfo.chainID,
      name: Const.chainInfo.name,
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: {
          http: [Const.chainInfo.rpc],
        },
        public: {
          http: [Const.chainInfo.rpc],
        },
        // alchemy: {
        //   http: ['https://zkevm-testnet.g.alchemy.com/v2/your-api-key'],
        // },
        // infura: {
        //   http: ['https://zkevm-testnet.infura.io/v3/your-api-key'],
        // },
      },
      testnet: true,
    },
  });

  const walletClient = await $dynamicClient.viem.createWalletClient({
    chain: {
      id: Const.chainInfo.chainID,
      name: Const.chainInfo.name,
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: {
          http: [Const.chainInfo.rpc],
        },
        public: {
          http: [Const.chainInfo.rpc],
        },
        // alchemy: {
        //   http: ['https://zkevm-testnet.g.alchemy.com/v2/your-api-key'],
        // },
        // infura: {
        //   http: ['https://zkevm-testnet.infura.io/v3/your-api-key'],
        // },
      },
      testnet: true,
    },
    wallet: $dynamicClient.wallets.primary!,
  });

  return { publicClient, walletClient };
};

/**
 * VEST 토큰의 잔액을 조회합니다.
 */
const getVestBalance = async (walletAddress: string) => {
  const { publicClient } = await getViemClient();

  try {
    // balanceOf 함수를 호출하여 잔액 가져오기
    const balance = await publicClient.readContract({
      address: Const.chainInfo.tokenContractAddress,
      abi: Const.vestAbi,
      functionName: 'balanceOf',
      args: [walletAddress],
    });
    console.info(`balance: ${balance} ${typeof balance}`);

    return (balance as bigint).toString();
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

/**
 * VEST 토큰의 심볼을 조회합니다.
 */
const getVestSymbol = async () => {
  const { publicClient } = await getViemClient();

  try {
    const symbol = await publicClient.readContract({
      address: Const.chainInfo.tokenContractAddress,
      abi: Const.vestAbi,
      functionName: 'symbol',
    });
    console.info(`symbol: ${symbol} ${typeof symbol}`);
    return symbol;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

/**
 * VEST 토큰을 전송합니다.
 * 주의 amount는 소수점 18자리까지 지원합니다. 예: "1.5", "0.0001"
 */
const transferVest = async (args: { to: `0x${string}`; amount: string }) => {
  console.info(`transferVest begin to:${args.to}, amount:${args.amount}`);

  const primaryWallet = $dynamicClient.wallets.primary;

  ASSERT(primaryWallet != null, 'primaryWallet is null');

  const { publicClient, walletClient } = await getViemClient();

  const amountBN = parseUnits(args.amount, 18);
  const amountBN2 = BigInt(args.amount);

  try {
    // 트랜잭션 시뮬레이션 (가스 추정)
    const { request } = await publicClient.simulateContract({
      address: Const.chainInfo.tokenContractAddress as `0x${string}`,
      abi: Const.vestAbi,
      functionName: 'transfer',
      args: [args.to as `0x${string}`, amountBN2],
      account: primaryWallet.address as `0x${string}`,
    });

    console.info('simulated request:', request);
    console.info(`request.gas:${request.gas}`);
    console.info(`request.gasPrice:${request.gasPrice}`);
    const txHash = await walletClient.writeContract(request);
    console.info('txHash:', txHash, typeof txHash);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.info('receipt:', receipt);
    return txHash;
  } catch (error) {
    // console.error('Error in transferVest:', error);
    Toast.error('Transfer failed', 'center');

    throw error;
  }

  //  트랜잭션 전송
  // const txHash = await walletClient.writeContract(request);
};

const dynamicTest = async () => {
  console.info('networks', JSON.stringify($dynamicClient.networks.evm, null, 2));
  // const authenticatedUser = dynamicClient.wallets.getBalance({ wallet: '0x...' });
  // console.info('authenticatedUser', JSON.stringify(authenticatedUser, null, 2));

  console.info('userWallets', JSON.stringify($dynamicClient.wallets.userWallets, null, 2));

  await $dynamicClient.wallets.switchNetwork({
    wallet: $dynamicClient.wallets.userWallets[0],
    chainId: Const.chainInfo.chainID,
  });

  const network = await $dynamicClient.wallets.getNetwork({
    wallet: $dynamicClient.wallets.userWallets[0],
  });
  console.info('getNetwork', JSON.stringify(network, null, 2));

  if ($dynamicClient.wallets.userWallets.length === 0) {
    return;
  }
  const wallet = $dynamicClient.wallets.userWallets[0];

  const balance = await $dynamicClient.wallets.getBalance({ wallet });
  console.info('getBalance', JSON.stringify(balance, null, 2));

  /////////////////////////////

  console.info('evm', JSON.stringify($dynamicClient.networks.evm, null, 2));

  // for (const evm of dynamicClient.networks.evm) {
  // }

  const viemClient = $dynamicClient.viem.createPublicClient({
    chain: {
      id: Const.chainInfo.chainID,
      name: Const.chainInfo.name,
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: {
          http: [Const.chainInfo.rpc],
        },
        public: {
          http: [Const.chainInfo.rpc],
        },
        // alchemy: {
        //   http: ['https://zkevm-testnet.g.alchemy.com/v2/your-api-key'],
        // },
        // infura: {
        //   http: ['https://zkevm-testnet.infura.io/v3/your-api-key'],
        // },
      },
      testnet: true,
    },
  });

  console.info('userWallets', JSON.stringify($dynamicClient.wallets.userWallets, null, 2));

  // https://stable-explorer.testnet.chain0.dev/address/0x764454bab772e1648856456464BFEf871cd5F877?tab=tokens

  const myAddr: `0x${string}` = wallet.address as `0x${string}`;
  const adminHolderAddr: `0x${string}` = '0xb3e9E8C774F1Ee6fdb515A8211f87Db3EB3347d3';

  try {
    const balance2 = await viemClient.getBalance({
      address: adminHolderAddr,
    });
    console.info('adminHolder address', adminHolderAddr);
    console.info('adminHolder balance', balance2);

    // 잔액을 확인할 지갑 주소

    // const walletAddress = myAddr;
    const walletAddress = adminHolderAddr;

    // VEST 토큰의 ABI (필요한 부분만)
    const vestAbi = [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
      },
    ];

    async function getVestBalance() {
      try {
        // 1. 토큰의 decimals 값 가져오기
        const decimals = await viemClient.readContract({
          address: Const.chainInfo.tokenContractAddress,
          abi: vestAbi,
          functionName: 'decimals',
        });

        // 2. balanceOf 함수를 호출하여 잔액 가져오기
        const balance = await viemClient.readContract({
          address: Const.chainInfo.tokenContractAddress,
          abi: vestAbi,
          functionName: 'balanceOf',
          args: [walletAddress],
        });

        // 3. formatUnits를 사용하여 읽기 쉬운 형태로 변환

        // const formattedBalance = formatUnits(balance, decimals);

        console.info(`VEST Balance for ${walletAddress}: ${balance}`);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }

    getVestBalance();

    // await getTokenPrice();
    //   await getTokenPrice2();
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
};

export const dynamicXYZ = {
  //
  login,
  logout,
  debug,
  getPrimaryAddressOrNull,
  getVestBalance,
  getVestSymbol,
  transferVest,
  dynamicTest,
};
