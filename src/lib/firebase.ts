// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC7Ehkjzbf-zUx8Ck48OL701qcIftn72S0",
    authDomain: "seydaoguzhan-1c037.firebaseapp.com",
    projectId: "seydaoguzhan-1c037",
    storageBucket: "seydaoguzhan-1c037.firebasestorage.app",
    messagingSenderId: "76086764224",
    appId: "1:76086764224:web:bbd35ff453298a68eb8325",
    measurementId: "G-354NHT5RS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);