import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, readFile, access, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { constants } from 'fs';
import path from 'path';

const execPromise = promisify(exec);

const ensureDirectoryExists = async (dir: string) => {
  try {
    await access(dir, constants.F_OK);
  } catch {
    await mkdir(dir, { recursive: true });
  }
};

export const convertToWebpAndCrop = async (fileBuffer: Buffer, charName: string): Promise<Buffer> => {
  const inputFileName = `/tmp/${uuidv4()}.png`;
  const outputDir = path.resolve(__dirname, '../../../public/avatars');
  const outputFileName = path.join(outputDir, `${charName}.webp`);

  try {
    // Ensure the output directory exists
    await ensureDirectoryExists(outputDir);

    // Write the buffer to a temporary file
    await writeFile(inputFileName, fileBuffer);
    console.log(`Input file written: ${inputFileName}`);

    // Check if the input file exists
    await access(inputFileName, constants.F_OK);
    console.log(`Input file exists: ${inputFileName}`);

    // Get image dimensions
    const { stdout: dimensions } = await execPromise(`identify -format "%wx%h" ${inputFileName}`);
    const [width, height] = dimensions.split('x').map(Number);
    const size = Math.min(width, height);

    // Convert the image to WebP format and crop it to a 1:1 aspect ratio
    const command = `cwebp -crop 0 0 ${size} ${size} ${inputFileName} -o "${outputFileName}"`;
    console.log(`Executing command: ${command}`);
    await execPromise(command);
    console.log(`Output file created: ${outputFileName}`);

    // Read the converted file back into a buffer
    const webpBuffer = await readFile(outputFileName);

    return webpBuffer;
  } catch (error) {
    console.error('Error processing image', error);
    throw error;
  } finally {
    // Clean up temporary files
    await unlink(inputFileName).catch((err) => {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    });
  }
};
