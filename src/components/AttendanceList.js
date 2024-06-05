import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, Button, Pressable } from 'react-native';
import Colors from './../constants/colors.json';
import TextInputs from './../constants/texts.json';
import { useNavigation } from '@react-navigation/native';
import ModalPopUp from './ModalPopUp';

export const AttendanceButton = ({ number, data, style, selectedZone, onChangeTime, onTakeAttendance }) => {

    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const handleChangeTime = (time, type) => {
        if (type) {
            setShowModal(true);
            setErrorMessage(TextInputs.AttendanceRecordedAlready)
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        } else {
            setShowModal(false);
            onChangeTime(time);

        }
    };

    const handleTakeAttendanceBtn = (standard, section) => {
        // onTakeAttendance(event)
        const data = {
            selectedZone: selectedZone,
            standard: standard,
            section: section
        }
        navigation.navigate('CameraScreen', data);
    }

    return (
        <View style={[style.attendanceButtonContainer, selectedZone ? { backgroundColor: Colors.greyHighlight } : null]}>

            <View style={style.border}>
                <Text testID={`standard-${number}`} style={style.attendanceTime}>{data.standard}</Text>
                <Text testID={`section-${number}`} style={style.attendanceTime}>{data.section}</Text>
            </View>
            <View style={style.container}>
                <View style={style.timeContainer}>

                    <Pressable style={[style.timeBorder, selectedZone === 'AM' ? style.selectedTimezone : null]} onPress={() => handleChangeTime('AM', data.am)}>
                        <Text testID={`button-am-${number}`} style={style.timezoneAm} onPress={() => handleChangeTime('AM', data.am)}>{'AM'}</Text>
                    </Pressable>
                    <Pressable style={[style.timeBorder, selectedZone === 'PM' ? style.selectedTimezone : null]} onPress={() => handleChangeTime('PM', data.pm)}>
                        <Text testID={`button-pm-${number}`} style={style.timezonePm} onPress={() => handleChangeTime('PM', data.pm)}>{'PM'}</Text>
                    </Pressable>
                </View>
                <Pressable
                    disabled={!selectedZone}
                    style={[style.attendanceButton, style.fullWidth, selectedZone ? null : style.disabledButton]}
                    onPress={() => handleTakeAttendanceBtn(data.standard, data.section)}
                >
                    <Text testID={`attendance-btn-${number}`} style={{ color: Colors.white, textAlign: 'center' }} >{TextInputs.takeattendance}</Text>
                </Pressable>
            </View>
            <ModalPopUp data={showModal} onClose={() => setShowModal(false)} message={errorMessage} PromptMessage={TextInputs.Ok}  />
        </View>
    );
};



const AttendanceList = ({ dataList }) => {
    const [selectedZone, setSelectedZone] = useState({});
    const [attendanceListData, setAttendanceListData] = useState(dataList.attendanceClasses);
    const classDetails = attendanceListData.map((item) => {
        const matches = item.class.match(/^(\d+)([A-Z])$/);
        if (matches) {
            const [, standard, section] = matches;
            return { standard, section, am: item.am, pm: item.pm };
        }
        return null;
    }).filter(Boolean);


    const styles = StyleSheet.create({
        disabledButton: { backgroundColor: Colors.disabledColor, color: Colors.white },
        attendanceButtonContainer: {
            flexDirection: 'row',
            width: '90%',
            paddingHorizontal: 10,
            paddingVertical: 15,
            backgroundColor: Colors.grey,
            borderRadius: 5,
            marginTop: 15,
            alignItems: 'center',
        },
        attendanceTime: {
            fontSize: 20,
            color: Colors.white,
            fontWeight: "600",
        },

        timezoneAm: {
            fontSize: 10,
            color: Colors.white,
        },
        timezonePm: {
            fontSize: 10,
            color: Colors.white,
        },
        selectedTimezone: {
            backgroundColor: Colors.AccentColor,
            borderWidth: 1,
        },
        border: {
            borderWidth: 1,
            borderRadius: 5,
            borderColor: Colors.white,
            padding: 25,
            left: 12,
            marginRight: 30,
            borderWidth: 0.1,
            alignItems: 'center'
        },
        timeborder: {
            borderRadius: 5,
            borderColor: Colors.white,
            padding: 2,
            borderWidth: 0.1,
            alignItems: 'center'
        },
        scrollView: {
            overflowY: 'scroll',
            marginBottom: 80,
        },
        container: {
            width: "100%",
        },
        timeContainer: {
            width: "60%",
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 10,
        },
        timeBorder: {
            borderWidth: 0.1,
            borderRadius: 3,
            borderColor: Colors.white,
            paddingHorizontal: 30,
            paddingVertical: 15,
            marginHorizontal: 5,
            width: 'auto'
        },
        attendanceButton: {
            backgroundColor: Colors.buttonColor,
            borderRadius: 12,
            padding: 10,
            textAlign: 'center',
            color: Colors.white,
        },
        fullWidth: {
            width: '60%',
        },
        errMessage: {
            color: Colors.red,
            fontSize: 12,
            margin: 5
        }
    });

    const handleSetSelectedZone = (buttonIndex, time) => {
        const newSelectedZone = { ...selectedZone };
        Object.keys(newSelectedZone).forEach((key) => {
            if (key !== buttonIndex.toString()) {
                delete newSelectedZone[key];
            }
        });
        newSelectedZone[buttonIndex] = time;
        setSelectedZone(newSelectedZone);
    };

    return (
        <ScrollView style={styles.scrollView}>
            {classDetails.map((button, index) => (
                <AttendanceButton number={index} key={index} data={button} style={styles} selectedZone={selectedZone[index]}
                    onChangeTime={(time) => handleSetSelectedZone(index, time)} onTakeAttendance={selectedZone}
                />
            ))}
        </ScrollView>
    );
};

export default AttendanceList;