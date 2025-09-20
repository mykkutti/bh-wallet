import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 0x764454bab772e1648856456464BFEf871cd5F877
// 0x764454...5F877
export const shortAddress = (address: string): string => {
  if (!(address.startsWith('0x') || address.startsWith('0X'))) {
    return '';
  }
  const start = address.substring(0, 7);
  const end = address.substring(37);
  // return `${start}···${end}`;
  return `${start}...${end}`;
};

// Ethereum address validation
export const ETHEREUM_ADDRESS_PREFIX = '0x';
export const ETHEREUM_ADDRESS_LENGTH = 42;

export const validateWalletAddress = (address: string): string | null => {
  if (!address.startsWith(ETHEREUM_ADDRESS_PREFIX)) {
    return 'Invalid recipient address';
  }
  if (address.length !== ETHEREUM_ADDRESS_LENGTH) {
    return 'Invalid address length';
  }
  return null;
};

export const validateAmount = (amount: string): string | null => {
  if (!/^\d+$/.test(amount)) {
    return 'Invalid amount';
  }
  return null;
};

// 소수점을 포함한 금액 검증
export const validateDecimalAmount = (amount: string): boolean => {
  return /^\d*\.?\d*$/.test(amount);
};

export interface PaymentData {
  to: string;
  amount: string;
}

export const parseQRCode = (rawData: string): PaymentData | null => {
  const match = rawData.match(/to=([^&]+)&amount=([^&]+)/);
  if (!match) {
    return null;
  }
  return { to: match[1], amount: match[2] };
};
