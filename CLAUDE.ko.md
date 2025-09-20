# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고할 수 있는 가이드입니다.

## 프로젝트 개요

HB Wallet은 Expo로 구축된 React Native 암호화폐 지갑 애플리케이션입니다. 사용자는 이더리움 Sepolia 테스트넷에서 VEST 토큰을 관리하고, 송금, 수신, 잔액 확인 등의 기능을 사용할 수 있습니다.

## 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 특정 플랫폼에서 실행
npm run ios      # iOS 시뮬레이터 (Mac에서만 가능)
npm run android  # Android 에뮬레이터
npm run web      # 웹 브라우저

# 프로젝트 정리
npm run clean    # .expo와 node_modules 디렉토리 제거
```

## 아키텍처 개요

### 핵심 기술 스택
- **프레임워크**: React Native with Expo (SDK 53)
- **내비게이션**: Expo Router (파일 기반 라우팅)
- **스타일링**: NativeWind (React Native용 Tailwind CSS)
- **상태 관리**: React Context API (`wallet-context.ts`)
- **블록체인 통합**: Dynamic Labs SDK with Viem extension
- **UI 컴포넌트**: React Native Reusables 기반 커스텀 컴포넌트

### 프로젝트 구조
```
app/              # 화면 컴포넌트 (Expo Router 페이지)
├── _layout.tsx   # 전역 프로바이더가 포함된 루트 레이아웃
├── index.tsx     # 진입점 - 지갑 연결
├── home-screen.tsx      # 잔액이 표시되는 메인 지갑 화면
├── send-screen.tsx      # 토큰 전송 인터페이스
├── request-screen.tsx   # 토큰 요청 (QR 생성)
├── qr-scaner-screen.tsx # QR 코드 스캐너
└── send-result-screen.tsx # 거래 결과 표시

components/ui/    # 재사용 가능한 UI 컴포넌트
lib/             # 유틸리티 함수 및 서비스
├── dynamic-utils.ts # Dynamic Labs 지갑 유틸리티
├── rpc.ts          # API 호출 (가격 조회)
├── vest.ts         # VEST 토큰 전용 함수
└── utils.ts        # 일반 유틸리티

config/const.ts   # 전역 상수 및 설정
context/wallet-context.ts # 전역 지갑 상태 관리
```

### 주요 아키텍처 결정사항

1. **Dynamic Labs 통합**: 지갑 연결 및 관리를 위해 Dynamic Labs를 사용합니다. 클라이언트는 `_layout.tsx`에서 환경별 설정으로 초기화됩니다.

2. **토큰 컨트랙트**: VEST 토큰 작업은 Sepolia 테스트넷의 커스텀 ERC20 컨트랙트를 사용합니다 (주소: `0x373280fc29834E414611b49349AC31b1F9B6008d`).

3. **상태 관리**: 지갑 상태(주소, 잔액 등)는 React Context를 통해 전역적으로 관리되며, `useCtxWallet` 훅으로 접근할 수 있습니다.

4. **내비게이션 플로우**: 
   - 진입점 (`index.tsx`) → 지갑 연결
   - 성공 → 잔액이 표시되는 홈 화면
   - 액션 → QR 코드를 지원하는 송금/요청 화면

5. **스타일링 접근법**: 플랫폼 간 일관된 Tailwind 기반 스타일링을 위해 NativeWind를 사용합니다. `lib/utils.ts`의 `cn()` 유틸리티가 조건부 클래스명을 처리합니다.

## 중요한 설정

### 네트워크 구성 (`config/const.ts`)
- 체인 ID: 11155111 (Sepolia)
- RPC: https://eth-sepolia.public.blastapi.io
- 토큰 컨트랙트: 0x373280fc29834E414611b49349AC31b1F9B6008d
- 토큰 소수점: 18자리

### Dynamic Labs 설정
- 환경 ID: f64062d1-3582-46f3-848a-ab7cd8ed81df
- 확장: ReactNativeExtension, ViemExtension
- Sepolia를 위한 커스텀 EVM 네트워크 구성

## 주요 패턴

1. **비동기 잔액 업데이트**: 잔액 조회는 블록체인 상태와 동기화하기 위해 `updateBalance` 콜백 패턴을 사용합니다.

2. **QR 코드 통합**: 딥 링킹을 지원하여 QR 생성(수신용)과 스캔(송금용)을 모두 지원합니다.

3. **거래 플로우**: 송금 작업은 입력값 검증, 적절한 소수점으로 금액 파싱, Dynamic Labs를 통한 실행, 결과 화면으로 이동하는 순서로 진행됩니다.

4. **에러 처리**: 거래 에러는 성공/실패 상태와 함께 결과 화면을 통해 표시됩니다.

5. **가격 표시**: 시장 가격 조회가 구현되어 있지만 현재는 `lib/rpc.ts`에서 목업 데이터(1523.62)를 반환합니다.

## 개발 참고사항

- TypeScript를 strict 모드로 사용합니다
- 경로 별칭 `@/`는 프로젝트 루트에 매핑됩니다
- Expo Router가 모든 내비게이션과 딥 링킹을 처리합니다
- iOS, Android, Web 플랫폼을 지원합니다
- React Native의 New Architecture를 사용합니다