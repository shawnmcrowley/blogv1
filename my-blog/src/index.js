import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Added FireBase Code from Google

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-UiCj15BEPLlJw91an1hCKBKXDwtFggI",
  authDomain: "react-blog-facbf.firebaseapp.com",
  projectId: "react-blog-facbf",
  storageBucket: "react-blog-facbf.appspot.com",
  messagingSenderId: "707980114028",
  appId: "1:707980114028:web:bdb7b5f42a2ec4cb24c049"
};

// Initialize Firebase
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

