import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { app } from './firebase.js';

const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);
let currentUser = null;
let selectedFile = null;

onAuthStateChanged(auth, (user) => {
  if(user) currentUser = user;
  else window.location.href = 'login.html';
});

document.getElementById('profilePic').addEventListener('change', function() {
  selectedFile = this.files[0];
  if (!selectedFile) return;
  const reader = new FileReader();
  reader.onload = (e) => { document.getElementById('preview').src = e.target.result; }
  reader.readAsDataURL(selectedFile);
});

document.getElementById('continueBtn').addEventListener('click', async () => {
  const surname = document.getElementById('surname').value;
  const firstname = document.getElementById('firstname').value;
  const middlename = document.getElementById('middlename').value;
  const lastname = document.getElementById('lastname').value;
  const age = document.getElementById('age').value;
  const dob = document.getElementById('dob').value;
  const country = document.getElementById('country').value;
  const state = document.getElementById('state').value;
  const bio = document.getElementById('bio').value;

  if(!surname ||!firstname ||!lastname ||!age ||!dob ||!country ||!state) {
    alert("Please fill all required fields *"); return;
  }

  let photoURL = document.getElementById('preview').src;
  if(selectedFile){
    const storageRef = sRef(storage, 'profiles/' + currentUser.uid + '.jpg');
    await uploadBytes(storageRef, selectedFile);
    photoURL = await getDownloadURL(storageRef);
  }

  await set(ref(db, 'users/' + currentUser.uid), {
    surname, firstname, middlename, lastname,
    displayName: `${surname} ${firstname}`,
    age, dob, country, state, bio, photoURL, email: currentUser.email
  });

  alert("Profile saved!");
  window.location.href = 'chat.html';
});