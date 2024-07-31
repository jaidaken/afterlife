const crypto = require('crypto');

// Define the decryption function
function decryptPassword(encryptedPassword, key) {
    const algorithm = 'aes-256-cbc';
    const [ivHex, encryptedHex] = encryptedPassword.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');

    // Create a decipher
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);

    // Decrypt the password
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// Example usage
const encryptedPassword = '3037cc5b44464c1ef1d6e391002711b4:d223a1ed52c41bc059c43db0d3c20935b1b6ae5818ea1971479283e9ccafafe3'; // Replace with your encrypted password
const key = '5c52bbca3142c83c6f8dceffd033d19b80451bc1dddd5ec2d04e0a59d9d978a4';

const decryptedPassword = decryptPassword(encryptedPassword, key);
console.log('Decrypted Password:', decryptedPassword);
