/**
 * Theme switcher for the File Hasher application
 */

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeStylesheet = document.getElementById('theme-stylesheet');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
    
    /**
     * Set the theme and update UI elements
     * @param {string} theme - The theme to set ('light' or 'dark')
     */
    function setTheme(theme) {
        // Update stylesheet
        themeStylesheet.href = `/css/style-${theme}.css`;
        
        // Update button icon
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'bi bi-sun';
        } else {
            icon.className = 'bi bi-moon';
        }
        
        // Save preference
        localStorage.setItem('theme', theme);
    }
});