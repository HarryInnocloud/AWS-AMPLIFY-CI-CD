import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'aws-amplify/auth';
import constants from './../../constants/constants.json'

export default async function handleSignOut({navigation}) {
  try {
    await signOut({ global: true });
    await AsyncStorage.removeItem(constants.accessToken);
    await AsyncStorage.removeItem(constants.idToken);
    await AsyncStorage.removeItem(constants.tokens);
    await AsyncStorage.removeItem(constants.userId);
    await AsyncStorage.removeItem(constants.username);
    await AsyncStorage.removeItem(constants.signInDetails);
    await AsyncStorage.removeItem(constants.userDetails);
    navigation.navigate('Login'); // Navigate to the Login screen

  } catch (error) {
    console.log('error signing out: ', error);
  }
}