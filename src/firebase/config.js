import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";
import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject } from "firebase/storage"

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadFile(file, folderName) {
    try {
        const folderPath = folderName.endsWith('/') ? folderName.slice(0, -1) : folderName;
        const storageRef = ref(storage, `${folderPath}/${uuidv4()}`);
        const data = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return {
            url,
            id: data.metadata.name,
        };
    } catch (error) {
        console.error("Error al montar el archivo: ", error);
    }
}

export async function deleteImageFromFirebase(imageUrl) {
    try {
        const storageRef = ref(storage, imageUrl);

        await deleteObject(storageRef);
    } catch (error) {
        console.error("Error al eliminar la imagen:", error);
    }
}
