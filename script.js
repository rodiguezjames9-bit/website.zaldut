const textToType = "Welcome to myWebsite ";
let charIndex = 0;

// 1. Efek Ketikan Awal
function typeWriter() {
    const target = document.getElementById('typing-target');
    if (target && charIndex < textToType.length) {
        // Buat elemen span untuk tiap huruf
        const span = document.createElement('span');
        span.className = 'char-fade';
        
        // Jika karakter adalah spasi, gunakan spasi non-breaking agar tidak berantakan
        span.innerHTML = textToType.charAt(charIndex) === " " ? "&nbsp;" : textToType.charAt(charIndex);
        
        target.appendChild(span);
        charIndex++;
        
        // Atur kecepatan ketikan (150ms)
        setTimeout(typeWriter, 150);
    } else {
        // Setelah selesai mengetik, munculkan tombol enter
        const enterBtn = document.getElementById('enterBtn');
        if(enterBtn) enterBtn.classList.add('show-btn');
    }
}
window.onload = typeWriter;

// 2. Masuk ke Web Pertama Kali
function startSystem() {
    // Kode transisi intro kamu...
    document.getElementById('intro-layer').style.opacity = '0';
    
    // --- TAMBAHKAN INI ---
    const myAudio = document.getElementById("myAudio");
    myAudio.currentTime = 40; // Mulai di detik ke-60
    myAudio.play();
    
    // Update ikon tombol musik jadi Pause karena musik sudah jalan
    document.getElementById('musicBtn').classList.add('music-playing');
    document.getElementById('music-icon').innerText = "⏸️";
    // ---------------------

    setTimeout(() => {
        document.getElementById('intro-layer').style.display = 'none';
        document.getElementById('main-ui').classList.add('fade-in');
    }, 1000);
}

// 3. Fungsi Navigasi: Tampilkan About Me (Home)
function showHome() {
    document.getElementById('home-content').classList.remove('hidden');
    document.getElementById('message-module').classList.add('hidden');
 
}

// 4. Fungsi Navigasi: Tampilkan "Pintu" Pesan
function openMessageGate() {
    const overlay = document.getElementById('transition-overlay');
    const homeMusic = document.getElementById('myAudio');
    const msgMusic = document.getElementById('msgAudio');
    
    // 1. Mulai Transisi Hitam
    overlay.classList.add('active');

    setTimeout(() => {
        // 2. Sembunyikan Home & Munculkan Pesan
        document.getElementById('home-content').style.display = 'none';
        document.getElementById('message-module').classList.remove('hidden');

        // 3. SOLUSI iOS: Paksa scroll ke atas dengan durasi 10ms
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 10);

        // 4. SOLUSI ANDROID: Logika Ganti Lagu yang Lebih Kuat
        if (homeMusic && msgMusic) {
            homeMusic.pause(); 
            homeMusic.currentTime = 0; // Reset lagu lama agar Android benar-benar melepasnya
            
            msgMusic.currentTime = 45; // Detik Reff lagu keduamu
            
            // Berikan sedikit jeda sebelum play agar Android tidak error
            setTimeout(() => {
                msgMusic.play().catch(e => console.log("Musik tertahan browser"));
            }, 50);
            
            document.getElementById('music-icon').innerText = "💌"; 
        }

        // 5. Buka kembali layar hitam
        overlay.classList.remove('active');
    }, 800);
}
function showHome() {
    const overlay = document.getElementById('transition-overlay');
    overlay.classList.add('active');

    setTimeout(() => {
        document.getElementById('home-content').style.display = 'block';
        document.getElementById('message-module').classList.add('hidden');

        const homeMusic = document.getElementById('myAudio');
        const msgMusic = document.getElementById('msgAudio');

        if (homeMusic && msgMusic) {
            msgMusic.pause();
            homeMusic.currentTime = 8; // Kembali ke Reff lagu utama
            homeMusic.play();
            document.getElementById('music-icon').innerText = "🎵";
        }

        overlay.classList.remove('active');
    }, 800);
}

// 5. Fungsi Klik ENTER di dalam Pesan
function revealMessages() {
    const gate = document.getElementById('message-gate');
    const actual = document.getElementById('actual-messages');

    gate.style.opacity = '0';
    setTimeout(() => {
        gate.classList.add('hidden');
        gate.style.opacity = '1';
        actual.classList.remove('hidden');
        actual.style.animation = 'fadeIn 1s forwards';
    }, 800);
}
function runCommandInstantly(value) {
    if (!value) return; // Jika tidak ada yang dipilih, jangan lakukan apa-apa

    if (value === "messages") {
        openMessageGate(); 
    } else if (value === "contact") {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }

    // Optional: Kembalikan ke pilihan awal setelah beberapa saat
    setTimeout(() => {
        document.getElementById('access-select').value = "";
    }, 1000);
}

// Fungsi ini akan memastikan audio siap diputar
window.addEventListener('click', function() {
    const audio = document.getElementById("myAudio");
    // Ini tidak memutar lagu, hanya "mempersiapkan" izin dari browser
    myAudio.currentTime= 47; 
}, { once: true }); // Hanya berjalan satu kali klik saja

function attemptAutoplay() {
    myAudio.play().then(() => {
        // Jika berhasil autoplay
        document.getElementById('musicBtn').classList.add('music-playing');
        document.getElementById('music-icon').innerText = "⏸️";
    }).catch(error => {
        // Jika diblokir browser, musik akan main otomatis saat klik pertama di mana saja
        console.log("Autoplay diblokir, menunggu klik pertama user...");
        
        window.addEventListener('click', () => {
            myAudio.play();
            document.getElementById('musicBtn').classList.add('music-playing');
            document.getElementById('music-icon').innerText = "⏸️";
        }, { once: true });
    });
}

function toggleMusic() {
    const homeMusic = document.getElementById("myAudio");
    const msgMusic = document.getElementById("msgAudio");
    const btn = document.getElementById("musicBtn");
    const icon = document.getElementById("music-icon");

    // Cek halaman mana yang sedang aktif
    const isMessagePage = !document.getElementById('message-module').classList.contains('hidden');
    
    // Pilih audio target berdasarkan halaman
    const activeAudio = isMessagePage ? msgMusic : homeMusic;
    const inactiveAudio = isMessagePage ? homeMusic : msgMusic;

    if (!activeAudio) return;

    // Pastikan lagu yang tidak aktif benar-benar mati
    if (inactiveAudio) inactiveAudio.pause();

    if (activeAudio.paused) {
        activeAudio.play().catch(e => console.log("Musik tertahan"));
        btn.classList.add('music-playing');
        icon.innerText = isMessagePage ? "💌" : "⏸️";
    } else {
        activeAudio.pause();
        btn.classList.remove('music-playing');
        icon.innerText = "🎵";
    }

}

