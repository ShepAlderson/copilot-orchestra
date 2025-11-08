# React Native Integration Guide

Quick integration guide for React Native with Orchestra.

## Setup
```bash
npx react-native init MyApp
cd MyApp
npm install --save-dev @testing-library/react-native jest
```

## Testing
```javascript
import { render, fireEvent } from '@testing-library/react-native';
import MyScreen from './MyScreen';

test('renders correctly', () => {
  const { getByText } = render(<MyScreen />);
  expect(getByText('Welcome')).toBeTruthy();
});
```

## Pattern: Screen Development
- Phase 1: Component structure and navigation tests
- Phase 2: UI implementation and styling
- Phase 3: API integration and state management

Resources: [React Native](https://reactnative.dev/) | [Testing Library](https://callstack.github.io/react-native-testing-library/)
