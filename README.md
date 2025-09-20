# HB Wallet

HB Wallet은 VEST 토큰을 관리하기 위한 React Native 암호화폐 지갑 애플리케이션입니다. 이더리움 Sepolia 테스트넷에서 토큰 송금, 수신, 잔액 조회 등의 기능을 제공합니다.

## 주요 기능

- 💰 VEST 토큰 잔액 조회
- 📤 토큰 송금
- 📥 QR 코드를 통한 토큰 요청
- 📱 QR 코드 스캔으로 간편 송금
- 💱 실시간 가격 정보 (예정)

## 기술 스택

- **프레임워크**: [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- **내비게이션**: [Expo Router](https://expo.dev/router)
- **스타일링**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **블록체인**: [Dynamic Labs](https://www.dynamic.xyz/) + [Viem](https://viem.sh/)
- **UI 컴포넌트**: [React Native Reusables](https://reactnativereusables.com)

## 시작하기

### 사전 요구사항

- Node.js (v18 이상)
- npm 또는 yarn
- iOS 개발을 위한 Xcode (Mac에서만 가능)
- Android 개발을 위한 Android Studio

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/hb-wallet.git
cd hb-wallet

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# Expo Dev Server 시작
npm run dev

# 또는 특정 플랫폼에서 실행
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터  
npm run web      # 웹 브라우저
```

[Expo Go](https://expo.dev/go) 앱을 사용하여 실제 기기에서 QR 코드를 스캔하여 앱을 테스트할 수 있습니다.

## 프로젝트 구조

```
app/                # 화면 컴포넌트 (라우팅)
├── index.tsx       # 지갑 연결 화면
├── home-screen.tsx # 메인 화면 (잔액 표시)
├── send-screen.tsx # 토큰 전송
└── request-screen.tsx # 토큰 요청 (QR 생성)

components/ui/      # 재사용 가능한 UI 컴포넌트
lib/               # 유틸리티 함수
├── dynamic-utils.ts # 지갑 관련 유틸리티
├── rpc.ts         # API 호출
└── vest.ts        # VEST 토큰 함수

config/const.ts    # 전역 설정
context/           # 상태 관리
```

## 네트워크 설정

현재 Ethereum Sepolia 테스트넷에서 작동합니다:

- **체인 ID**: 11155111
- **RPC URL**: https://eth-sepolia.public.blastapi.io
- **VEST 토큰 주소**: `0x373280fc29834E414611b49349AC31b1F9B6008d`

## 개발 가이드

### UI 컴포넌트 추가

React Native Reusables CLI를 사용하여 새로운 컴포넌트를 추가할 수 있습니다:

```bash
npx react-native-reusables/cli@latest add [컴포넌트명]
```

### 프로젝트 정리

```bash
# .expo와 node_modules 디렉토리 제거
npm run clean
```

## 배포

[Expo Application Services (EAS)](https://expo.dev/eas)를 사용한 배포:

- [EAS Build](https://docs.expo.dev/build/introduction/) - 네이티브 빌드 생성
- [EAS Update](https://docs.expo.dev/eas-update/introduction/) - OTA 업데이트
- [EAS Submit](https://docs.expo.dev/submit/introduction/) - 앱스토어 제출

## 기여하기

기여를 환영합니다! 다음 단계를 따라주세요:

1. 프로젝트 포크
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성하거나 이메일로 연락해주세요.

---

HB Wallet을 사용해주셔서 감사합니다! 🚀