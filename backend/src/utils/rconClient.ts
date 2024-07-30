// backend/src/utils/rconClient.ts
import { Rcon } from 'rcon-client';
import dotenv from 'dotenv';

dotenv.config();

export const sendRconCommand = async (command: string) => {
  const rcon = new Rcon({
    host: process.env.RCON_HOST || '',
    port: parseInt(process.env.RCON_PORT || '', 10),
    password: process.env.RCON_PASSWORD || '',
  });

  try {
    await rcon.connect();
    const response = await rcon.send(command);
    await rcon.end();
    return response;
  } catch (error) {
    console.error('Error sending RCON command:', error);
    throw error;
  }
};
