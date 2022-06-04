import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "************************",
    authDomain: "sistema-de-controle-de-protese.firebaseapp.com",
    databaseURL: "https://sistema-de-controle-de-protese-default-rtdb.firebaseio.com",
    projectId: "sistema-de-controle-de-protese",
    storageBucket: "sistema-de-controle-de-protese.appspot.com",
    messagingSenderId: "**************",
    appId: "****************************",
    measurementId: "*******************"
}

export const app = initializeApp(firebaseConfig);