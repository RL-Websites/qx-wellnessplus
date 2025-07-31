// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
export const vapidKey = "BLlsIogtuW_k1TYOTKofei9wS5Ugmt_B8i70pJXtguJS3odcrLuZ3_Svj-d1AML1C3QmbeqAr2Qu7jd2CKejRts";

const firebaseConfig = {
  apiKey: "AIzaSyA193djmTxALqrGHA7fBYImTnS-fArLtgk",
  authDomain: "docmedilink.firebaseapp.com",
  projectId: "docmedilink",
  storageBucket: "docmedilink.appspot.com",
  messagingSenderId: "653716766364",
  appId: "1:653716766364:web:119eb7d7aadf38fb0bb759",
  measurementId: "G-B36V24QGTG",
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
