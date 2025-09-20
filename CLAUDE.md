# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HB Wallet is a React Native crypto wallet application built with Expo. It enables users to manage VEST tokens on the Ethereum Sepolia testnet, with features for sending, receiving, and viewing token balances.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run on specific platforms
npm run ios      # iOS simulator (Mac only)
npm run android  # Android emulator
npm run web      # Web browser

# Clean project
npm run clean    # Removes .expo and node_modules directories
```

## Architecture Overview

### Core Technologies
- **Framework**: React Native with Expo (SDK 53)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context API (`wallet-context.ts`)
- **Blockchain Integration**: Dynamic Labs SDK with Viem extension
- **UI Components**: Custom components based on React Native Reusables

### Project Structure
```
app/              # Screen components (Expo Router pages)
├── _layout.tsx   # Root layout with global providers
├── index.tsx     # Entry point - wallet connection
├── home-screen.tsx      # Main wallet view with balance
├── send-screen.tsx      # Send tokens interface
├── request-screen.tsx   # Request tokens (QR generation)
├── qr-scaner-screen.tsx # QR code scanner
└── send-result-screen.tsx # Transaction result display

components/ui/    # Reusable UI components
lib/             # Utility functions and services
├── dynamic-utils.ts # Dynamic Labs wallet utilities
├── rpc.ts          # API calls (price fetching)
├── vest.ts         # VEST token specific functions
└── utils.ts        # General utilities

config/const.ts   # Global constants and configuration
context/wallet-context.ts # Global wallet state management
```

### Key Architectural Decisions

1. **Dynamic Labs Integration**: The app uses Dynamic Labs for wallet connection and management. The client is initialized in `_layout.tsx` with environment-specific configuration.

2. **Token Contract**: VEST token operations use a custom ERC20 contract on Sepolia testnet (address: `0x373280fc29834E414611b49349AC31b1F9B6008d`).

3. **State Management**: Wallet state (address, balance, etc.) is managed globally via React Context, accessible through the `useCtxWallet` hook.

4. **Navigation Flow**: 
   - Entry (`index.tsx`) → Wallet connection
   - Success → Home screen with balance display
   - Actions → Send/Request screens with QR code support

5. **Styling Approach**: Uses NativeWind for consistent Tailwind-based styling across platforms. The `cn()` utility from `lib/utils.ts` handles conditional class names.

## Important Configuration

### Network Configuration (`config/const.ts`)
- Chain ID: 11155111 (Sepolia)
- RPC: https://eth-sepolia.public.blastapi.io
- Token Contract: 0x373280fc29834E414611b49349AC31b1F9B6008d
- Token Decimals: 18

### Dynamic Labs Setup
- Environment ID: f64062d1-3582-46f3-848a-ab7cd8ed81df
- Extensions: ReactNativeExtension, ViemExtension
- Custom EVM network configuration for Sepolia

## Key Patterns

1. **Async Balance Updates**: Balance fetching uses the `updateBalance` callback pattern to sync with blockchain state.

2. **QR Code Integration**: The app supports both QR generation (for receiving) and scanning (for sending) with deep linking support.

3. **Transaction Flow**: Send operations validate input, parse amounts with proper decimals, execute via Dynamic Labs, and navigate to result screen.

4. **Error Handling**: Transaction errors are caught and displayed through the result screen with success/failure states.

5. **Price Display**: Market price fetching is implemented but currently returns mock data (1523.62) from `lib/rpc.ts`.

## Development Notes

- The project uses TypeScript with strict mode enabled
- Path alias `@/` maps to the project root
- Expo Router handles all navigation and deep linking
- The app supports iOS, Android, and Web platforms
- Uses React Native's New Architecture