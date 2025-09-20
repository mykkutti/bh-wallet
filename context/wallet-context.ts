import { createGenericContext } from '@/lib/my-create-ctx';

const CtxWalletState = {
  // UserProfile: null as UserProfile | null,
  // size: {
  //   scaledWidth: 0 as number,
  //   scaledHeight: 0 as number,
  //   scaled: 0 as number,
  // },
  // clipHeightPercent: 1 as number,

  walletAddress: null as string | null,
  balance: null as string | null,
} as const;

export const [CtxWalletProvider, useCtxWallet] = createGenericContext(CtxWalletState);
