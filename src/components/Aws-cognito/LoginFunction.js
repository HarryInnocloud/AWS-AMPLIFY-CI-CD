import { signIn } from 'aws-amplify/auth';
import currentAuthenticatedUser from './getCurrentUser';
import currentSession from './getUserSession';
import TextInputs from './../../constants/texts.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import handleFetchUserAttributes from './handleFetchUserAttributes';
import constants from './../../constants/constants.json'
export default async function LoginFunction({ values, navigation, setErrorMessage, setShowModal }) {
    try {
        const { isSignedIn, nextStep, username } = await signIn({
            username: values.username, password: values.password, options: {
                authFlowType: "USER_PASSWORD_AUTH",
            },
        });
        if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
            setErrorMessage(TextInputs.PleaseVerifyEmail);
            setShowModal(true);
        } else
            if (isSignedIn) {

                const currentUser = await currentAuthenticatedUser();
                const tokens = await currentSession();
                const userdata = await handleFetchUserAttributes();
                AsyncStorage.setItem('lastActiveTime', new Date().getTime().toString());
                AsyncStorage.setItem(constants.userDetails, JSON.stringify(userdata));
                navigation.navigate('Home'); // Navigate to the Home screen

            }

    } catch (error) {
        console.log('error signing in', error);

        if (error.name === "UserAlreadyAuthenticatedException") {
            setErrorMessage(error.message);
            setShowModal(true);
            navigation.navigate('Home'); // Navigate to the Home screen
        } else {
            setErrorMessage(error.message);
            setShowModal(true);
        }

    }
}