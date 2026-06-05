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

// Galeriden resimleri yükle
function loadGallery() {
    const galleryContainer = document.getElementById('galleryContainer');
    if (!galleryContainer) return;
    
    // localStorage'dan galeriyi al
    const galleryData = JSON.parse(localStorage.getItem('gallery')) || [];
    // önce varsa önceki içeriği temizle
    galleryContainer.innerHTML = '';

    // Eğer hiç resim yoksa mesaj göster
    if (galleryData.length === 0) {
        galleryContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.2rem; color: #666;">Henüz resim eklenmemiştir.</p>
            </div>
        `;
        return;
    }

    // Galeriyi oluştur
    galleryData.forEach((item) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="gallery-item-title">${item.title}</div>
        `;
        galleryContainer.appendChild(galleryItem);
    });
}
