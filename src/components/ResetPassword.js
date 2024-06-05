import React, { useState, useEffect } from 'react';
import { Button, View, Text, TextInput, Pressable, Switch, StyleSheet, Image, Dimensions, Platform, ScrollView } from 'react-native';
import TextInputs from './../constants/texts.json'
import Colors from './../constants/colors.json'
import * as ScreenOrientation from 'expo-screen-orientation';
import ModalPopUp from './ModalPopUp'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../utils/Loader';
import Ionicons from '@expo/vector-icons/Ionicons';
import handleResetPassword from './Aws-cognito/handleResetPassword';

const ResetPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [darkMode, setDarkMode] = useState(true);
    const toggleDarkMode = () => setDarkMode((prev) => !prev);
    const [isTablet, setIsTablet] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        authenticationStatus();
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    }, []);

    useEffect(() => {
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


    const authenticationStatus = async () => {
        var accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
            navigation.navigate('Home')
        }
    }

    const handleLogin = async () => {
        onLogin(email, password)
    };

    const onLogin = async (email, password) => {
        setShowLoader(true);
        let isValid = true;
        if (!email) {

            isValid = false;
            setShowModal(true);
            setErrorMessage(TextInputs.EntervalidEmailPassword);
            setShowLoader(false);
            return;
        } else {
            setShowModal(false)
        }
        if (isValid) {
            await handleResetPassword({ email, navigation, setErrorMessage, setShowModal });
        }
        setShowLoader(false);

    }
    const styles = StyleSheet.create({

        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: darkMode ? '#000' : '#fff',
        },
        h1: {
            fontSize: 30,
            top: isLandscape ? -10 : -50,
            fontWeight: 'bold',
            color: Colors.AccentColor,
            marginBottom: 5,
        },
        h3: {
            top: isLandscape ? -10 : -50,
            fontSize: 15,
            marginBottom: 20,
            color: darkMode ? '#fff' : '#000',
            opacity: 0.5
        },
        createaccount: {
            fontSize: 15,
            color: darkMode ? '#fff' : '#000',
            opacity: 0.5,
        },
        h5: {
            fontSize: 10,
            fontWeight: 'bold',
            marginBottom: 20,
            color: darkMode ? '#fff' : '#000',
            alignSelf: 'flex-end', // Align to the right
            opacity: 0.5
        },
        message: {
            // top: 20,
            fontSize: 12,
            // marginBottom: 20,
            color: darkMode ? '#fff' : '#000',
            alignItems: 'center',
            color: '#f24949'
        },


        inputContainer: {
            width: isTablet ? '40%' : '85%'
        },
        button: {
            backgroundColor: Colors.buttonColor,
            borderRadius: 12,
            padding: 10,
            // top: 20,
            textAlign: 'center',
            color: Colors.white,
            marginBottom: 20
        },
        darkModeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
        },
        darkModeText: {
            marginRight: 10,
            color: darkMode ? '#fff' : '#333', // Example dark mode text color based on dark mode state
        },
        sectionStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 0.1,
            borderColor: '#fff',
            height: 50,
            borderRadius: 3,
            marginBottom: 25,
        },
        imageStyle: {
            padding: 10,
            // margin: 10,
            // height: 20,
            // width: 20,
            // resizeMode: 'stretch',
            // alignItems: 'center',
        },
        imageEyeStyle: {
            margin: 10,
            height: 12,
            width: 20,
            resizeMode: 'stretch',
            alignItems: 'center'
        },
    });

    const toggleShowPassword = (hide) => {
        setShowPassword(!hide);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>{TextInputs.accountLogin}</Text>
            <Text style={styles.h3}>{TextInputs.ResetPassword}</Text>
            <View style={styles.inputContainer}>
                <View style={styles.sectionStyle}>
                    <Ionicons name="mail-outline" size={25} color={Colors.white} style={styles.imageStyle} />
                    <TextInput
                        style={{
                            flex: 1, color: Colors.white, ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
                        }}
                        placeholder={TextInputs.email}
                        placeholderTextColor={darkMode ? '#ccc' : '#666'} // Example placeholder color based on dark mode state
                        value={email}
                        onChangeText={setEmail}
                        underlineColorAndroid="transparent"

                    />

                </View>

                <Text testID='ResetPassword-btn' style={styles.button} onPress={handleLogin}>{TextInputs.ResetPassword}</Text>

                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.createaccount} onPress={() => navigation.navigate('SignUpForm')}>{TextInputs.backtologin}</Text>
                </View>
            </View>
            {showLoader && <Loader />}
            <ModalPopUp data={showModal} onClose={() => setShowModal(false)} message={errorMessage} PromptMessage={TextInputs.Ok} />
        </View>
    );
};

export default ResetPassword;
