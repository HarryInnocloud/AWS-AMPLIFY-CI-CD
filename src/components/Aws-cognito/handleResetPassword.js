import { resetPassword } from 'aws-amplify/auth';

export default async function handleResetPassword({ email, navigation, setErrorMessage, setShowModal }) {
  try {

    const output = await resetPassword({ username: email });
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        navigation.navigate('ConfirmResetPassword')
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        );
        // Collect the confirmation code from the user and pass to confirmResetPassword.
        break;
      case 'DONE':
        console.log('Successfully reset password.');
        break;
    }
  } catch (error) {
    console.log(error);
    setErrorMessage(error.message);
    setShowModal(true);
  }
}
