import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCptzCSZf7DaGfv4QRN7DlXCVEIZUlLzuY",
    authDomain: "sistema-de-controle-de-protese.firebaseapp.com",
    databaseURL: "https://sistema-de-controle-de-protese-default-rtdb.firebaseio.com",
    projectId: "sistema-de-controle-de-protese",
    storageBucket: "sistema-de-controle-de-protese.appspot.com",
    messagingSenderId: "1044858815151",
    appId: "1:1044858815151:web:849786e46b5a3ae6de8a5a",
    measurementId: "G-PK5YK6Q2FN"
}

export const app = initializeApp(firebaseConfig);