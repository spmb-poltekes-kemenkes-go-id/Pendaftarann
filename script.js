// Notification helper
function showNotification(msg, isError = false) {
    const notif = document.getElementById('notification');
    notif.textContent = msg;
    notif.style.backgroundColor = isError ? '#dc2626' : '#10b981';
    notif.style.opacity = '1';
    setTimeout(() => notif.style.opacity = '0', 3000);
}

// Page transition with pushState
function navigateTo(page) {
    document.body.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = page;
    }, 200);
}

// Check current page
const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
const isRegisterPage = window.location.pathname.includes('register.html');
const isDashboardPage = window.location.pathname.includes('dashboard.html');

// Simulate "database" of users (for demo)
let users = JSON.parse(localStorage.getItem('spmb_users')) || [];

// LOGIN PAGE
if (isLoginPage) {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const pass = document.getElementById('loginPassword').value.trim();
            const user = users.find(u => u.email === email && u.password === pass);
            if (user) {
                localStorage.setItem('spmb_current_user', JSON.stringify(user));
                showNotification('Login berhasil! Mengarahkan...');
                setTimeout(() => navigateTo('dashboard.html'), 1000);
            } else {
                showNotification('Email atau password salah!', true);
            }
        });
    }
    const goRegister = document.getElementById('goToRegister');
    if (goRegister) goRegister.addEventListener('click', (e) => { e.preventDefault(); navigateTo('register.html'); });
}

// REGISTER PAGE (full form + buat akun)
if (isRegisterPage) {
    const regForm = document.getElementById('registrationForm');
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Ambil semua data
        const nama = document.getElementById('namaLengkap').value;
        const jk = document.querySelector('input[name="jk"]:checked')?.value;
        const noHp = document.getElementById('noHP').value;
        const emailReg = document.getElementById('emailReg').value;
        const tanggal = document.getElementById('tanggalLahir').value;
        const tempat = document.getElementById('tempatLahir').value;
        const kewarganegaraan = document.getElementById('kewarganegaraan').value;
        const nik = document.getElementById('nik').value;
        const provinsi = document.getElementById('provinsi').value;
        const kabupaten = document.getElementById('kabupaten').value;
        const jenisSekolah = document.getElementById('jenisSekolah').value;
        const npsn = document.getElementById('npsn').value;
        const jurusan = document.getElementById('jurusanSekolah').value;
        const tahunLulus = document.getElementById('tahunLulus').value;
        const program = document.querySelector('input[name="program"]:checked')?.value;
        const p1 = document.getElementById('pilihan1').value;
        
        if (!nama || !jk || !noHp || !emailReg || !tanggal || !tempat || !kewarganegaraan || !nik || !provinsi || !kabupaten || !jenisSekolah || !npsn || !jurusan || !tahunLulus || !program || !p1) {
            showNotification('Lengkapi semua field bertanda * !', true);
            return;
        }
        
        // Cek apakah email sudah terdaftar
        if (users.find(u => u.email === emailReg)) {
            showNotification('Email sudah terdaftar! Gunakan email lain.', true);
            return;
        }
        
        // Simpan user + data pendaftaran
        const newUser = {
            email: emailReg,
            password: "default123", // di real world pakai hash, demo ini password default agar login bisa
            fullname: nama,
            noHp, tanggalLahir: tanggal, tempatLahir: tempat,
            registrationData: { nama, jk, noHp, emailReg, tanggal, tempat, kewarganegaraan, nik, provinsi, kabupaten, jenisSekolah, npsn, jurusan, tahunLulus, program, pilihan1: p1, pilihan2: document.getElementById('pilihan2').value, pilihan3: document.getElementById('pilihan3').value }
        };
        users.push(newUser);
        localStorage.setItem('spmb_users', JSON.stringify(users));
        showNotification('Pendaftaran berhasil! Silakan login.');
        setTimeout(() => navigateTo('index.html'), 1500);
    });
    
    const goLogin = document.getElementById('goToLogin');
    if (goLogin) goLogin.addEventListener('click', (e) => { e.preventDefault(); navigateTo('index.html'); });
}

// DASHBOARD PAGE
if (isDashboardPage) {
    // Cek login
    const currentUser = JSON.parse(localStorage.getItem('spmb_current_user'));
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu', true);
        setTimeout(() => navigateTo('index.html'), 1000);
    } else {
        showNotification(`Selamat datang, ${currentUser.fullname || currentUser.email}`);
    }
    
    // Navigation smooth antar section
    const homeLink = document.getElementById('homeLink');
    const infoLink = document.getElementById('infoLink');
    const bantuanLink = document.getElementById('bantuanLink');
    const homeSection = document.getElementById('homeSection');
    const infoSection = document.getElementById('infoSection');
    const bantuanSection = document.getElementById('bantuanSection');
    
    function showSection(section) {
        [homeSection, infoSection, bantuanSection].forEach(s => s.classList.remove('active'));
        section.classList.add('active');
    }
    
    if (homeLink) homeLink.addEventListener('click', (e) => { e.preventDefault(); showSection(homeSection); });
    if (infoLink) infoLink.addEventListener('click', (e) => { e.preventDefault(); showSection(infoSection); });
    if (bantuanLink) bantuanLink.addEventListener('click', (e) => { e.preventDefault(); showSection(bantuanSection); });
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('spmb_current_user');
            showNotification('Logout berhasil');
            setTimeout(() => navigateTo('index.html'), 1000);
        });
    }
}

// Add fade out class
const style = document.createElement('style');
style.textContent = `
    body { transition: opacity 0.2s ease; }
    body.fade-out { opacity: 0; }
    select, input, button { border-radius: 0.75rem !important; }
    .btn-outline { background: transparent; border: 2px solid #10b981; padding: 0.5rem 1rem; border-radius: 2rem; text-decoration: none; display: inline-block; margin-top: 1rem; }
    .info-card ul { list-style: none; margin: 1rem 0; } .info-card li { padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0; }
`;
document.head.appendChild(style);
