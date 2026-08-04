auth.onAuthStateChanged(user => {
  if(!user) window.location.href = "signup.html";
});

function saveProfile(){
  const user = auth.currentUser;
  const name = document.getElementById("name").value;
  const bio = document.getElementById("bio").value;
  const photoFile = document.getElementById("photo").files[0];
  
  if(!name ||!photoFile) return alert("Name and Photo required");

  const storageRef = storage.ref("profilePics/" + user.uid);
  storageRef.put(photoFile).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      // Update auth profile
      user.updateProfile({displayName: name, photoURL: url});
      
      // Update database with full info
      db.ref("users/" + user.uid).update({
        name: name,
        photo: url,
        bio: bio
      });
      
      alert("Profile saved!");
      window.location.href = "chat.html"; // NOW GO TO HOME
    });
  });
}
