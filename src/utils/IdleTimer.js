import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalPopUp from '../components/ModalPopUp';
import TextInputs from './../constants/texts.json'
import constants from './../constants/constants.json'

const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

const IdleTimer = () => {
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);


    const handleAppStateChange = async (nextAppState) => {

        if (nextAppState === 'active') {
            const lastActiveTime = await AsyncStorage.getItem('lastActiveTime');
            const accessToken = await AsyncStorage.getItem(constants.accessToken);
            if (accessToken) {
                const currentTime = new Date().getTime();
                updateLastActiveTime();
                if (lastActiveTime) {

                    const timeElapsed = currentTime - parseInt(lastActiveTime);
                    if (timeElapsed >= IDLE_TIMEOUT) {
                        setErrorMessage('User has been idle for more than 5 minutes, please Login again');
                        setShowModal(true);
                    }
                }
            }
        }
    };
    const updateLastActiveTime = async () => {
        await AsyncStorage.setItem('lastActiveTime', new Date().getTime().toString());
    };

    return (
        <ModalPopUp data={showModal} onClose={() => setShowModal(false)} message={errorMessage} PromptMessage={TextInputs.Ok} redirect={'Login'} />

    )
};

export default IdleTimer;
