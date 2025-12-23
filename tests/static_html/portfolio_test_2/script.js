document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  // Get stored theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.classList.add(savedTheme === "dark" ? "dark" : "light");
  } else {
    // Use system preference if no saved theme
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      body.classList.add("dark");
    }
  }

  // Toggle theme
  themeToggle.addEventListener("click", function () {
    body.classList.toggle("dark");
    body.classList.toggle("light");
    localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
  });
});