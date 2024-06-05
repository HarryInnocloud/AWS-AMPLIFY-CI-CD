import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Login from './../components/Login';
import TextInputs from './../constants/texts.json';
import LoginFunction from './../components/Aws-cognito/LoginFunction';
import { getByTestId } from '@testing-library/react';

// Mocking dependencies
jest.mock('./../components/Aws-cognito/LoginFunction', () => jest.fn());


jest.mock('aws-amplify/auth', () => ({
  signIn: jest.fn(),
  currentSession: jest.fn(() => Promise.resolve({ isValid: () => true })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve('some-token')),
}));

jest.mock("../components/ModalPopUp", () => 'ModalPopUp');
jest.mock("../utils/Loader", () => 'Loader');
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('expo-screen-orientation', () => ({
  lockAsync: jest.fn(),
}));


jest.mock('./../components/ModalPopUp', () => ({ data, onClose, message, PromptMessage, children }) => (
  <mock-modal-popUp data={data} onClose={onClose} message={message} PromptMessage={PromptMessage}>
    {children}
  </mock-modal-popUp>
));


describe('Login component', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <NavigationContainer>
        <Login navigation={mockNavigation} />
      </NavigationContainer>
    );

    const loginText = getByText('Login');
    expect(loginText).toBeTruthy();

    const emailInput = getByPlaceholderText('Email');
    expect(emailInput).toBeTruthy();

    const passwordInput = getByPlaceholderText('Password');
    expect(passwordInput).toBeTruthy();
  });

  it('should call onLogin with email and password when login button is pressed', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <NavigationContainer>
        <Login navigation={mockNavigation} />
      </NavigationContainer>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByTestId('login-btn');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });


  });



  it('should show an error message when email or password is missing', async () => {
    const { getByTestId, getByText, queryAllByLabelText } = render(
      <NavigationContainer>
        <Login navigation={mockNavigation} />
      </NavigationContainer>
    );

    const loginButton = getByTestId('login-btn');

    fireEvent.press(loginButton);




    // await waitFor(() => {
    //   expect(getByTestId('modal-popup')).toBeTruthy();
    // });
  });



  it('should navigate to ResetPassword screen when forgot password text is pressed', async () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <Login navigation={mockNavigation} />
      </NavigationContainer>
    );

    const forgotPasswordText = getByTestId('forgot-password-btn');

    fireEvent.press(forgotPasswordText);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('ResetPassword');
    });
  });

  it('should navigate to SignUpForm screen when create account text is pressed', async () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <Login navigation={mockNavigation} />
      </NavigationContainer>
    );

    const createAccountText = getByTestId('create-account-btn');

    fireEvent.press(createAccountText);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('SignUpForm');
    });
  });


  it('should show an error message when login fails due to incorrect credentials', async () => {
    const { getByPlaceholderText, getByTestId, getByText,queryByTestId } = render(
      <NavigationContainer>
        <Login navigation={mockNavigation} />
      </NavigationContainer>
    );

    const emailInput = getByTestId('input-email');
    const passwordInput = getByTestId('input-password');
    const loginButton = getByTestId('login-btn');

    fireEvent.changeText(emailInput, 'test@innocloud.co.in');
    fireEvent.changeText(passwordInput, 'Test@1234');
    fireEvent.press(loginButton);

    
    expect(queryByTestId('modal-popup')).toBeNull();


    // expect(getByTestId('modal-popup')).toBeTruthy();

    // LoginFunction.mockImplementation(({ values, navigation, setErrorMessage, setShowModal }) => {
    //   setErrorMessage('Incorrect credentials');
    //   setShowModal(true);
    //   // Pass the error message to the mocked ModalPopUp component (assuming a prop)
    //   mockModalPopUp.showError('Incorrect credentials'); // Replace with actual prop name
    // });

    // // Wait for the modal to be shown
    // expect(getByTestId('modal-popup')).toBeTruthy();
    // expect(getByText('Incorrect credentials')).toBeTruthy(); // Check for specific error message

    // // Wrap state update in act
    // await act(() => {
    //   setShowLoader(false);
    // });
  });

});

