import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyCa4ZEci887ETOODcVbBaqA5vyeIkiVgvw",
    authDomain: "apna-prasad.firebaseapp.com",
    projectId: "apna-prasad",
    storageBucket: "apna-prasad.appspot.com",
    messagingSenderId: "259851341407",
    appId: "1:259851341407:web:e907a296a7585f01c515ea",
    measurementId: "G-D1BR4RS3YW"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export default app