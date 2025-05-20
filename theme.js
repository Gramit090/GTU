// Theme management
const theme = {
    currentTheme: localStorage.getItem('theme') || 'light',

    init() {
        this.setTheme(this.currentTheme);
        this.updateThemeSwitcher();
    },

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    },

    updateThemeSwitcher() {
        const switcher = document.querySelector('.theme-switcher');
        if (switcher) {
            switcher.innerHTML = `
                <i class="fas ${this.currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
                <span>${this.currentTheme === 'dark' ? 'Light' : 'Dark'}</span>
            `;
        }
    },

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.updateThemeSwitcher();
    }
};

// Initialize theme system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => theme.init()); 