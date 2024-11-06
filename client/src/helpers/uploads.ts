import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from "../config/firebase-config";

export const uploadImagesToFirebaseAndReturnUrls = async (files: File[]) => {
  try {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, 'images');
    const uploadedFilesRefs = await Promise.all(
      files.map((file) => {
        const fileRef = ref(storageRef, `${Date.now()}-${file.name}`);
        return uploadBytes(fileRef, file);
      })
    );
    const urls = await Promise.all(
      uploadedFilesRefs.map((fileRef) => getDownloadURL(fileRef.ref))
    );
    return urls;
  } catch (error: any) {
    throw error.message || 'Error uploading images';
  }
};
