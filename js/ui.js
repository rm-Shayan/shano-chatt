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
        backButton?.addEventListener('click', () => {
            if (window.innerWidth < 640) {
                mobileView = 'sidebar';
                updateLayout();
            }
        });

         const toggleBtnCommon = document.getElementById("btn-of-toggle");
  const containerCommon = document.getElementById("containerOfThings");
  const cutToggleBtn = document.getElementById("cutToggle");

  const toggle = () => {
    containerCommon.classList.contains("hidden")
      ? containerCommon.classList.remove("hidden")
      : containerCommon.classList.add("hidden");
  };

  toggleBtnCommon?.addEventListener("click", toggle);
  cutToggleBtn?.addEventListener("click", toggle);





document.querySelectorAll('#containerOfThings .cursor-pointer').forEach(function(item) {
  item.addEventListener('click', function(event) {
    console.log(event.target.innerText); // Check which option is clicked

    const child = event.target; // Fix typo here

    // Using if-else for readability
    if (child.textContent.trim() === "Add New Contact") {
      window.location.href = "special.html?section=add-contact";
    } else if (child.textContent.trim() === "Add New Group") {
      window.location.href = "special.html?section=add-group";
    } else if (child.textContent.trim() === "Settings") {
      window.location.href = "special.html?section=settings";
    } else {
      console.log(child.textContent); // Default case
    }
  });
});

