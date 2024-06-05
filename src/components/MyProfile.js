import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, Image, Dimensions, Pressable, Platform } from 'react-native';
import TextInputs from './../constants/texts.json'
import Colors from './../constants/colors.json'
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'react-native';
import handleSignOut from './Aws-cognito/SignOutFuntion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './../constants/constants.json'
import ModalPopUp from './ModalPopUp'

import Ionicons from '@expo/vector-icons/Ionicons';
import handleSendUserAttributeVerificationCode from './Aws-cognito/handleSendUserAttributeVerificationCode';
import handleConfirmUserAttribute from './Aws-cognito/handleConfirmUserAttribute';
import Loader from '../utils/Loader';
import handleUpdateAttributes from './Aws-cognito/handleUpdateAttributes';
import handleFetchUserAttributes from './Aws-cognito/handleFetchUserAttributes';

const MyProfile = ({ navigation }) => {

    const [darkMode, setDarkMode] = useState(true);
    const [isTablet, setIsTablet] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const [phonenumberStatus, setPhonenumberStatus] = useState(false);
    const [showOTPField, setShowOTPField] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [userDetails, setuserDetails] = useState({});
    const [showLoader, setShowLoader] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        getUserDetails();
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

    const handleEdit = () => {
        setEditMode(!editMode);
    }
    const styles = StyleSheet.create({
        sectionStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 0.1,
            borderColor: '#fff',
            height: 50,
            borderRadius: 3,
            marginBottom: 25,
            width: '60%'
        },

        updateFields: {
            borderWidth: 1,
            borderColor: '#fff',
            height: 50,
            borderRadius: 3,
            marginRight: 25,
            color: '#fff',
            width: '60%'
        },
        imageStyle: {
            padding: 10,
        },
        container: {
            paddingTop: StatusBar.currentHeight,
            flex: 1,
            backgroundColor: darkMode ? '#000' : '#fff',
            width: '100%',
        },
        button: {
            backgroundColor: Colors.buttonColor,
            borderRadius: 12,
            padding: 10,
            width: 'auto',
            textAlign: 'center',
            color: Colors.white,
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center'
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
        rowContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginBottom: 25,
        },
        label: {
            marginRight: 10,
            flex: 1,
            textAlign: 'left',
            color: Colors.white,
        },
        value: {
            flex: 2,
            textAlign: 'left',
            color: Colors.white,
            borderBottomColor: Colors.white,
        },
        clickToVerify: {
            flex: 2,
            color: Colors.white,
            borderBottomColor: Colors.white,
            color: Colors.white,
            textDecorationLine: 'underline',
            opacity: 0.7,
            top: -20
        },
    });

    signOut = async () => {
        setShowLoader(true);
        await handleSignOut({ navigation });
        setShowLoader(false);
    }

    sendOtpcode = async () => {
        setShowLoader(true);
        const key = 'phone_number'
        await handleSendUserAttributeVerificationCode({ key });
        setShowOTPField(true);
        setShowLoader(false);
    }

    verifyPhoneNumber = async () => {
        setShowLoader(true);
        const key = 'phone_number'
        const data = {
            userAttributeKey: key, confirmationCode: confirmationCode
        }
        const result = await handleConfirmUserAttribute({ data, navigation, setErrorMessage, setShowModal })
        if (result) {
            setShowOTPField(false);
            setPhonenumberStatus(true);
        }
        setConfirmationCode('');
        setShowLoader(false);
    }

    updateAddress = async () => {
        setShowLoader(true);
        var address = userDetails.address
        await handleUpdateAttributes({ address });
        setShowLoader(false);
        setEditMode(false);

    }

    getUserDetails = async () => {

        setShowLoader(true);
        var userDataLocal = await handleFetchUserAttributes();
        const parsedUserData = userDataLocal;
        setuserDetails(parsedUserData);
        setPhonenumberStatus(parsedUserData.phone_number_verified);
        if (parsedUserData.phone_number_verified == "false") {
            setPhonenumberStatus(false);
        }
        if (parsedUserData.phone_number_verified == "true") {
            setPhonenumberStatus(true);
        }
        setShowLoader(false);

    }

    closeEdit = async () => {
        getUserDetails();
        setEditMode(false);
    }
    closeOTP = async () => {
        getUserDetails();
        setShowOTPField(false);
    }
    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.h1}> <Ionicons name="arrow-back-outline" size={30} color="white" onPress={() => navigation.navigate('Home')} />{TextInputs.MyProfile}</Text>
            </View>

            <View style={styles.rowContainer}>
                <Text style={styles.label}>{TextInputs.email} </Text>
                <Text style={styles.value}>{userDetails.email}</Text>
            </View>

            <View style={styles.rowContainer}>
                <Text style={styles.label}>{TextInputs.firstname} </Text>
                <Text style={styles.value}>{userDetails.given_name}</Text>
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.label}>{TextInputs.lastname} </Text>
                <Text style={styles.value}>{userDetails.family_name}</Text>
            </View>
            <View>
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>{TextInputs.Phonenumber} </Text>
                    <Text style={styles.value}>{userDetails.phone_number}
                        {phonenumberStatus ? <Ionicons name="checkmark-circle-outline" size={15} color={Colors.green} style={styles.imageStyle} /> :
                            <Ionicons name="close-circle-outline" size={15} color={Colors.red} style={styles.imageStyle}
                            />
                        }
                    </Text>

                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.label}></Text>
                    {!phonenumberStatus && !showOTPField &&<Text style={styles.clickToVerify} onPress={() => sendOtpcode()}>{TextInputs.verifyphonenumber} </Text>}
                </View>

            </View>

            <View style={styles.rowContainer}>
                <Text style={styles.label}>{TextInputs.address} {!editMode && <Ionicons name="create-outline" size={15} color={Colors.white} style={styles.imageStyle} onPress={handleEdit} />}</Text>
                {editMode ? (
                    <TextInput
                        placeholder={TextInputs.address}
                        style={styles.updateFields}
                        value={userDetails.address}
                        onChangeText={(text) => setuserDetails({ ...userDetails, address: text })}
                        multiline={true}
                    />
                ) : (
                    <Text style={styles.value}>{userDetails.address}</Text>
                )}

            </View>
            {editMode && (
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text testID='verify-phone-btn' style={styles.button} onPress={() => updateAddress()}>{TextInputs.updateaddress}</Text>
                        <Text testID='close-btn' style={styles.button} onPress={() => closeEdit()}>{TextInputs.close}</Text>
                    </View>
                </View>
            )}

            {showOTPField &&
                <View>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <View style={styles.sectionStyle}>
                            <Ionicons name="mail-outline" size={25} color={Colors.white} style={styles.imageStyle} />
                            <TextInput
                                style={{
                                    flex: 1, color: Colors.white, ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
                                }}
                                placeholder={TextInputs.verificationCode}
                                placeholderTextColor={darkMode ? '#ccc' : '#666'} // Example placeholder color based on dark mode state
                                value={confirmationCode}
                                onChangeText={setConfirmationCode}
                                underlineColorAndroid="transparent"
                                inputMode="numeric"

                            />

                        </View>

                    </View>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text testID='verify-phone-btn' style={styles.button} onPress={() => verifyPhoneNumber()}>{TextInputs.verify}</Text>
                            <Text testID='close-btn' style={styles.button} onPress={() => closeOTP()}>{TextInputs.close}</Text>
                        </View>
                    </View>
                </View>
            }


            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text testID='logout-btn' style={styles.button} onPress={() => signOut()}>{TextInputs.Logout}</Text>
            </View>
            {showLoader && <Loader />}
            <ModalPopUp data={showModal} onClose={() => setShowModal(false)} message={errorMessage} PromptMessage={TextInputs.Ok} />

        </View >
    );
};

export default MyProfile;
