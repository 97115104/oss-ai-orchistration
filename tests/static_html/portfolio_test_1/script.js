// Theme toggle logic
const toggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Initial theme: stored preference > system preference
let currentTheme = localStorage.getItem('theme');
if (!currentTheme) currentTheme = prefersDark ? 'dark' : 'light';

const applyTheme = () => {
  document.body.classList.toggle('dark', currentTheme === 'dark');
};
applyTheme();

toggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
  applyTheme();
});