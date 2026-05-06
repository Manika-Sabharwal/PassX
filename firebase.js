// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDE2k42nTP-2pOCtkPWFdIRVOq0kOhKcDI",
  authDomain: "passx-2b164.firebaseapp.com",
  projectId: "passx-2b164",
  storageBucket: "passx-2b164.firebasestorage.app",
  messagingSenderId: "137602981358",
  appId: "1:137602981358:web:5ce90be0d36264336b02ff",
  measurementId: "G-R6D3EF4W7S",
  databaseURL :'https://passx-2b164-default-rtdb.firebaseio.com/',
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);