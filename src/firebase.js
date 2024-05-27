import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {

  apiKey: "AIzaSyAz2l5hbJSRKYWMp8dW3f-CICCfgSc7YOk",
  authDomain: "taskweb-f1651.firebaseapp.com",
  projectId: "taskweb-f1651",
  storageBucket: "taskweb-f1651.appspot.com",
  messagingSenderId: "756544150556",
  appId: "1:756544150556:web:78bd23abfbd131d1c313d9",
  measurementId: "G-GTYKCEVX7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service


export const auth = getAuth(app);
