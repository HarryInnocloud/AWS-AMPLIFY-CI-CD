
import React from 'react';
import { render, waitFor, fireEvent} from '@testing-library/react-native';
import Home from './../components/Home';
import { NavigationContainer } from '@react-navigation/native';
import TextInputs from './../constants/texts.json';

// Mocking async storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

// Mocking ModalPopUp and Loader
jest.mock("../components/ModalPopUp", () => 'ModalPopUp');
jest.mock("../utils/Loader", () => 'Loader');

// Mocking Ionicons
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

// Mocking screen orientation
jest.mock('expo-screen-orientation', () => ({
  lockAsync: jest.fn(),
}));


const mockDataList = [
  {
    "staffNumber": 103,
    "staffFirstName": "A",
    "staffLastName": "B",
    "staffJobTitle": "Maths Teacher",
    "staffEmail": "hariprasad@innocloud.co.in",
    "attendanceClasses": [
      "6A",
      "7B",
      "8Z"
    ],
    "_links": {
      "self": {
        "href": "http://api.dev.infohash.co.uk/staffclass/6639dd51c749970b4f35e6e2"
      },
      "staffClass": {
        "href": "http://api.dev.infohash.co.uk/staffclass/6639dd51c749970b4f35e6e2"
      }
    }
  },
  {
    "staffNumber": 104,
    "staffFirstName": "A",
    "staffLastName": "B",
    "staffJobTitle": "Maths Teacher",
    "staffEmail": "hariprasad@innocloud.co.in",
    "attendanceClasses": [
      "6A",
      "7B",
      "8Z"
    ],
    "_links": {
      "self": {
        "href": "http://api.dev.infohash.co.uk/staffclass/6639dd51c749970b4f35e6e2"
      },
      "staffClass": {
        "href": "http://api.dev.infohash.co.uk/staffclass/6639dd51c749970b4f35e6e2"
      }
    }
  }
];

describe('Home component', () => {

  it('renders correctly', () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const { getByText } = render(
      <NavigationContainer>
        <Home navigation={navigation} />
      </NavigationContainer>
    );
    expect(getByText(TextInputs.MyAttendance)).toBeTruthy();
  });
  it('handles signout correctly', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <Home navigation={navigation} />
      </NavigationContainer>
    );

    const signOutButton = getByTestId('test-profile');
    fireEvent.press(signOutButton);

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('MyProfile');
    });
  });


  it('updates layout on orientation change', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, rerender } = render(
      <NavigationContainer>
        <Home navigation={navigation} />
      </NavigationContainer>
    );

    const Dimensions = require('react-native').Dimensions;

    // Simulate orientation change
    Dimensions.get = jest.fn().mockReturnValue({ width: 800, height: 600 });
    rerender(
      <NavigationContainer>
        <Home navigation={navigation} />
      </NavigationContainer>
    );

    expect(getByText(TextInputs.MyAttendance)).toBeTruthy();
  });

});
