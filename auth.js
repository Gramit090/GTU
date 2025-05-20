// Authentication utility functions
const auth = {
    // Check if user is logged in
    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    },

    // Get current user
    getCurrentUser() {
        return localStorage.getItem('currentUser');
    },

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },

    // Protect a route - redirect to login if not authenticated
    protectRoute() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

// Initialize auth check when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // List of protected routes
    const protectedRoutes = ['/gallery.html', '/chat.html'];
    
    // Check if current page is protected
    if (protectedRoutes.some(route => currentPath.endsWith(route))) {
        auth.protectRoute();
    }
});

async function register(nickname, password) {
    try {
        // First check if nickname exists in users.json
        const response = await fetch('users.json');
        const users = await response.json();
        
        if (users[nickname]) {
            throw new Error('This nickname is already taken');
        }

        // Create new user object
        const newUser = {
            nickname,
            password,
            selfie: null
        };

        // Get existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists in localStorage
        if (existingUsers.some(user => user.nickname === nickname)) {
            throw new Error('This nickname is already taken');
        }

        // Add new user to localStorage
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        // Update users.json
        users[nickname] = { password };
        await fetch('users.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(users, null, 2)
        });

        // Set current user
        localStorage.setItem('currentUser', nickname);
        
        // Redirect to gallery
        window.location.href = 'gallery.html';
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
} 