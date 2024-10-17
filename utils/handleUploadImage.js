import { storage } from "../firebase";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";

export const handleUploadImage = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob(); // Convert the image into a Blob
    const storageRef = ref(storage, "images/" + new Date().getTime()); // Firebase storage reference

    // Upload the Blob to Firebase Storage
    const uploadTask = await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
