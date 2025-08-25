import sharp from "sharp";

export const optimizeImageBase64 = async (base64Image) => {
  try {
    const buffer = Buffer.from(base64Image.split(",")[1], "base64");

    let quality = 80;
    let optimizedBuffer = await sharp(buffer)
      .resize({ width: 1200 }) // Resize max width
      .webp({ quality }) // Convert to WebP
      .toBuffer();

    while (optimizedBuffer.length > 1 * 1024 * 1024 && quality > 30) {
      quality -= 10;
      optimizedBuffer = await sharp(buffer)
        .resize({ width: 1200 })
        .webp({ quality })
        .toBuffer();
    }

    return `data:image/webp;base64,${optimizedBuffer.toString("base64")}`;
  } catch (error) {
    throw new Error("Image optimization failed: " + error.message);
  }
};
