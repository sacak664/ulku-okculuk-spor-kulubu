// Admin Panel JavaScript
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '1234'
};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    checkAdminStatus();
    setupEventListeners();
});

// Admin durumunu kontrol et
function checkAdminStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const loginContainer = document.getElementById('loginContainer');
    const adminContainer = document.getElementById('adminContainer');

    if (isLoggedIn) {
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'flex';
        loadGalleryManagement();
        loadContent();
        loadSettings();
    } else {
        loginContainer.style.display = 'flex';
        adminContainer.style.display = 'none';
    }
}

// Event listener'ları ayarla
function setupEventListeners() {
    // Login Form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Tab Navigation
    document.querySelectorAll('.nav-item').forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Upload Form
    document.getElementById('uploadForm').addEventListener('submit', handleUpload);

    // Content Form
    document.getElementById('contentForm').addEventListener('submit', handleContentSave);

    // Settings Form
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsSave);

    // Clear Gallery Button
    document.getElementById('clearGalleryBtn').addEventListener('click', handleClearGallery);
}

// Login işleme
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginError');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        errorMsg.textContent = '';
        checkAdminStatus();
    } else {
        errorMsg.textContent = '❌ Kullanıcı adı veya şifre hatalı!';
    }
}

// Logout işleme
function handleLogout() {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        localStorage.setItem('adminLoggedIn', 'false');
        document.getElementById('loginForm').reset();
        checkAdminStatus();
    }
}

// Tab'ı değiştir
function switchTab(tabName) {
    // Tüm tab içeriklerini gizle
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Tüm nav butonlarını deaktif et
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });

    // Seçilen tab'ı göster
    document.getElementById(tabName + '-tab').classList.add('active');

    // Seçilen butonu aktif et
    event.target.classList.add('active');
}

// Resim yükleme
function handleUpload(e) {
    e.preventDefault();

    const title = document.getElementById('imageTitle').value;
    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Lütfen bir resim seçin!');
        return;
    }

    // Dosya boyutu kontrolü (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        alert('Resim dosyası 5MB\'dan küçük olmalıdır!');
        return;
    }

    // FileReader ile resmi okuyma
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;

        // Galeriyi al
        let gallery = JSON.parse(localStorage.getItem('gallery')) || [];

        // Yeni resmi ekle
        gallery.push({
            id: Date.now(),
            title: title,
            image: imageData
        });

        // Galeriyi kaydet
        localStorage.setItem('gallery', JSON.stringify(gallery));

        alert('✅ Resim başarıyla eklendi!');
        document.getElementById('uploadForm').reset();
        loadGalleryManagement();
    };

    reader.readAsDataURL(file);
}

// Galeri yönetimini yükle
function loadGalleryManagement() {
    const gallery = JSON.parse(localStorage.getItem('gallery')) || [];
    const container = document.getElementById('galleryManagement');

    if (gallery.length === 0) {
        container.innerHTML = '<p class="empty-message">Henüz resim eklenmemiştir.</p>';
        return;
    }

    container.innerHTML = '';

    gallery.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item-admin';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="gallery-item-admin-info">
                <div class="gallery-item-admin-title">${item.title}</div>
                <div class="gallery-item-admin-actions">
                    <button class="btn-delete" onclick="deleteGalleryItem(${item.id})">🗑️ Sil</button>
                </div>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

// Galeri öğesini sil
function deleteGalleryItem(id) {
    if (confirm('Bu resmi silmek istediğinize emin misiniz?')) {
        let gallery = JSON.parse(localStorage.getItem('gallery')) || [];
        gallery = gallery.filter(item => item.id !== id);
        localStorage.setItem('gallery', JSON.stringify(gallery));
        loadGalleryManagement();
        alert('✅ Resim silindi!');
    }
}

// İçerik 'i yükle
function loadContent() {
    const content = JSON.parse(localStorage.getItem('content')) || {
        aboutText: 'Ülkü Okçuluk Spor Kulübü olarak, Türkiye Okçuluk Federasyonu\'na bağlı vizeli bir kulüp olmanın gururuyla profesyonel sporcu yetiştirmeye devam ediyoruz.',
        contactInfo: 'Telefon: +90 552 240 99 25\nEmail: gaziantepulkuokculuk@gmail.com\nAdres: Gaziantep, Türkiye'
    };

    document.getElementById('aboutText').value = content.aboutText;
    document.getElementById('contactInfo').value = content.contactInfo;
}

// İçeriği kaydet
function handleContentSave(e) {
    e.preventDefault();

    const content = {
        aboutText: document.getElementById('aboutText').value,
        contactInfo: document.getElementById('contactInfo').value
    };

    localStorage.setItem('content', JSON.stringify(content));

    const message = document.getElementById('contentMessage');
    message.textContent = '✅ İçerik başarıyla kaydedildi!';
    message.style.display = 'block';

    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

// Ayarları yükle
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings')) || {
        siteName: 'Ülkü Okçuluk Spor Kulübü',
        siteEmail: 'gaziantepulkuokculuk@gmail.com',
        sitePhone: '+90 552 240 99 25'
    };

    document.getElementById('siteName').value = settings.siteName;
    document.getElementById('siteEmail').value = settings.siteEmail;
    document.getElementById('sitePhone').value = settings.sitePhone;
}

// Ayarları kaydet
function handleSettingsSave(e) {
    e.preventDefault();

    const settings = {
        siteName: document.getElementById('siteName').value,
        siteEmail: document.getElementById('siteEmail').value,
        sitePhone: document.getElementById('sitePhone').value
    };

    localStorage.setItem('settings', JSON.stringify(settings));

    const message = document.getElementById('settingsMessage');
    message.textContent = '✅ Ayarlar başarıyla kaydedildi!';
    message.style.display = 'block';

    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

// Galeriyi temizle
function handleClearGallery() {
    const confirmed = confirm('⚠️ TÜM RESİMLERİ SİLMEK ÜZERESİNİZ! Emin misiniz?');
    
    if (confirmed) {
        const doubleConfirm = confirm('Lütfen onay için "Evet"e tıklayın. Bu işlem geri alınamaz!');
        
        if (doubleConfirm) {
            localStorage.setItem('gallery', JSON.stringify([]));
            loadGalleryManagement();
            alert('✅ Galeri temizlendi!');
        }
    }
}
