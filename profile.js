const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();
let currentUser = null;
let selectedProfileFile = null;
let selectedCoverFile = null;

auth.onAuthStateChanged(user => {
  if(user){
    currentUser = user;
    document.getElementById('username').innerText = '@' + user.email.split('@')[0];
    document.getElementById('fullName').innerText = user.displayName || 'User';
  } else {
    window.location.href = 'login.html';
  }
});

// 1. PROFILE PHOTO PREVIEW
document.getElementById('profileInput').addEventListener('change', function(e){
  selectedProfileFile = e.target.files[0];
  if(selectedProfileFile){
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('profilePreview').src = event.target.result;
    }
    reader.readAsDataURL(selectedProfileFile);
  }
});

// 2. COVER PHOTO PREVIEW
document.getElementById('coverInput').addEventListener('change', function(e){
  selectedCoverFile = e.target.files[0];
  if(selectedCoverFile){
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('coverPreview').src = event.target.result;
    }
    reader.readAsDataURL(selectedCoverFile);
  }
});

// 3. SAVE BUTTON
document.getElementById('saveProfile').addEventListener('click', async () => {
  const surname = document.getElementById('surname').value;
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const age = document.getElementById('age').value;
  const dob = document.getElementById('dob').value;
  const country = document.getElementById('country').value;
  const state = document.getElementById('state').value;
  const bio = document.getElementById('bio').value;

  if(!surname ||!firstname ||!lastname ||!age ||!dob ||!country ||!state){
    alert("Please fill all required fields *");
    return;
  }

  let profileURL = document.getElementById('profilePreview').src;
  let coverURL = document.getElementById('coverPreview').src;

  if(selectedProfileFile){
    const profileRef = storage.ref('profiles/' + currentUser.uid + '_profile.jpg');
    await profileRef.put(selectedProfileFile);
    profileURL = await profileRef.getDownloadURL();
  }
  
  if(selectedCoverFile){
    const coverRef = storage.ref('profiles/' + currentUser.uid + '_cover.jpg');
    await coverRef.put(selectedCoverFile);
    coverURL = await coverRef.getDownloadURL();
  }

  await db.ref('users/' + currentUser.uid).set({
    surname, firstname, lastname,
    displayName: `${surname} ${firstname}`,
    age, dob, country, state, bio, 
    photoURL: profileURL,
    coverURL: coverURL,
    email: currentUser.email
  });

  alert("Profile saved!");
  window.location.href = 'chat.html';
});