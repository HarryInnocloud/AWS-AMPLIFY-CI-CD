
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import TextInputs from './../constants/texts.json'
import Colors from './../constants/colors.json'
import * as ScreenOrientation from 'expo-screen-orientation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './../constants/constants.json';
import ApiService from '../utils/Axios';


const baseUrl = process.env.EXPO_PUBLIC_ATTENDANCE_PHOTO_API_GATEWAY;

const PhotoScreen = ({ clickedImages, setPhotoArray, setShowPhotoScreen, route }) => {
    const { standard, section, selectedZone } = route.params;
    const navigation = useNavigation();

    const [darkMode, setDarkMode] = useState(true);
    const [isTablet, setIsTablet] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const [imageRows, setImageRows] = useState(clickedImages);

    useEffect(() => {
        // getAttendanceData();
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);

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

    const OpenCamera = () => {
        setShowPhotoScreen(false)
    }
    const handleDeleteImage = async (fileName) => {

        const newData = imageRows.filter(item => item.fileName !== fileName);
        const payload = imageRows.filter(item => item.fileName === fileName);
        setImageRows(newData);
        setPhotoArray(newData);

        const token = await AsyncStorage.getItem(constants.idToken);
        const currentDate = moment();
        const formattedDate = currentDate.format('DD-MM-YYYY');

        try {
            const data = await ApiService.delete(`${baseUrl}?attendance_class=${payload[0].attendance_class}&date=${payload[0].date}&am_pm=${payload[0].am_pm}&fileName=${payload[0].fileName}`, token);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCheckAttendance = () => {
        navigation.navigate('AttendanceReviewScreen', route.params);
    }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
        },
        rowContainer: {
            flexDirection: 'row',
            marginBottom: 20,
        },
        imageContainer: {
            margin: 10
        },
        previewImg: {
            height: 160,
            width: 160,
            borderRadius: 10,
            zIndex: -1,
        },
        deleteIcon: {
            position: 'absolute',
            top: 5,
            right: 5,
            zIndex: 1,
            backgroundColor: Colors.buttonColor,
            borderRadius: 20,
            padding: 5,
        },
        row: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        button: {
            backgroundColor: Colors.buttonColor,
            borderRadius: 12,
            padding: 10,
            width: '100%',
            textAlign: 'center',
            color: Colors.white,
            paddingLeft: 50,
            paddingRight: 50
        },
        buttonContainer: {
            flexDirection: 'row',
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center', // Add this line to center the container horizontally
        },
        cameraButton: {
            width: 'auto',
            padding: 10,
            borderColor: Colors.buttonColor,
            borderWidth: 1,
            borderRadius: 10,
            left: -10
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {imageRows.map((value, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Pressable onPress={() => handleDeleteImage(value.fileName)}>
                            <Ionicons name="close-outline" size={18} color={Colors.white} style={styles.deleteIcon} />
                        </Pressable>
                        <Image source={{ uri: value.fileContent }} style={styles.previewImg} />
                    </View>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.cameraButton} onPress={() => OpenCamera()}><Ionicons name="camera-outline" size={20} color={Colors.buttonColor} /></Pressable>
                <Pressable><Text testID='checkAttendance-btn' style={styles.button} onPress={() => handleCheckAttendance()}>{TextInputs.checkAttendance}</Text></Pressable>
            </View>
        </View>
    );
};

export default PhotoScreen;
