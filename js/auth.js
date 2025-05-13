import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  doc,
  setDoc,
  db,
  serverTimestamp  // ✅ Add this
} from "./firebase-config.js";

import{checkLogin} from"./app.js"
document.addEventListener("DOMContentLoaded",()=>{

checkLogin()

let signUp=false;

  // Toggle between login and signup forms
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

if (showSignup) {
  showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  });
}

if (showLogin) {
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });
}

// Handle login form submit
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

 try {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  alert("Login successful!");

  localStorage.setItem("login", JSON.stringify(true)); // ✅
  window.location.href = "index.html"; // ✅
} catch (error) {
  alert("Login failed: " + error.message);
}

  });
}







// ✅ Handle signup form submit with async function
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const phoneNumber=new Date().getTime()
    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

await setDoc(doc(db, "users", user.uid), {
  uid: user.uid,
  name: name, // from form input
  email: user.email,
  image: user.photoURL || "", // password-based users usually don’t have image
  createdAt: serverTimestamp(),
  phoneNumber,
});


alert("Signup successful!");
// ❌ DON'T REDIRECT HERE
// ✅ Just show message

    } catch (error) {;
      if (error.code === 'auth/email-already-in-use') {
        alert("Email already in use. Please login instead.");
      } else {
        alert("Signup failed: " + error.message);
      }
    }
  });
}

// Google login button
const googleLogin = document.getElementById('googleLogin');
if (googleLogin) {
googleLogin.addEventListener('click', async (e) => {
  e.preventDefault();
 try {
  const result = await signInWithPopup(auth, googleProvider);
const user = result.user;
const phoneNumber=new Date().getTime()
await setDoc(doc(db, "users", user.uid), {
  uid: user.uid,
  name: user.displayName,
  email: user.email,
  image: user.photoURL, // ✅ fetched directly from user object
  createdAt: serverTimestamp(),
  phoneNumber,

});


  alert("Google login successful!");
  localStorage.setItem("login", JSON.stringify(true)); // ✅
  window.location.href = "index.html"; // ✅
} catch (error) {
  alert("Google login failed: " + error.message);
}

});

}

})

// Toggle between login and signup forms

