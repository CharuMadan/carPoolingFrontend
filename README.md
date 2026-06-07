# Car Pooling App

A React Native application built with Expo and TypeScript for car pooling services.

## Features

- Cross-platform support (iOS, Android, Web)
- Built with React Native and Expo
- TypeScript for type safety
- ESLint for code quality
- Bottom tab navigation
- User-friendly interface

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

### Running on Different Platforms

- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

## Project Structure

```
carpooling/
├── src/
│   ├── screens/       # Screen components
│   └── components/    # Reusable components
├── App.tsx           # Main app component
├── app.json          # Expo configuration
├── tsconfig.json     # TypeScript configuration
├── babel.config.js   # Babel configuration
└── package.json      # Dependencies and scripts
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests

## Development

### Type Checking

Run TypeScript compiler to check for type errors:
```bash
npm run type-check
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Next Steps

1. Update app configuration in `app.json`
2. Add more screens in `src/screens/`
3. Create reusable components in `src/components/`
4. Implement navigation logic
5. Add API integration

## License

MIT
