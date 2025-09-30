// src/utils/fileUpload.ts
import Compressor from "compressorjs";

/**
 * Convert a File or Blob to base64 string
 */
export const fileToBase64 = (file: File | Blob, callback: (result: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => callback(reader.result as string);
  reader.onerror = (error) => console.error("Error converting file: ", error);
};

/**
 * Compress file(s) and return a base64-encoded JPEG (even if original was HEIC/HEIF).
 *
 * - If file is HEIC/HEIF, dynamically convert to JPEG using heic2any.
 * - Then compress using Compressor.js (same behaviour as before).
 */
export const compressFileToBase64 = async (files: File[], callback: (output: string) => void) => {
  if (!files || files.length === 0) return;

  const originalFile = files[0];

  try {
    let blobToCompress: Blob = originalFile;

    // Detect HEIC/HEIF by MIME or filename
    const isHeic = (originalFile.type && /heic|heif/i.test(originalFile.type)) || /\.(heic|heif)$/i.test((originalFile as File).name || "");

    if (isHeic) {
      try {
        // dynamic import so we only load heic2any when needed
        const heic2anyModule = await import("heic2any");
        // heic2any may be default export or named; handle both
        const heic2any = (heic2anyModule && (heic2anyModule.default || heic2anyModule)) as any;

        // convert HEIC/HEIF blob to JPEG blob
        const converted = await heic2any({
          blob: originalFile,
          toType: "image/jpeg",
          quality: 0.92, // tweak if needed
        });

        // heic2any sometimes returns an array
        blobToCompress = Array.isArray(converted) ? converted[0] : converted;
        console.log("HEIC/HEIF converted to JPEG blob:", blobToCompress);
      } catch (convErr) {
        // if conversion fails, fallback to original file
        console.error("HEIC -> JPEG conversion failed, falling back to original file", convErr);
        blobToCompress = originalFile;
      }
    }

    // Now compress with Compressor.js (same as before)
    new Compressor(blobToCompress as Blob, {
      quality: 0.8,
      // optional: limit dimensions if you want to shrink very large images
      maxWidth: 3000,
      maxHeight: 3000,
      success(resultBlob) {
        // log compressed size (KB) for debugging
        const sizeKB = Math.round((resultBlob.size / 1024) * 100) / 100;
        console.log(`Compressed file size: ${sizeKB} KB`);

        fileToBase64(resultBlob, (base64) => {
          callback(base64);
        });
      },
      error(err) {
        console.error("Compression error:", err);
        // fallback: convert the blobToCompress to base64 directly
        fileToBase64(blobToCompress, (base64) => {
          callback(base64);
        });
      },
    });
  } catch (err) {
    console.error("compressFileToBase64 unexpected error:", err);
    // final fallback to original file base64
    fileToBase64(originalFile, (base64) => {
      callback(base64);
    });
  }
};
