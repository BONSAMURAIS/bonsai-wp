document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('single-toggle'); // Remove single toggle behavior
    });
});