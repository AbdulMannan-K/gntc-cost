// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBsnLtuFNKWlovQD_mbGIOPXxuuUyYfb7Q",
    authDomain: "oxy-cost.firebaseapp.com",
    projectId: "oxy-cost",
    storageBucket: "oxy-cost.appspot.com",
    messagingSenderId: "733815867416",
    appId: "1:733815867416:web:1e84ae031341d728105b6d",
    measurementId: "G-1VQSSM9T0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);