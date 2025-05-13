// Opening animation logic
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.getElementById('opening-animation').classList.add('fade-out');
        setTimeout(function() {
            document.getElementById('opening-animation').style.display = 'none';
            const mainUI = document.getElementById('main-ui');
            mainUI.classList.remove('hidden');
            mainUI.classList.add('fade-in');
            setTimeout(() => mainUI.classList.remove('opacity-0'), 100);
        }, 1000);
    }, 3000);
});

// WhatsApp Web style: On sm+ both visible, on mobile only one at a time
const sidebar = document.getElementById('sidebar');
const chatArea = document.getElementById('chatArea');
const backButton = document.getElementById('backButton');
let mobileView = 'sidebar'; // 'sidebar' or 'chat'
function updateLayout() {
    if (window.innerWidth < 640) {
        // Mobile: show according to mobileView
        if (mobileView === 'sidebar') {
            sidebar.classList.remove('hidden');
            chatArea.classList.add('hidden');
        } else {
            sidebar.classList.add('hidden');
            chatArea.classList.remove('hidden');
            chatArea.classList.add('block');
            chatArea.classList.remove('flex');
        }
    } else {
        // sm+ (>=640px): both visible
        sidebar.classList.remove('hidden');
        chatArea.classList.remove('hidden');
        chatArea.classList.add('flex');
    }
}
updateLayout();
window.addEventListener('resize', updateLayout);
document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth < 640) {
            mobileView = 'chat';
            updateLayout();
        }
    });
});
backButton.addEventListener('click', () => {
    if (window.innerWidth < 640) {
        mobileView = 'sidebar';
        updateLayout();
    }
});

// Hamburger menu toggle for small screens (no search, no doc upload)
const menuToggle = document.getElementById('menuToggle');
const menuDropdown = document.getElementById('menuDropdown');
if (menuToggle && menuDropdown) {
    menuToggle.addEventListener('click', () => {
        menuDropdown.classList.toggle('hidden');
    });
    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuDropdown.contains(e.target) && !menuToggle.contains(e.target)) {
            menuDropdown.classList.add('hidden');
        }
    });
}

// Doc upload button logic (footer only)
const docUploadBtn = document.getElementById('docUploadBtn');
const docUploadInput = document.getElementById('docUploadInput');
if (docUploadBtn) {
    docUploadBtn.addEventListener('click', () => {
        docUploadInput.click();
    });
}
if (docUploadInput) {
    docUploadInput.addEventListener('change', (e) => {
        // You can handle the uploaded file here
        // Example: console.log(e.target.files[0]);
    });
}

// Search icon logic: show/hide search input in header
const searchIcon = document.getElementById('searchIcon');
const headerMain = document.getElementById('headerMain');
const headerSearch = document.getElementById('headerSearch');
const searchInput = document.getElementById('searchInput');
if (searchIcon && headerMain && headerSearch && searchInput) {
    searchIcon.addEventListener('click', () => {
        headerMain.classList.add('hidden');
        headerSearch.classList.remove('hidden');
        searchInput.focus();
    });
    // Hide search input on blur or Escape
    searchInput.addEventListener('blur', () => {
        headerSearch.classList.add('hidden');
        headerMain.classList.remove('hidden');
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            headerSearch.classList.add('hidden');
            headerMain.classList.remove('hidden');
        }
    });
} 