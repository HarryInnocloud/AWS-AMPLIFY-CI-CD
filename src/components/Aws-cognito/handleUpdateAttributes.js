import { updateUserAttributes } from 'aws-amplify/auth';

export default async function handleUpdateAttributes(
  data
) {
  try {
    const attributes = await updateUserAttributes({
      userAttributes: {
        address:data.address,
      },
    });
  } catch (error) {
    console.log(error);
  }
}