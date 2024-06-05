import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from 'aws-amplify/auth';
import constants from './../../constants/constants.json'

export default async function currentAuthenticatedUser() {
  try {

    const { username, userId, signInDetails } = await getCurrentUser();
    await AsyncStorage.setItem(constants.username, username);
    await AsyncStorage.setItem(constants.userId, userId);
    await AsyncStorage.setItem(constants.signInDetails, JSON.stringify(signInDetails));
  } catch (err) {
    console.log(err);
  }
}