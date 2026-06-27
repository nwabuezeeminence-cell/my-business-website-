// Firebase Configuration

const firebaseConfig = {
    apiKey: "apiKey: "AIzaSyDluVqK67XEYtc4f9rkML2diChbSvgiYiU"",
    authDomain: "nexa-digital-services.firebaseapp.com",
    databaseURL: "https://nexa-digital-services-default-rtdb.firebaseio.com",
    projectId: "nexa-digital-services",
    storageBucket: "nexa-digital-services.firebasestorage.app",
    messagingSenderId: "552141783731",
    appId: "1:552141783731:web:addf613eba5281388766c6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const db = firebase.database();