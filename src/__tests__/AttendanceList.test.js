import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AttendanceList, { AttendanceButton } from './../components/AttendanceList';
import { NavigationContainer } from '@react-navigation/native';



const dataList = {
    "_links": {
        "self": {
            "href": "http://api.dev.infohash.co.uk/staffclass/664afb7ac749970b4f35e6e5"
        },
        "staffClass": {
            "href": "http://api.dev.infohash.co.uk/staffclass/664afb7ac749970b4f35e6e5"
        }
    },
    "attendanceClasses": [
        {
            "am": false,
            "class": "6A",
            "pm": false
        },
        {
            "am": false,
            "class": "7B",
            "pm": false
        },
        {
            "am": false,
            "class": "8C",
            "pm": false
        }
    ],
    "staffEmail": "hariprasad@innocloud.co.in",
    "staffFirstName": "Hariprasad",
    "staffJobTitle": "Maths Teacher",
    "staffLastName": "7B",
    "staffNumber": 104
};



describe('AttendanceButton', () => {
    test('renders correctly', () => {
      const { getByText } = render(
        <NavigationContainer>
        <AttendanceButton
            number={0} // Example number value, make sure it's a number
            data={{ standard: '6A', section: 'A', am: false, pm: false }}
            style={{}}
            selectedZone={null}
            onChangeTime={() => {}}
            onTakeAttendance={() => {}}
        />
        </NavigationContainer>
    );
    

        expect(getByText('6A')).toBeTruthy();
        expect(getByText('A')).toBeTruthy();
        expect(getByText('AM')).toBeTruthy();
        expect(getByText('PM')).toBeTruthy();
        expect(getByText('Take Attendance')).toBeTruthy();
    });

    test('handles change time correctly', () => {
        const onChangeTimeMock = jest.fn();
        const { getByTestId } = render(
          <NavigationContainer>
            <AttendanceButton
                number={0}
                data={{ standard: '6', section: 'A', am: false, pm: false }}
                style={{}}
                selectedZone={null}
                onChangeTime={onChangeTimeMock}
                onTakeAttendance={() => {}}
            />
            </NavigationContainer>
        );

        fireEvent.press(getByTestId('button-am-0'));
    });
});

describe('AttendanceList', () => {
    test('renders correctly', () => {
      
        const { getByTestId } = render(<NavigationContainer><AttendanceList dataList={dataList} /></NavigationContainer>);

        expect(getByTestId('standard-0')).toBeTruthy();
        expect(getByTestId('section-0')).toBeTruthy();


        expect(getByTestId('button-am-0')).toBeTruthy();
        expect(getByTestId('button-pm-0')).toBeTruthy();

        expect(getByTestId('attendance-btn-0')).toBeTruthy();
        expect(getByTestId('attendance-btn-1')).toBeTruthy();

    });
});
