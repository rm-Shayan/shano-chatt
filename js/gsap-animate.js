document.addEventListener('DOMContentLoaded', () => {
    // Create splash screen
    const splashScreen = document.createElement('div');
    splashScreen.className = 'fixed inset-0 bg-[#1e88e5] flex items-center justify-center z-50';
    splashScreen.innerHTML = `
        <div class="text-center">
            <div class="logo-container mb-4">
                <i class="fas fa-comments text-white text-6xl"></i>
            </div>
            <h1 class="text-white text-2xl font-bold">Shano Chat</h1>
        </div>
    `;
    document.body.appendChild(splashScreen);

    // Create timeline for all animations
    const tl = gsap.timeline();

    // Splash screen animation
    tl.to('.logo-container', {
        duration: 1,
        scale: 1.2,
        rotation: 360,
        ease: 'back.out(1.7)'
    })
    .to('.logo-container', {
        duration: 0.5,
        scale: 1,
        ease: 'power2.inOut'
    })
    .to(splashScreen, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
            splashScreen.remove();
            // Start main animations after splash screen
            startMainAnimations();
        }
    });

    function startMainAnimations() {
        // Sidebar animation
        gsap.from('.w-80', {
            duration: 0.5,
            x: -100,
            opacity: 0,
            ease: 'power2.out'
        });

        // Main chat area animation
        gsap.from('.flex-1', {
            duration: 0.5,
            x: 100,
            opacity: 0,
            ease: 'power2.out',
            delay: 0.2
        });

        // Chat items stagger animation
        gsap.from('.chat-item', {
            duration: 0.3,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            delay: 0.4
        });

        // Header elements animation
        gsap.from('.bg-[#1e88e5] > *', {
            duration: 0.4,
            y: -20,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.6
        });

        // Input area animation
        gsap.from('.bg-blue-50', {
            duration: 0.4,
            y: 20,
            opacity: 0,
            ease: 'power2.out',
            delay: 0.8
        });
    }

    // UI Management Functions
    function initializeUI() {
        setupChatItems();
        setupMessageInput();
        setupButtons();
        setupMobileMenu();
        setupSearchBar();
    }

    function setupChatItems() {
        document.querySelectorAll('.chat-item').forEach(item => {
            // Hover animation
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    duration: 0.2,
                    scale: 1.02,
                    ease: 'power2.out'
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.in'
                });
            });

            // Click animation and active state
            item.addEventListener('click', () => {
                // Remove active class from all items
                document.querySelectorAll('.chat-item').forEach(i => {
                    i.classList.remove('active', 'bg-blue-100');
                    gsap.to(i, {
                        duration: 0.2,
                        scale: 1,
                        ease: 'power2.in'
                    });
                });

                // Add active class to clicked item
                item.classList.add('active', 'bg-blue-100');
                gsap.to(item, {
                    duration: 0.2,
                    scale: 1.02,
                    ease: 'power2.out'
                });

                // Update chat header
                updateChatHeader(item);
            });
        });
    }

    function setupMessageInput() {
        const messageInput = document.querySelector('input[type="text"]');
        if (messageInput) {
            // Focus animation
            messageInput.addEventListener('focus', () => {
                gsap.to(messageInput, {
                    duration: 0.2,
                    scale: 1.02,
                    ease: 'power2.out'
                });
            });

            messageInput.addEventListener('blur', () => {
                gsap.to(messageInput, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.in'
                });
            });

            // Enter key handling
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const text = messageInput.value.trim();
                    if (text) {
                        // Add message sending animation
                        gsap.to(messageInput, {
                            duration: 0.1,
                            scale: 0.98,
                            ease: 'power2.in',
                            onComplete: () => {
                                gsap.to(messageInput, {
                                    duration: 0.1,
                                    scale: 1,
                                    ease: 'power2.out'
                                });
                            }
                        });
                        // Add your message sending logic here
                    }
                }
            });
        }
    }

    function setupButtons() {
        document.querySelectorAll('button').forEach(button => {
            // Hover animation
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    duration: 0.2,
                    scale: 1.1,
                    ease: 'power2.out'
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.in'
                });
            });

            // Click animation
            button.addEventListener('click', () => {
                gsap.to(button, {
                    duration: 0.1,
                    scale: 0.95,
                    ease: 'power2.in',
                    onComplete: () => {
                        gsap.to(button, {
                            duration: 0.1,
                            scale: 1,
                            ease: 'power2.out'
                        });
                    }
                });
            });
        });
    }

    function setupMobileMenu() {
        const mobileMenuButton = document.createElement('button');
        mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuButton.className = 'lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1e88e5] text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors';
        document.body.appendChild(mobileMenuButton);

        const sidebar = document.querySelector('.w-80');
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (sidebar.classList.contains('active')) {
                gsap.to(sidebar, {
                    duration: 0.3,
                    x: 0,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(sidebar, {
                    duration: 0.3,
                    x: '-100%',
                    ease: 'power2.in'
                });
            }
        });
    }

    function setupSearchBar() {
        const searchInput = document.querySelector('input[placeholder="Search or start new chat"]');
        if (searchInput) {
            // Focus animation
            searchInput.addEventListener('focus', () => {
                gsap.to(searchInput, {
                    duration: 0.2,
                    scale: 1.02,
                    ease: 'power2.out'
                });
            });

            searchInput.addEventListener('blur', () => {
                gsap.to(searchInput, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.in'
                });
            });

            // Search animation
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                // Add your search logic here
                console.log('Searching for:', searchTerm);
            });
        }
    }

    function updateChatHeader(chatItem) {
        const header = document.querySelector('.bg-[#1e88e5]');
        const userAvatar = chatItem.querySelector('img').src;
        const userName = chatItem.querySelector('h3').textContent;
        const isOnline = chatItem.querySelector('.bg-green-500') !== null;

        // Animate header update
        gsap.to(header, {
            duration: 0.3,
            opacity: 0,
            onComplete: () => {
                header.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <img src="${userAvatar}" alt="avatar" class="w-10 h-10 rounded-full">
                        <div>
                            <h2 class="text-white font-semibold">${userName}</h2>
                            <p class="text-sm ${isOnline ? 'text-green-300' : 'text-blue-100'}">${isOnline ? 'online' : 'offline'}</p>
                        </div>
                    </div>
                    <div class="flex space-x-6">
                        <button class="text-white hover:text-blue-100 transition-colors">
                            <i class="fas fa-search text-xl"></i>
                        </button>
                        <button class="text-white hover:text-blue-100 transition-colors">
                            <i class="fas fa-phone-alt text-xl"></i>
                        </button>
                        <button class="text-white hover:text-blue-100 transition-colors">
                            <i class="fas fa-video text-xl"></i>
                        </button>
                        <button class="text-white hover:text-blue-100 transition-colors">
                            <i class="fas fa-info-circle text-xl"></i>
                        </button>
                    </div>
                `;
                gsap.to(header, {
                    duration: 0.3,
                    opacity: 1
                });
            }
        });
    }

    // Initialize UI after splash screen
    setTimeout(initializeUI, 2000);

    // Handle window resize
    window.addEventListener('resize', () => {
        const sidebar = document.querySelector('.w-80');
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            gsap.to(sidebar, {
                duration: 0.3,
                x: 0,
                ease: 'power2.out'
            });
        }
    });
});
