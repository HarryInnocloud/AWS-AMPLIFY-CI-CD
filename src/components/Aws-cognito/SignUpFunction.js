import { signUp, } from 'aws-amplify/auth';
import TextInputs from './../../constants/texts.json'
export default async function handleSignUp({ data, setErrorMessage, setShowModal, navigation }) {
    try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
            username: data.username,
            password: data.password,
            options: {
                userAttributes: {
                    email: data.email,
                    phone_number: `+91${data.phonenumber}`, // E.164 number convention
                    given_name: data.given_name,
                    family_name: data.family_name
                },
                autoSignIn: true
            }
        });
        setErrorMessage(TextInputs.VerificationLinksent);
        setTimeout(() =>
            navigation.navigate('Login'), 3000
        )


    } catch (error) {
        setErrorMessage(error.message);
        setShowModal(true);
        console.log('error signing up:', error);
    }
}