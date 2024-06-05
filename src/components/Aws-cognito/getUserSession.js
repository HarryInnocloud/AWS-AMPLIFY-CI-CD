import { fetchAuthSession } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './../../constants/constants.json'

export default async function currentSession() {
    try {

        const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
        await AsyncStorage.setItem(constants.accessToken, accessToken.toString());
        await AsyncStorage.setItem(constants.idToken, idToken.toString());
        await AsyncStorage.setItem(constants.phonenumberstatus, JSON.stringify(idToken.payload.phone_number_verified));

    } catch (err) {
        console.log(err);
    }
}