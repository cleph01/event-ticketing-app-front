import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD6NaA0NB0PWT7VvfuuxhFsuL9fCcORogg",
    authDomain: "event-ticketing-app.firebaseapp.com",
    projectId: "event-ticketing-app",
    storageBucket: "event-ticketing-app.appspot.com",
    messagingSenderId: "235402850926",
    appId: "1:235402850926:web:7dcf32f17072c8149b2c7f",
    measurementId: "G-CXE2FW9Q9X",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
