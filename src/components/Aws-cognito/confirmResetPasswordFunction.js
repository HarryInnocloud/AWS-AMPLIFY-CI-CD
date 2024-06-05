import { confirmResetPassword } from 'aws-amplify/auth';
import TextInputs from './../../constants/texts.json'

export default async function handleConfirmResetPassword({
  data, navigation, setErrorMessage, setShowModal
}) {
  try {
    await confirmResetPassword({ username: data.username, confirmationCode: data.confirmationCode, newPassword: data.newPassword });

    setErrorMessage(TextInputs.Passwordresetsuccess);
    setShowModal(true);
    navigation.navigate('Login');
  } catch (error) {
    console.log(error);
    setErrorMessage(error.message);
    setShowModal(true);
  }
}