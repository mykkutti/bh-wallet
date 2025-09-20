// UI 테마 색상
const $bgColor = '#4a735d';

// 테스트용 관리자 지갑 주소
const testAdminWalletAddress: `0x${string}` = '0xb3e9E8C774F1Ee6fdb515A8211f87Db3EB3347d3';

// VEST 토큰 컨트랙트 ABI (Application Binary Interface)
// ERC20 표준에 필요한 최소한의 함수들만 포함
const vestAbi = [
  // 특정 주소의 토큰 잔액 조회
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  // 토큰의 소수점 자릿수 조회 (일반적으로 18)
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  // 토큰 전송 함수
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  // 토큰 심볼 조회 (예: VEST)
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
] as const;

/**
 * 애플리케이션 전역 상수 설정
 */
export const Const = {
  // UI 설정
  $bgColor,
  
  // 스마트 컨트랙트 관련
  vestAbi,
  testAdminWalletAddress,
  
  // 딥링크 URL 스키마
  urlScheme: 'hb-wallet://',

  // 블록체인 네트워크 설정
  chainInfo: {
    // Ethereum Sepolia 테스트넷 설정
    chainID: 11155111,
    name: 'Sepolia',
    rpc: 'https://eth-sepolia.public.blastapi.io',
    tokenContractAddress: '0x373280fc29834E414611b49349AC31b1F9B6008d' as `0x${string}`,
    tokenDecimals: 18,
    
    // 이전 네트워크 설정 (주석 처리됨)
    // chainID: 2201,
    // name: 'Stable Testnet',
    // rpc: 'https://stable-jsonrpc.testnet.chain0.dev/',
  },

  // 개발/테스트용 주소
  testAddress: {
    shchoi82: '0x764454bab772e1648856456464BFEf871cd5F877' as `0x${string}`,
    mykkutti: '0x9351cA126eE95AE80C8fc8db91cE401682E1A288' as `0x${string}`,
  },
} as const;
