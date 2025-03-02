/**
 * Theme switcher for the FileHasher Pro application
 */

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeStylesheet = document.getElementById('theme-stylesheet');
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on saved preference or system preference
    const initialTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
    setTheme(initialTheme);
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add animation to theme toggle
        themeToggle.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            themeToggle.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
        
        setTheme(newTheme);
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        // Only change theme automatically if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    /**
     * Set the theme and update UI elements
     * @param {string} theme - The theme to set ('light' or 'dark')
     */
    function setTheme(theme) {
        // Update stylesheet with smooth transition
        document.body.style.transition = 'background 0.3s ease';
        themeStylesheet.href = `/css/style-${theme}.css`;
        
        // Update button icon with animation
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'bi bi-sun';
        } else {
            icon.className = 'bi bi-moon';
        }
        
        // Save preference
        localStorage.setItem('theme', theme);
        
        // Add theme class to body for additional styling hooks
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
    }
});