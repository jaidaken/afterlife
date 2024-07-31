import axios from 'axios';

const encryptPassword = async (password: string): Promise<string> => {
  try {
    const response = await axios.post('/api/encrypt-password', { password });
    return response.data.encryptedPassword;
  } catch (error) {
    console.error('Error encrypting password:', error);
    throw error;
  }
};

export const decryptPassword = async (encryptedPassword: string): Promise<string> => {
  try {
    const response = await axios.post('/api/decrypt-password', { encryptedPassword });
    return response.data.decryptedPassword;
  } catch (error) {
    console.error('Error decrypting password:', error);
    throw error;
  }
};

export default encryptPassword;
