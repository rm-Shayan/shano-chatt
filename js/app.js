import { auth, onAuthStateChanged, signOut, getDoc, doc, db, updateDoc,where ,getDocs,query,collection} from "./firebase-config.js";

export const checkLogin = () => {
  onAuthStateChanged(auth, (user) => {
    const isLoggedIn = JSON.parse(localStorage.getItem("login"));

    if (user && isLoggedIn) {
      if (window.location.pathname !== "/index.html") {
        window.location.href = "index.html";
      } else {
        console.log("User is logged in and on home page");
        setProfile(); // ✅ Safe to call here
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

const setProfile = async (updatedName = null, updatedImage = null) => {
  const user = auth.currentUser;
  if (!user) {
    console.log("User not logged in");
    return;
  }

  const docRef = doc(db, "users", user.uid);

  // 1️⃣ If update values are provided → update Firestore
  if (updatedName || updatedImage) {
    const updates = {};
    if (updatedName) updates.name = updatedName;
    if (updatedImage) updates.image = updatedImage;

    try {
      await updateDoc(docRef, updates);
      console.log("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  }

  // 2️⃣ Always get and display updated data
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("profileNameDisplay").innerText = `${data.name.trim()}...` || "You";
      document.getElementById("profileImageDisplay").src =
        data.image || `https://ui-avatars.com/api/?name=${data.name || "You"}&background=0D8ABC&color=fff`;
      document.getElementById("NumberOfUser").innerHTML = data.phoneNumber;
    } else {
      console.warn("User document does not exist");
    }
  } catch (err) {
    console.error("Error fetching profile data:", err);
  }
};

const displayChatlistItem = () => {
  const chatlist = document.getElementById("chat-list");
  const searchInputOfChat = document.getElementById("searchChat");

  searchInputOfChat.addEventListener("keyup", async () => {
    const searchValue = searchInputOfChat.value.toLowerCase().trim();
    chatlist.innerHTML = "";

    if (!searchValue) return;

    const usersRef = collection(db, "users");

    try {
      const phoneQuery = query(usersRef, where("phoneNumber", "==", searchValue));
      const phoneSnapshot = await getDocs(phoneQuery);

      const nameQuery = query(
        usersRef,
        where("name", ">=", searchValue),
        where("name", "<=", searchValue + "\uf8ff")
      );
      const nameSnapshot = await getDocs(nameQuery);

      const results = new Set();

      phoneSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!results.has(docSnap.id)) {
          results.add(docSnap.id);
          const chatItem = createChatItem(data.name, data.phoneNumber, data.lastMessage, data.timestamp);
          chatlist.appendChild(chatItem);
        }
      });

      nameSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!results.has(docSnap.id)) {
          results.add(docSnap.id);
          const chatItem = createChatItem(data.name, data.phoneNumber, data.lastMessage, data.timestamp);
          chatlist.appendChild(chatItem);
        }
      });

      if (results.size === 0) {
        chatlist.innerHTML = "<p class='text-gray-500 px-4 py-2'>No users found.</p>";
      }

    } catch (err) {
      console.error("❌ Error searching users:", err);
    }
  });
};


// Function to create a chat item element
const createChatItem = (name, phoneNumber, lastMessage, timestamp) => {
  const chatItem = document.createElement("div");
  chatItem.classList.add("chat-item", "flex", "items-center", "px-4", "py-3", "hover:bg-gray-50", "cursor-pointer", "group");

  chatItem.innerHTML = `
    <div class="relative mr-4">
      <img src="https://ui-avatars.com/api/?name=${name.replace(" ", "+")}&background=random" alt="Avatar" class="w-12 h-12 rounded-full">
      <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-center">
        <h4 class="text-gray-900 font-semibold truncate">${name}</h4>
        <span class="text-xs text-gray-400">${timestamp}</span>
      </div>
      <div class="flex justify-between items-center text-sm text-gray-600">
        <p class="truncate">${lastMessage}</p>
      </div>
    </div>
  `;

  return chatItem;
};

// Initialize the chat list functionality
document.addEventListener("DOMContentLoaded", () => {
  checkLogin(); // it will call setProfile safely inside
  logout();
  displayChatlistItem();
});
