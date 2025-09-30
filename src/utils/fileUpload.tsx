import Compressor from "compressorjs";

export const fileToBase64 = (file: File | Blob, callback: (result: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => callback(reader.result as string);
  reader.onerror = (error) => console.error("Error converting file: ", error);
};

export const compressFileToBase64 = (files: File[], callback: (output: string) => void) => {
  if (files.length > 0) {
    const file = files[0];
    new Compressor(file, {
      quality: 0.8,
      success(result) {
        console.log("Compressed file:", result);
        // You can now upload or use the compressed image
        fileToBase64(result, (base64) => {
          callback(base64);
        });
      },
      error(err) {
        // console.error("Compression error:", err.message);
        fileToBase64(file, (base64) => {
          callback(base64);
        });
      },
    });
  }
};

// export const imageUrlToBase64 = async (imageUrl) => {
//   try {
//     const response = await fetch(imageUrl);
//     if (!response.ok) {
//       throw new Error(`Error fetching the image from server url.`);
//     }
//     const blob = await response.blob();

//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error("Error fetching image as blob:", error);
//     return null;
//   }
// };
