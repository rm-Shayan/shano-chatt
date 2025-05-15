import { auth, onAuthStateChanged, signOut, getDoc, doc, db, updateDoc,where ,getDocs,query,collection} from "./firebase-config.js";

export const checkLogin = () => {
  onAuthStateChanged(auth, (user) => {
    const isLoggedIn = JSON.parse(localStorage.getItem("login"));

    if (user && isLoggedIn) {
      if (window.location.pathname !== "/index.html") {
        window.location.href = "index.html";
      } else {
        console.log("User is logged in and on home page");
   

        fetchDataOfContactListFromDB(user)
        profile(); // ✅ Safe to call here
      }
    } else {
      if (window.location.pathname !== "/auth.html") {
        window.location.href = "auth.html";
      } else {
        console.log("User is not logged in and is on login/signup page");
      }
    }
  });
};

const logout = () => {
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", async () => {
    await signOut(auth);
    localStorage.removeItem("login");
    window.location.href = "auth.html";
  });
};

const profile = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.log("User not logged in");
    return;
  }

  const docRef = doc(db, "users", user.uid);
  // 2️⃣ Always get and display updated data
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("profileNameDisplay").innerText = `${data.name.trim()}...` || "You";
      document.getElementById("profileImageDisplay").src =
        data.image || `https://ui-avatars.com/api/?name=${data.name || "You"}&background=0D8ABC&color=fff`;
      document.getElementById("NumberOfUser").innerHTML = data.userphone;
    } else {
      console.warn("User document does not exist");
    }
  } catch (err) {
    console.error("Error fetching profile data:", err);
  }
};





// Function to create a chat item element

const fetchDataOfContactListFromDB = async (user) => {
  let contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
  let groups   = JSON.parse(localStorage.getItem("Groups")   || "[]");

  try {
    // Fetch Contacts
    const contactSnapshot = await getDocs(
      collection(db, "users", user.uid, "userContacts")
    );
    contacts = [];
    contactSnapshot.forEach((docSnap) => {
      contacts.push(docSnap.data());
    });
    localStorage.setItem("contacts", JSON.stringify(contacts));
    console.log("Contacts:", contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
  }

  try {
    // Fetch Groups
    const groupSnapshot = await getDocs(
      collection(db, "users", user.uid, "userGroups")
    );
    groups = [];
    groupSnapshot.forEach((docSnap) => {
      groups.push(docSnap.data());
    });
    localStorage.setItem("Groups", JSON.stringify(groups));
    console.log("Groups:", groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
  }

  // Render to UI
  renderChatList(contacts, groups);
};


const renderChatList = async (contacts, groups) => {
  const chatlist = document.getElementById("chat-list");
  if (!chatlist) return;

  // For contacts, fetch images by phone number
  let contactItems = "";

  if (contacts.length > 0) {
    // Fetch all images in parallel
    const contactsWithImages = await Promise.all(
      contacts.map(async c => {
        const imageUrl = await getUserImageByPhoneNumber(c.contactNumber);
        return {...c, image: imageUrl};
      })
    );

    contactItems = contactsWithImages.map(c => `
      <li class="flex items-center justify-between gap-4 p-4 bg-white rounded-xl shadow hover:bg-gray-50 transition">
        <div class="flex items-center gap-3">
          ${
            c.image
              ? `<img src="${c.image}" alt="${c.contactName}" class="w-10 h-10 rounded-full object-cover" />`
              : `<div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                   ${c.contactName?.charAt(0) || "?"}
                 </div>`
          }
          <div>
            <p class="text-sm font-semibold text-gray-800">${c.contactName || "نام نہیں"}</p>
            <p class="text-xs text-gray-500">${c.contactNumber || "نمبر نہیں"}</p>
          </div>
        </div>
      </li>
    `).join("");
  }

  // Groups rendering same as before
  let groupItems = "";
  if (groups.length > 0) {
    groupItems = groups.map(g => `
      <li class="flex items-center justify-between gap-4 p-4 bg-green-50 rounded-xl shadow hover:bg-green-100 transition">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-400 text-white rounded-full flex items-center justify-center font-bold uppercase">
            ${g.contactName?.charAt(0) || "G"}
          </div>
          <div>
            <p class="text-sm font-semibold text-green-700">${g.contactName || "گروپ"}</p>
            <p class="text-xs text-green-600">گروپ چیٹ</p>
          </div>
        </div>
      </li>
    `).join("");
  }

contactItems.addEventListener('click',openChat)
groupItems.addEventListener('click',openChat)

  chatlist.innerHTML = contactItems + groupItems;
};




const getUserImageByPhoneNumber = async (targetNumber) => {
  try {
    // Step 1: Query the users collection to find matching phone number
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userphone", "==", targetNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // No match found → return default avatar
      return "https://ui-avatars.com/api/?name=Unknown&background=ccc&color=fff";
    }

    // Step 2: Get the first matched document
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Step 3: Validate image URL (check if it’s NOT a blob or empty)
    const userImg = userData.image;
    if (
      !userImg || 
      userImg.startsWith("blob:") || 
      !userImg.startsWith("http")
    ) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || "User")}&background=0D8ABC&color=fff`;
    }

    return userImg;
  } catch (error) {
    console.error("🔥 Error getting user image:", error);
    return "https://ui-avatars.com/api/?name=Error&background=ff0000&color=fff";
  }
};

const openChat = async (e) =>{
  e.preventDefault();
  const chat
}


// Initialize the chat list functionality
document.addEventListener("DOMContentLoaded", () => {
  checkLogin(); // it will call setProfile safely inside
  logout();
  // displayChatlistItem();
  
});
