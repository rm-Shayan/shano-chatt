// special.js
import {
  auth,
  db,
  onAuthStateChanged,
  collection,
  addDoc,
    arrayUnion,
    getDocs,
    getDoc,
  doc,
  setDoc,
    query, 
  where,collectionGroup,
  updateDoc
} from "./firebase-config.js";

let loader, mainUI;


// Show/hide helpers
const showLoader = () => {
  mainUI.classList.add("hidden");
  loader.classList.remove("hidden");
};
const hideLoader = () => {
  loader.classList.add("hidden");
  mainUI.classList.remove("hidden");
};

// Wrap auth-check + redirect
const withAuth = fn =>
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "../auth.html";
      return;
    }
    fn(user);
  });

// Generic form-setup
const setupForm = (formId, handler, redirect = true) => {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    showLoader();
    try {
      await handler(e);
      if (redirect) {
        window.location.href = "../index.html";
      }
    } catch (err) {
      console.error(err);
      alert("خرابی: " + err.message);
    } finally {
      hideLoader();
    }
  });
};


// Only initialize the contact form if we're on “add-contact”
const initializeContact = user => {
  setupForm("add-contact-form", async e => {
    const { contactName, contactNumber } = e.target.elements;
    const name = contactName.value.trim();
    const phone = contactNumber.value.trim();
    if (!name || !phone) throw new Error("Missing contact fields");

    const docId = phone.replace(/\D/g, "");
    const success = await findAndImportContact(docId, user.uid, "userContacts");

    if (!success) throw new Error("Failed to import contact");
  });
};


// Only initialize the group form if we're on “add-group”
const initializeGroup = user => {
  setupForm("add-group-form", async e => {
    const { GroupName, participantsNumber } = e.target.elements;
    const groupName = GroupName.value.trim();
    const num = participantsNumber.value.trim();
    if (!groupName || !num) throw new Error("Missing group fields");

    const docId = num.replace(/\D/g, "").tostring();
    const success = await findAndImportContact(docId, user.uid, "userGroups");

    if (!success) throw new Error("Failed to import group member");
  });
};

// fetching Data


const findAndImportContact = async (targetNumber, currentUserUid, userRef) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userphone", "==", targetNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("❌ یہ نمبر کسی رجسٹرڈ یوزر سے میچ نہیں کرتا۔");
      return false;
    }

    const contactRef = doc(db, "users", currentUserUid, userRef, targetNumber);
    const existingContact = await getDoc(contactRef);
    
    if (existingContact.exists()) {
      alert("⚠️ یہ نمبر پہلے سے موجود ہے آپ کی لسٹ میں۔");
      return false;
    }

    const matchedDoc = snapshot.docs[0];
    const matchedUid = matchedDoc.id;
    const matchedData = matchedDoc.data();

    // Prevent adding your own number
    const currentUserRef = doc(db, "users", currentUserUid);
    const currentUserSnap = await getDoc(currentUserRef);
    const currentUserPhone = currentUserSnap.data().userphone;

    if (matchedData.userphone === currentUserPhone) {
      alert("⚠️ آپ اپنا نمبر شامل نہیں کر سکتے۔");
      return false;
    }

    const data = {
      contactNumber: matchedData.userphone,
      importedAt: new Date(),
      matchedUserId: matchedUid,
      contactName: matchedData.name || "نام موجود نہیں"
    };

    if (userRef === "userGroups") {
      data.contactName = arrayUnion(matchedData.userphone); // Optional logic
    }

    await setDoc(contactRef, data);
    alert(`✅ نمبر '${matchedData.userphone}' شامل ہو گیا '${userRef}' میں`);
    return true;

  } catch (error) {
    console.error("🔥 خرابی:", error);
    alert("کچھ مسئلہ ہوا نمبر شامل کرتے ہوئے۔");
    return false;
  }
};






 const initializeSettings = user => {
  setupForm("settings-form", async e => {
  try {
    const { userName, userNumber, userImage } = e.target.elements;
    const name = userName.value.trim();
    const num = userNumber.value.trim();
    const image = userImage.files[0];

    if (!name || !num || !image) throw new Error("Missing profile fields");

   const userImg = await toBase64(image);;

    await updateDoc(doc(db, "users", user.uid), {
      name,
      userphone: num,
      image: userImg
    });

    alert("پروفائل اپڈیٹ ہو گیا ✅");
    window.location.href = "../index.html"; // Redirect here

  } catch (error) {
    alert("کچھ غلط ہو گیا: " + error.message);
    console.error(error);
  }
}, false);
// <-- no redirect
};

const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

document.addEventListener("DOMContentLoaded", () => {
  loader  = document.getElementById("loader");
  mainUI  = document.getElementById("main-container");

  // Only wire up the form that matches the section param:
  const section = new URLSearchParams(window.location.search).get("section");
  withAuth(user => {
    if (section === "add-contact") {
      initializeContact(user);
    } else if (section === "add-group") {
      initializeGroup(user);
    }else if(section === "settings"){
        initializeSettings(user);
    }
    // else: you could handle “settings” here if you wish
  });
});
