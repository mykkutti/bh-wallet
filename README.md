# Wallet

React Native 기반의 VEST 토큰 전용 암호화폐 지갑 앱

## 아키텍처

### 기술 스택

- **Framework**: React Native + Expo (SDK 53)
- **Navigation**: Expo Router (파일 기반 라우팅)
- **Styling**: NativeWind (Tailwind CSS)
- **상태관리**: React Context
- **블록체인**: Dynamic Labs SDK + Viem
- **네트워크**: Ethereum Sepolia Testnet

### 주요 구조

```
app/              # 화면 컴포넌트
├── index.tsx     # 지갑 연결 화면
├── home-screen.tsx      # 홈화면 잔액 조회
├── send-screen.tsx      # 토큰 전송
├── send-result-screen.tsx # 토큰 전송 결과
├── qr-scanner-screen.tsx # QR 코드 스캐너 화면
└── request-screen.tsx   # 토큰 요청 (QR 생성)
└── request-qr-screen.tsx   # 생성된 QR 코드 화면

components/ui/    # UI 컴포넌트
lib/             # 유틸리티 함수
context/         # 전역 상태 관리
```

## 설치 및 실행 방법

```bash
# 의존성 설치
npm install

# native 코드 생성
npx expo prebuild

# 플랫폼별 실행
npx expo run android -d
npx expo run ios -d
```

## etc
- 상태관리로 zustand를 주로 사용하지만 여기에서는 복잡한상태관리가 필요하진않아 라이브러리를 설치하지않고 Context로 처리함
- rpc 호출처리는 tanstack query를 사용해 캐싱처리 재시도처리를 주로 개방했었지만 여기서는 간단히 fetch 로 구현
- ui 는 별도의 라이브러리 없이 react native reusables 를 사용함 유연하게 커스터마이징 가능
- expo 54는 최신이라 unknown 이슈등이 있을수있어 문제에 집중하기위해 53으로 진행
- todo 앱이 기동중이지 않을때도 딥링크처리도 가능하게 하면 편리할듯 미구현함 
