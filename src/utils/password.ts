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

export const generateRandomPassword = (length: number = 16): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export default encryptPassword;
