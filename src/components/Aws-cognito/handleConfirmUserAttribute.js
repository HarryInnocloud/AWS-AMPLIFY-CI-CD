import { confirmUserAttribute } from 'aws-amplify/auth';

export default async function handleConfirmUserAttribute({
  data, navigation, setErrorMessage, setShowModal
}) {
  try {
    await confirmUserAttribute({ userAttributeKey: data.userAttributeKey, confirmationCode: data.confirmationCode });
    setErrorMessage('Phone number Verified');
    setShowModal(true);
    return true;

  } catch (error) {
    setErrorMessage(error.message);
    setShowModal(true);
    console.log(error);
  }
}