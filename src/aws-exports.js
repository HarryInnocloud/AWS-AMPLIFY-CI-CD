import { Amplify } from 'aws-amplify';

const identityPoolId = process.env.EXPO_PUBLIC_IDENTITY_POOL_ID;
const region = process.env.EXPO_PUBLIC_REGION;
const userPoolId = process.env.EXPO_PUBLIC_USERPOOL_ID;
const userPoolClientId = process.env.EXPO_PUBLIC_USERPOOL_WEB_CLIENTID;
export const awS = {
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: userPoolId,
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: userPoolClientId,
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: identityPoolId,

      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      signUpVerificationMethod: 'code', // 'code' | 'link'

    }
  }
}
// You can get the current config object
export const currentConfig = Amplify.getConfig();