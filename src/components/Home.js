import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import TextInputs from './../constants/texts.json';
import Colors from './../constants/colors.json';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'react-native';
import AttendanceList from './AttendanceList';
import { buttonList } from '../constants/testData';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './../constants/constants.json';
import ApiService from './../utils/Axios';
import Loader from '../utils/Loader';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

const baseUrl = process.env.EXPO_PUBLIC_TEACHERATTENDANCEAPI;
const resultCheck = process.env.EXPO_PUBLIC_ATTENDANCE_RESULT_CHECK;
const Home = ({ navigation }) => {

    const [darkMode, setDarkMode] = useState(true);
    const [isTablet, setIsTablet] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const [classData, setClassData] = useState(null);
    const [username, setUsername] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        setShowLoader(true);
        getUser();
        const updateLayout = () => {
            const { width, height } = Dimensions.get('window');
            setIsTablet(width >= 600);
            setIsLandscape(width > height);
        };

        updateLayout(); // Initial setup

        const subscription = Dimensions.addEventListener('change', updateLayout);

        return () => {
            subscription.remove();
        };
    }, []);
    useFocusEffect(
        useCallback(() => {
            setDataFetched(false);
            if (username) {
                getAttendanceData();
            }
        }, [username])
    );

    useEffect(() => {
        if (username) {
            getAttendanceData();
        }
    }, [username])

    const getUser = async () => {
        try {
            const data = await AsyncStorage.getItem(constants.signInDetails);
            if (data) {
                const parsedData = JSON.parse(data);
                setUsername(parsedData.loginId);
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }


    const getAttendanceData = async () => {
        try {
            setShowLoader(true);

            const token = await AsyncStorage.getItem(constants.idToken);
            const value = username;
            const data = await ApiService.get(`${baseUrl}${value}`, token);
            const staffDetails = data.data._embedded.staffclass[0]
            setClassData(staffDetails)
            checkAttendanceForCurrentDay(staffDetails);
            await AsyncStorage.setItem(constants.teacherDetails, JSON.stringify(staffDetails));
            setShowLoader(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            setClassData(buttonList)
            checkAttendanceForCurrentDay(buttonList);
            await AsyncStorage.setItem(constants.teacherDetails, JSON.stringify(buttonList));
            setShowLoader(false);
        }
    };

    const checkAttendanceForCurrentDay = async (staffDetails) => {
        const currentDate = moment();
        const formattedDate = currentDate.format('DD-MM-YYYY');

        const token = await AsyncStorage.getItem(constants.idToken);
        const data = await ApiService.get(`${resultCheck}${formattedDate}`, token);
        if (data.status === 200) {
            const specificEmail = username;
            if (data.data.message) {
                const transformedData = {
                    ...staffDetails,
                    attendanceClasses: staffDetails.attendanceClasses.map(className => ({
                        class: className,
                        am: false,
                        pm: false
                    }))
                };
                setClassData(transformedData)
                setDataFetched(true);
            } else {

                const filteredData = data.data._embedded.attendanceresult.filter(item => item.teacherEmail === specificEmail);
                const transformedData = {
                    ...staffDetails,
                    attendanceClasses: staffDetails.attendanceClasses.map(className => ({
                        class: className,
                        am: false,
                        pm: false
                    }))
                };

                for (let i = 0; i < transformedData.attendanceClasses.length; i++) {
                    for (let j = 0; j < filteredData.length; j++) {
                        if (filteredData[j].attendanceClass === transformedData.attendanceClasses[i].class) {
                            if (filteredData[j].amPm == "AM") {
                                transformedData.attendanceClasses[i].am = true;
                            }
                            if (filteredData[j].amPm == "PM") {
                                transformedData.attendanceClasses[i].pm = true;
                            }
                        }
                    }
                }
                setClassData(transformedData)
                setDataFetched(true);
            }
        }
    }


    const styles = StyleSheet.create({
        container: {
            paddingTop: StatusBar.currentHeight,
            flex: 1,
            backgroundColor: darkMode ? '#000' : '#fff',
            width: '100%',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: Colors.grey,
        },
        h1: {
            fontSize: 20,
            fontWeight: 'bold',
            color: Colors.white,
            marginBottom: 5,
            backgroundColor: Colors.grey,
            padding: 20,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
        },
        h3: {
            top: isLandscape ? -10 : -50,
            fontSize: 15,
            marginBottom: 20,
            color: darkMode ? '#fff' : '#000',
            opacity: 0.5
        },
        h5: {
            fontSize: 10,
            fontWeight: 'bold',
            marginBottom: 20,
            color: darkMode ? '#fff' : '#000',
            alignSelf: 'flex-end', // Align to the right
            opacity: 0.5
        },
        spacing: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },


        list: {
            marginLeft: 20, marginRight: -20
        }

    });

    handleSignout = async () => {
        navigation.navigate('MyProfile')
    }

    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.h1}>{TextInputs.MyAttendance}</Text>
                <View style={{ flex: 1, flexDirection: 'row-reverse', right: 20 }}>
                    <Pressable testID='test-profile' style={styles.sectionStyle} onPress={() => handleSignout()}>
                        <Ionicons name="person-outline" size={30} color="white" onPress={() => handleSignout()} />
                    </Pressable>
                </View>
            </View>
            {dataFetched ? <View style={styles.list}>
                <AttendanceList dataList={classData} />
            </View> : <Loader />}
        </View>
    );
};

export default Home;
