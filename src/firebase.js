import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  projectId: 'hangul-only',
  authDomain: 'hangul-only.web.app',
  databaseURL: 'https://hangul-only-default-rtdb.asia-southeast1.firebasedatabase.app'
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.database();

export default firebase;
