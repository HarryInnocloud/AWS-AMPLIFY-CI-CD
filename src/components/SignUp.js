import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch, StyleSheet, Image, Dimensions, Platform, ScrollView } from 'react-native';
import handleSignUp from './Aws-cognito/SignUpFunction';
import TextInputs from './../constants/texts.json'
import Colors from './../constants/colors.json'
import * as ScreenOrientation from 'expo-screen-orientation';
import ModalPopUp from './ModalPopUp';
import Loader from '../utils/Loader';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SignUpForm({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phonenumber, setPhonenumber] = useState();
    const [darkMode, setDarkMode] = useState(true);
    const [isTablet, setIsTablet] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoader, setShowLoader] = useState(false);

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
        createaccount: {
            fontSize: 15,
            color: darkMode ? '#fff' : '#000',
            opacity: 0.5,
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
        },
        imageEyeStyle: {
            margin: 10,
            height: 12,
            width: 20,
            resizeMode: 'stretch',
            alignItems: 'center'
        },
    });

    useEffect(() => {
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

    const validatePhoneNumber = (phoneNumber) => {
        // Regular expression for a 10-digit phone number
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const signUp = async () => {
        setShowLoader(true);
        let isValid = true;
        if (email.trim() === "") {
            isValid = false;
            setShowModal(true);
            setErrorMessage(TextInputs.EntervalidEmailPassword);
        }
      

        const isValidPhone =  validatePhoneNumber(phonenumber);
        if(!isValidPhone){
            isValid = false;
            setShowModal(true);
            setErrorMessage(TextInputs.EntervalidPhone);
        }

        // Usage
        const isValidPhoneNumber = validatePhoneNumber('1234567890'); // true or false


        if (password.length < 5 || password !== confirmPassword) {
            isValid = false;
            setShowModal(true);
            setErrorMessage(TextInputs.PasswordsDoesntmatch);
        }
        const data = {
            username: email,
            password: password,
            email: email,
            phonenumber: phonenumber,
            given_name: firstName,
            family_name: lastName
        }
        if (isValid) {
            await handleSignUp({ data, navigation, setErrorMessage, setShowModal });
        }
        setShowLoader(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>{TextInputs.accountSignUp}</Text>
            <Text style={styles.h3}>{TextInputs.signuptocontinue}</Text>
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

                <View style={styles.sectionStyle}>
                    <Ionicons name="person-outline" size={25} color={Colors.white} style={styles.imageStyle} />

                    <TextInput
                        style={{
                            flex: 1, color: Colors.white, ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
                        }}
                        placeholder={TextInputs.firstname}
                        placeholderTextColor={darkMode ? '#ccc' : '#666'} // Example placeholder color based on dark mode state
                        value={firstName}
                        onChangeText={setFirstName}
                        underlineColorAndroid="transparent"
                    />

                </View>

                <View style={styles.sectionStyle}>
                    <Ionicons name="person-outline" size={25} color={Colors.white} style={styles.imageStyle} />

                    <TextInput
                        style={{
                            flex: 1, color: Colors.white, ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
                        }}
                        placeholder={TextInputs.lastname}
                        placeholderTextColor={darkMode ? '#ccc' : '#666'} // Example placeholder color based on dark mode state
                        value={lastName}
                        onChangeText={setLastName}
                        underlineColorAndroid="transparent"
                    />

                </View>
                <View style={styles.sectionStyle}>
                    <Ionicons name="call-outline" size={25} color={Colors.white} style={styles.imageStyle} />

                    <TextInput
                        style={{
                            flex: 1, color: Colors.white, ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
                        }}
                        placeholder={TextInputs.Phonenumber}
                        placeholderTextColor={darkMode ? '#ccc' : '#666'} // Example placeholder color based on dark mode state
                        value={phonenumber}
                        onChangeText={setPhonenumber}
                        underlineColorAndroid="transparent"
                        keyboardType="number-pad"
                        maxLength={10}
                    />

                </View>
                <View style={styles.sectionStyle}>
                    <Ionicons name="lock-closed-outline" size={25} color={Colors.white} style={styles.imageStyle} />

                    <TextInput
                        style={{
                            flex: 1, color: Colors.white, ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
                        }}
                        placeholder={TextInputs.password}
                        placeholderTextColor={darkMode ? '#ccc' : '#666'} // Example placeholder color based on dark mode state
                        value={password}
                        onChangeText={setPassword}
                        underlineColorAndroid="transparent"
                        secureTextEntry={!showPassword}

                    />

                </View>

                <View style={styles.sectionStyle}>
                    <Ionicons name="lock-closed-outline" size={25} color={Colors.white} style={styles.imageStyle} />

                    <TextInput
                        style={{
                            flex: 1, color: Colors.white, ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
                        }}
                        placeholder={TextInputs.Confirmpassword}
                        placeholderTextColor={darkMode ? '#ccc' : '#666'} // Example placeholder color based on dark mode state
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        underlineColorAndroid="transparent"
                        secureTextEntry={!showPassword}

                    />

                </View>
                <Text testID='sigup-btn' style={styles.button} onPress={signUp}
                >{TextInputs.Signup}</Text>

                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.createaccount} onPress={() => navigation.navigate('Login')}>{TextInputs.backtologin}</Text>
                </View>
            </View>
            {showLoader && <Loader />}
            <ModalPopUp data={showModal} onClose={() => setShowModal(false)} message={errorMessage} PromptMessage={TextInputs.Ok} />
        </View>
    );
}
