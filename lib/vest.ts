import { formatUnits } from 'viem';

// vest 토큰의 banlance 조회
export const getBalance = async (address: `0x${string}`) => {};

// // vest 토큰 전송 전송
// export const send = async (args: { from: `0x${string}`; to: `0x${string}`; amount: number }) => {
//   const todo = formatUnits('1000000000', 18);
// };

// export const _formatUnits = async (args: {
//   from: `0x${string}`;
//   to: `0x${string}`;
//   amount: number;
// }) => {
//   const todo = formatUnits('1000000000', 18);
// };

export const convertFormatedVest = (vestAmount: string) => {
  if (vestAmount.length === 0) {
    return;
  }

  try {
    console.info('convertFormatedVest', vestAmount);
    const formatted = formatUnits(BigInt(vestAmount), 18);

    // 천단위 콤마 추가
    const final = Number(formatted).toLocaleString();
    return final;
  } catch (err) {
    console.error('convertFormatedVest', err);
    throw err;
  }
};
