const encryptPassword = async (password: string): Promise<string> => {
  try {
    const response = await fetch('/api/encrypt-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      throw new Error(`Error encrypting password: ${response.statusText}`);
    }
    const data = await response.json();
    return data.encryptedPassword;
  } catch (error) {
    console.error('Error encrypting password:', error);
    throw error;
  }
};

export const decryptPassword = async (encryptedPassword: string): Promise<string> => {
  try {
    const response = await fetch('/api/decrypt-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encryptedPassword }),
    });
    if (!response.ok) {
      throw new Error(`Error decrypting password: ${response.statusText}`);
    }
    const data = await response.json();
    return data.decryptedPassword;
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
