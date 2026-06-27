import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const auth = getAuth(app);