import { writeFile, unlink, access, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { constants } from 'fs';
import path from 'path';
import sharp from 'sharp';

// const execPromise = promisify(exec);

const ensureDirectoryExists = async (dir: string) => {
  try {
    await access(dir, constants.F_OK);
  } catch {
    await mkdir(dir, { recursive: true });
  }
};

export const convertToWebpAndCrop = async (fileBuffer: Buffer, charName: string): Promise<string> => {
  const tempDir = path.resolve(__dirname, '../../../public/temp/avatars');
  const inputFileName = path.join(tempDir, `${uuidv4()}.png`);
  const outputDir = path.resolve(__dirname, '../../../public/avatars');
  const outputFileName = path.join(outputDir, `${charName}.webp`);

	sharp.cache(false);

  try {
    // Ensure the temporary and output directories exist
    await ensureDirectoryExists(tempDir);
    await ensureDirectoryExists(outputDir);

    // Write the buffer to a temporary file
    await writeFile(inputFileName, fileBuffer);
    console.log(`Input file written: ${inputFileName}`);

    // Check if the input file exists
    await access(inputFileName, constants.F_OK);
    console.log(`Input file exists: ${inputFileName}`);

    // Get image dimensions using sharp
    const image = sharp(inputFileName);
    const metadata = await image.metadata();
    const width = metadata.width!;
    const height = metadata.height!;
    const size = Math.min(width, height);

    // Convert the image to WebP format and crop it to a 1:1 aspect ratio
    await image
      .extract({ left: 0, top: 0, width: size, height: size })
      .toFormat('webp')
      .toFile(outputFileName);

    console.log(`Output file created: ${outputFileName}`);

    // Return the path to the saved WebP file
    return outputFileName;
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
