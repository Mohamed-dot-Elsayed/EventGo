import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export const processImage = async (filePath: string) => {
  try {
    const fileName = path.basename(filePath, path.extname(filePath));
    const processedPath = path.join(
      path.dirname(filePath),
      `processed_${fileName}.webp`
    );
    await sharp(filePath)
      .resize(400, 400, {
        fit: "cover",
        position: "center",
      })
      .webp({
        quality: 80,
      })
      .toFile(processedPath);

    await fs.unlink(filePath);
    return processedPath;
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Image processing failed");
  }
};

export const generateThumbnail = async (filePath: string) => {
  try {
    const fileName = path.basename(filePath, path.extname(filePath));
    const thumPath = path.join(
      path.dirname(filePath),
      `thumb_${fileName}.webp`
    );
    await sharp(filePath)
      .resize(100, 100)
      .webp({ quality: 60 })
      .toFile(thumPath);

    return thumPath;
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw new Error("Thumbnail generation failed");
  }
};
