import { auth, onAuthStateChanged,setDoc, signOut, getDoc, doc, db, updateDoc,where ,getDocs,query,collection,serverTimestamp,orderBy,onSnapshot,addDoc} from "./firebase-config.js";

 const checkLogin = () => {
  onAuthStateChanged(auth, (user) => {
    const isLoggedIn = JSON.parse(localStorage.getItem("login"));

    if (user && isLoggedIn) {
      if (window.location.pathname !== "/index.html") {
        window.location.href = "index.html";
      } 
      else {
        console.log("User is logged in and on home page");
   

        profile(user); // ✅ Safe to call here
        fetchDataOfContactListFromDB(user)
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

const profile = async (user) => {

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

  const myId=user.uid
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
  await renderChatList(contacts, groups,myId,user.displayName);
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

// Utility to generate a unique chat ID
const generateChatId = (user1, user2) => {

    return [user1, user2].sort().join("_")

};

// Open chat and update UI
const openChat = async (e, id,currentUserName,receiverId,receiverName,receiverNumber) => {
  e.preventDefault();

console.log(id)
console.log(receiverId)
  const recName = receiverName;
  const senderNumber = currentUserName;
  const number = receiverNumber;
  const user1 = id;
  const user2 = receiverId;


  const chatId = generateChatId(user1, user2);

  console.log(chatId)
  const chatContainer = document.getElementById("chatArea");

  // Update chat UI
  chatContainer.innerHTML = `
    <header class="bg-[#1e88e5] px-6 py-3 flex items-center justify-between border-b border-[#1976d2] shadow-sm text-white relative">
      <button id="backButton" class="sm:hidden text-white mr-4">
        <i class="fas fa-arrow-left text-xl"></i>
      </button>
      <div id="headerMain" class="flex items-center gap-4 flex-1 min-w-0">
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(recName)}&background=random" alt="avatar" class="w-10 h-10 rounded-full">
        <div class="truncate">
          <h2 class="font-semibold text-white truncate">${recName}</h2>
          <p class="text-xs text-blue-100 truncate" id="status>online</p>
        </div>
      </div>
      <div id="headerSearch" class="hidden flex-1 min-w-0">
        <input id="searchInput" type="text" placeholder="Search..." class="w-full px-4 py-2 rounded bg-white text-[#1e88e5] placeholder-[#1e88e5]/60 focus:outline-none" />
      </div>
      <button id="searchIcon" class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-600/20 transition">
        <i class="fas fa-search text-white text-lg"></i>
      </button>
      <button id="menuToggle" class="sm:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-600/20 transition">
        <i class="fas fa-bars text-white text-lg"></i>
      </button>
      <div class="hidden sm:flex gap-4">
        <button class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-600/20 transition"><i class="fas fa-phone-alt text-white text-lg"></i></button>
        <button class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-600/20 transition"><i class="fas fa-video text-white text-lg"></i></button>
        <button class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-600/20 transition"><i class="fas fa-info-circle text-white text-lg"></i></button>
      </div>
      <div id="menuDropdown" class="absolute right-4 top-16 bg-white rounded shadow-lg p-2 flex-col gap-2 z-50 hidden sm:hidden">
        <button class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-100 transition"><i class="fas fa-phone-alt text-[#1e88e5] text-lg"></i></button>
        <button class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-100 transition"><i class="fas fa-video text-[#1e88e5] text-lg"></i></button>
        <button class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-100 transition"><i class="fas fa-info-circle text-[#1e88e5] text-lg"></i></button>
      </div>
    </header>

    <section class="flex-1 overflow-y-auto px-8 py-6 space-y-4 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png')] bg-[#e3f2fd] bg-blend-lighten" id="chat-messages">
      
      
    </section>

    <footer class="bg-white/90 px-6 py-4 border-t border-[#1e88e5]/20">
      <div class="flex items-center gap-4">
        <button class="text-[#1e88e5] hover:text-blue-700 transition"><i class="far fa-smile text-2xl"></i></button>
        <button id="docUploadBtn" class="text-[#1e88e5] hover:text-blue-700 transition"><i class="fas fa-paperclip text-2xl"></i></button>
        <input type="file" id="docUploadInput" class="hidden" />
        <input id="chat-input" type="text" placeholder="Type a message" class="flex-1 bg-blue-50 py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1e88e5] text-blue-900 placeholder-blue-400">
        <button class="text-[#1e88e5] hover:text-blue-700 transition"><i class="fas fa-microphone text-2xl"></i></button>
      </div>
    </footer>
  `;
try{
  listenToMessages(chatId, user1,user2);
}catch(err){
  console.log(err);
}
  // Responsive behavior
  const chatList = document.getElementById("chat-list");
  if (window.innerWidth < 500) {
    chatList.classList.add("hidden");
    chatContainer.classList.remove("hidden");
    chatContainer.classList.add("w-full");
  } else {
    chatList.classList.remove("hidden");
    chatContainer.classList.remove("hidden");
    chatContainer.classList.add("w-3/4");
  }

  // Handle input focus for user status
const input = document.getElementById("chat-input");
console.log(input)

if (input) {


//  input.addEventListener("focus", () => {
//   updateChatStatus(chatId, user1, true);
// });

// input.addEventListener("blur", () => {
//   updateChatStatus(chatId, user1, false);
// });



  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const messageText = input.value.trim();

      console.log(user1)
      // Call your send function here
   try{
       await sendMessageToChat({
        senderId: user1,
        senderName: currentUserName,
        receiverId: user2,
        receiverName:recName,
        messageText: messageText
      });
   }catch(err){
    console.log(err)
   }

      input.value = ""; // Clear input after sending
    }

  });

  



}

};



const getUserStatus = async (chatId, userId) => {
  const statusRef = doc(db, "chats", chatId, "status", userId);
  const snap = await getDoc(statusRef);

  if (snap.exists()) {
    const data = snap.data();
    if (data.active) {
      return "online";
    } else if (data.lastSeen?.toDate) {
      const lastSeenTime = format(data.lastSeen.toDate(), "hh:mm a");
      return `last seen at ${lastSeenTime}`;
    }
  }

  return "offline";
};

const updateChatStatus = async (chatId, userId, isActive) => {
  const statusRef = doc(db, "chats", chatId, "status", userId);

  try {
    if (isActive) {
      await setDoc(statusRef, {
        active: true,
        status: "online", // ✅ fixed spelling
        lastSeen: serverTimestamp()
      }, { merge: true });
    } else {
      await setDoc(statusRef, {
        active: false,
        status: "offline", // ✅ fixed spelling
        lastSeen: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    console.error("Status update failed:", error.message);
  }
};



// Rendering chat list
const renderChatList = async (contacts, groups, myId, currentUserName) => {
  const chatlist = document.getElementById("chat-list");
  if (!chatlist) return;

  let contactItems = "";

  if (contacts.length > 0) {
    const contactsWithImages = await Promise.all(
      contacts.map(async c => {
        const imageUrl = await getUserImageByPhoneNumber(c.contactNumber);
        return { ...c, image: imageUrl };
      })
    );

    contactItems = contactsWithImages.map(c => `
      <li class="contact-item flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:bg-gray-50 transition cursor-pointer"
          data-id="${c.matchedUserId}" 
          data-name="${c.contactName}" 
          data-number="${c.contactNumber}">
        <div class="flex items-center gap-3">
          ${c.image
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

  let groupItems = "";
  if (groups.length > 0) {
    groupItems = groups.map(g => `
      <li class="contact-item flex items-center gap-4 p-4 bg-green-50 rounded-xl shadow hover:bg-green-100 transition cursor-pointer"
          data-id="${g.matchedUserId}" 
          data-name="${g.contactName}" 
          data-number="${g.contactNumber}">
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

  chatlist.innerHTML = contactItems + groupItems;

  // ✅ Add click event to open chat
  const items = chatlist.querySelectorAll(".contact-item");
  items.forEach(item => {
    item.addEventListener("click", (e) => {
      try {
        const target = e.currentTarget;
        const receiverId = target.dataset.id;
        const receiverName = target.dataset.name;
        const receiverNumber = target.dataset.number;

        if (!receiverId) throw new Error("Receiver ID not found.");
        console.log("Opening chat with:", receiverId, receiverName, receiverNumber);

        openChat(e, myId, currentUserName, receiverId, receiverName, receiverNumber);
      } catch (error) {
        console.error("Failed to open chat:", error.message);
        alert("Chat kholne me masla hua. Barah-e-karam dobara koshish karein.");
      }
    });
  });
};





const sendMessageToChat = async ({ 
  senderId, senderName, 
  receiverId, receiverName, 
  messageText 
}) => {
  const chatId = generateChatId(senderId, receiverId);
  const timestamp = serverTimestamp();

  const messageData = {
    senderId,
    receiverId,
    senderName,
    receiverName,
    message: messageText,
    timestamp
  };

  // Store in both sender and receiver messages collections
  const senderRef = collection(db, "users", senderId, "chats", chatId, "messages");
  const receiverRef = collection(db, "users", receiverId, "chats", chatId, "messages");


  await Promise.all([
    addDoc(senderRef, messageData),
    addDoc(receiverRef, messageData)
  ]);

  console.log("Message sent to chatId:", chatId);
};



const listenToMessages = (chatId, currentUserId,receiverId) => {
  const messagesRef = collection(db, "users", currentUserId, "chats", chatId, "messages");
  const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

  console.log(currentUserId)
  onSnapshot(messagesQuery, (snapshot) => {
    const chatMessagesContainer = document.getElementById("chat-messages");
    if (!chatMessagesContainer) return;

    chatMessagesContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      const isSender = data.senderId ;

if(isSender&&isSender==currentUserId){
chatMessagesContainer.innerHTML += `
        <div class="flex flex-col items-${isSender ? "end" :"start" }">
          <div class="${isSender ? "bg-[#1e88e5] text-white" : "bg-white/90 text-[#1565c0]"} rounded-lg px-4 py-2 shadow mb-1 max-w-lg">
            ${data.message}
          </div>
          <span class="text-xs text-gray-400 ${isSender ? "mr-2" : "ml-2"}">
            ${new Date(data.timestamp?.seconds * 1000).toLocaleTimeString()}
          </span>
        </div>
      `;
      
}

 
if(isSender&&isSender==receiverId){
    chatMessagesContainer.innerHTML += `
        <div class="flex flex-col items-${isSender ? "end" :"start" }">
          <div class="${isSender ? "bg-[#1e88e5] text-white" : "bg-white/90 text-[#1565c0]"} rounded-lg px-4 py-2 shadow mb-1 max-w-lg">
            ${data.message}
          </div>
          <span class="text-xs text-gray-400 ${isSender ? "mr-2" : "ml-2"}">
            ${new Date(data.timestamp?.seconds * 1000).toLocaleTimeString()}
          </span>
        </div>
      `;
}
    });

    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  });
};


// Initialize the chat list functionality
document.addEventListener("DOMContentLoaded", () => {
  checkLogin(); // it will call setProfile safely inside
  logout();
  // displayChatlistItem();
  
});
