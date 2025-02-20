document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('open');
    });
});

// File input preview
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.querySelector('input[type="file"]');
    const preview = document.createElement('img');
    preview.style.maxWidth = '100%';
    preview.style.marginTop = '10px';

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                fileInput.insertAdjacentElement('afterend', preview);
            };
            reader.readAsDataURL(file);
        }
    });
});