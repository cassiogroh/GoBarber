import React from 'react';
import { render } from 'react-native-testing-library';

import SignIn from '../../pages/SignIn';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
  };
});

describe('SignIn page', () => {
  it('should contain e-mail/password inputs', () => {
    const { getByPlaceholder } = render(<SignIn />);

    expect(getByPlaceholder('E-mail')).toBeTruthy();
    expect(getByPlaceholder('Senha')).toBeTruthy();
  });
});

// example getByTestId:  testID="login-image"

// yarn add react-native-testing-library -D
// yarn add @testing-library/jest-native -D
// create setupTests.ts on src
// add to package.json -> jest:
// "setupFilesAfterEnv": ["@testing-library/jest-native/extend-expect"],
// "setupFiles": [
//   "./src/setupTests.ts",
//   "./node_modules/react-native-gesture-handler/jestSetup.js"
// ],
// "collectCoverageFrom": "copy + paste"

// yarn test --watchAll true --coverage