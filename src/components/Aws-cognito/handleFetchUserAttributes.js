import { fetchUserAttributes } from 'aws-amplify/auth';

export default async function handleFetchUserAttributes() {
  try {
    const userAttributes = await fetchUserAttributes();
    return userAttributes;
  } catch (error) {
    console.log(error);
  }
}