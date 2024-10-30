import { initializeApp, getApps } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';

//Sarjan firebase Config:

// export const firebaseConfig = {
//   apiKey: "AIzaSyATIw0WSxXLOpdTynF3baAzXAGlIQvjrCE",
//   authDomain: "therapistapp-c3636.firebaseapp.com",
//   projectId: "therapistapp-c3636",
//   storageBucket: "therapistapp-c3636.appspot.com",
//   messagingSenderId: "923129921435",
//   appId: "1:923129921435:web:5a12aaca2321330245ab3e",
//   measurementId: "G-L6WWCCJVZM"
// };

// Sidd firebase config
export const firebaseConfig = {
   apiKey: "AIzaSyDYvp9yBFnDnV8BfmZhxjXysx-kNJ-xT6s",
   authDomain: "northstar-therapy.firebaseapp.com",
   projectId: "northstar-therapy",
   storageBucket: "northstar-therapy.appspot.com",
   messagingSenderId: "208370515417",
   appId: "1:208370515417:web:7e8264102d4368e1eeedc8",
   measurementId: "G-EM1WFJM3CG"
 };



// Initialize Firebase
const firebaseApp = getApps().length === 0 ? firebase.initializeApp(firebaseConfig) : getApps()[0];

export const db = firebase.firestore()
export default firebaseApp;