document.addEventListener('DOMContentLoaded', () => {
    setupMobileNavigation();
    updateYear();
    loadGallery();
});

function setupMobileNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Menüyü aç');
        });
    });
}

function updateYear() {
    const year = document.getElementById('year');

    if (year) {
        year.textContent = String(new Date().getFullYear());
    }
}

function loadGallery() {
    const galleryContainer = document.getElementById('galleryContainer');

    if (!galleryContainer) {
        return;
    }

    let galleryData = [];

    try {
        galleryData = JSON.parse(localStorage.getItem('gallery')) || [];
    } catch {
        galleryData = [];
    }

    if (!Array.isArray(galleryData) || galleryData.length === 0) {
        return;
    }

    galleryContainer.innerHTML = '';

    galleryData.forEach((item) => {
        if (!item || !item.image) {
            return;
        }

        const title = item.title || 'Ülkü Okçuluk';
        const galleryItem = document.createElement('article');
        const image = document.createElement('img');
        const heading = document.createElement('h3');

        galleryItem.className = 'gallery-card';
        image.src = item.image;
        image.alt = title;
        image.loading = 'lazy';
        heading.textContent = title;

        galleryItem.append(image, heading);
        galleryContainer.appendChild(galleryItem);
    });
}
