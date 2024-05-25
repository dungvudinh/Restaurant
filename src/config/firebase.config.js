// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiZ8inrgTE2avMjzF4W2r--mD0pFv19QQ",
  authDomain: "otp-project-5a4be.firebaseapp.com",
  projectId: "otp-project-5a4be",
  storageBucket: "otp-project-5a4be.appspot.com",
  messagingSenderId: "608965392061",
  appId: "1:608965392061:web:2ceea63640da5c2b7f29d4",
  measurementId: "G-BKVGTSHJG5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;

