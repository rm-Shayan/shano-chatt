import {
  auth,
  db,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  doc,
  setDoc,
  serverTimestamp
} from "./firebase-config.js";


const checkLogin=()=>{
   onAuthStateChanged(auth, (user) => {
      const isLoggedIn = JSON.parse(localStorage.getItem("login"));
  
      if (user && isLoggedIn) {
        if (window.location.pathname !== "/index.html") {
          window.location.href = "index.html";
        } 
        else {
        }
      } else {
        if (window.location.pathname !== "/auth.html") {
          window.location.href = "auth.html";
        } else {
          console.log("User is not logged in and is on login/signup page");
        }
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
 

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");
  const googleLogin = document.getElementById("googleLogin");
 const loader=document.getElementById('loader')

  

  // 🔄 Toggle Forms
  showSignup?.addEventListener("click", e => {
    e.preventDefault();
    loginForm?.classList.add("hidden");
    signupForm?.classList.remove("hidden");
  });

  showLogin?.addEventListener("click", e => {
    e.preventDefault();
    signupForm?.classList.add("hidden");
    loginForm?.classList.remove("hidden");
  });

 
  // 🔐 Handle Login
  loginForm?.addEventListener("submit", async e => {
    e.preventDefault();
    loader.classList.remove('hidden')
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) return alert("Please enter email and password");

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      alert(`Welcome back, ${user.email}`);
      localStorage.setItem("login", JSON.stringify(true));
  
      loader.classList.add('hidden')
   

      window.location.href = "index.html";
    } catch (err) {
      alert("Login failed: " + err.message);
     loader.classList.add('hidden')
    }
  });

  // 📝 Handle Signup
 signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
loader.classList.remove('hidden')
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const rawNumber = document.getElementById("userContactNumber").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  const userphone = rawNumber.replace(/\D/g, ""); // Remove non-digit chars

  if (!name || !email || !password || !userphone) {
    alert("Please fill in all fields correctly.");
    loader.classList.remove('hidden')
    return;
  }

  try {


    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      image: user.photoURL || "",
      userphone,
      createdAt: serverTimestamp(),
    });

    alert("✅ Signup successful! Data stored in Firestore.");
    loader?.classList.add('hidden')
   signupForm?.classList.add("hidden");
    loginForm?.classList.remove("hidden");
    // Optional: Switch UI to login form or redirect to login
  } catch (err) {
    console.error("❌ Firebase error:", err);

    if (err.code === "auth/email-already-in-use") {
      alert("⚠️ Email already in use. Please login instead.");
      loader.classList.add('hidden')
    } else {
      alert("Signup failed: " + err.message);
      loader.classList.add('hidden')
    }
  }
});


  // 🔗 Google Login
  googleLogin?.addEventListener("click", async e => {
    e.preventDefault();
    try {
      const { user } = await signInWithPopup(auth, googleProvider);

      const generatedNumber = new Date().getTime(); // fallback phone-like unique value

      loader.classList.remove('hidden')
   try{
       await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        image: user.photoURL || "",
        createdAt: serverTimestamp(),
        userphone: generatedNumber.toString()
      });
   }catch(err){
    console.error("❌ Firestore error:", err);
   }
   loader.classList.add('hidden')

      alert("Google login successful!");
      localStorage.setItem("login", JSON.stringify(true));
      window.location.href = "index.html";
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  });
});
