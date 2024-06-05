import { confirmResetPassword } from 'aws-amplify/auth';

async function handleConfirmResetPassword({
  username,
  confirmationCode,
  newPassword
}) {
  try {
    await confirmResetPassword({ username, confirmationCode, newPassword });
  } catch (error) {
    console.log(error);
  }
}