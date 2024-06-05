import { sendUserAttributeVerificationCode } from 'aws-amplify/auth';

export default async function handleSendUserAttributeVerificationCode(key) {
  try {
    await sendUserAttributeVerificationCode({
      userAttributeKey: 'phone_number'
    });
  } catch (error) {
    console.log(error);
  }
}