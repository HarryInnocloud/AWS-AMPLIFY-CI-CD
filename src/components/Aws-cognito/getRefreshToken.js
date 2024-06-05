import { fetchAuthSession } from 'aws-amplify/auth';
import constants from './../../constants/constants.json'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getRefreshToken() {
  try {
    const { tokens } = await fetchAuthSession({ forceRefresh: true });
    await AsyncStorage.setItem(constants.accessToken, JSON.stringify(tokens.accessToken));
    await AsyncStorage.setItem(constants.idToken, JSON.stringify(tokens.idToken));
  } catch (err) {
    console.log(err);
  }
}