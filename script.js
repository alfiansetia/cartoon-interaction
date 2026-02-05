document.addEventListener('DOMContentLoaded', () => {
    console.log("System Interaction Active!");

    const handLeft = document.getElementById('hand-left');   
    const handRight = document.getElementById('hand-right'); 
    const mouseGlow = document.getElementById('mouse-glow');
    const mLeft = document.getElementById('m-left');
    const mRight = document.getElementById('m-right');
    const mouth = document.getElementById('mouth');
    const virtualMouse = document.getElementById('virtual-mouse');

    // --- FUNGSI AKTIVASI LAMPU ---
    function activateKey(el) {
        if (!el) return;
        el.classList.add('active');
        if (handLeft) handLeft.classList.add('pressing');
        if (mouth) mouth.classList.add('open');
    }

    function deactivateKey(el) {
        if (!el) return;
        el.classList.remove('active');
        // Angkat tangan jika tidak ada tombol lain yang menyala di layar
        if (document.querySelectorAll('.key.active').length === 0) {
            if (handLeft) handLeft.classList.remove('pressing');
            if (mouth) mouth.classList.remove('open');
        }
    }

    // --- KEYBOARD FISIK (MENGHUBUNGKAN TOMBOL NYATA KE GAMBAR) ---
    window.addEventListener('keydown', (e) => {
        // 1. Cari berdasarkan data-key (lokasi tombol)
        let code = e.code;
        
        // Normalisasi tombol (Jika tekan Ctrl Kanan, nyalakan Ctrl Kiri di gambar)
        if (code.includes('Shift')) code = 'ShiftLeft';
        if (code.includes('Control')) code = 'ControlLeft';
        if (code.includes('Alt')) code = 'AltLeft';
        if (code.includes('Meta')) code = 'MetaLeft';

        let keyElement = document.querySelector(`.key[data-key="${code}"]`);

        // 2. Failsafe: Jika tidak ketemu, cari berdasarkan teks di dalam tombol
        if (!keyElement) {
            let keyName = e.key.toUpperCase();
            if (keyName === " ") keyName = "SPACE"; // Space Bar
            
            keyElement = Array.from(document.querySelectorAll('.key')).find(el => {
                let text = el.innerText.trim().toUpperCase();
                return text === keyName || text === e.key.toUpperCase();
            });
        }

        if (keyElement) {
            activateKey(keyElement);
        }
    });

    window.addEventListener('keyup', (e) => {
        let code = e.code;
        if (code.includes('Shift')) code = 'ShiftLeft';
        if (code.includes('Control')) code = 'ControlLeft';
        if (code.includes('Alt')) code = 'AltLeft';
        if (code.includes('Meta')) code = 'MetaLeft';

        const keyElement = document.querySelector(`.key[data-key="${code}"]`);
        if (keyElement) {
            deactivateKey(keyElement);
        } else {
            // Matikan semua jika kode tidak terdeteksi spesifik (reset)
            document.querySelectorAll('.key.active').forEach(deactivateKey);
        }
    });

    // --- KLIK MOUSE FISIK ---
    window.addEventListener('mousedown', (e) => {
        if (e.button === 0 && mLeft) mLeft.classList.add('active'); // Kiri
        if (e.button === 2 && mRight) mRight.classList.add('active'); // Kanan
        if (mouseGlow) mouseGlow.classList.add('active');
    });

    window.addEventListener('mouseup', () => {
        if (mLeft) mLeft.classList.remove('active');
        if (mRight) mRight.classList.remove('active');
        if (mouseGlow) mouseGlow.classList.remove('active');
    });

    // Mencegah menu klik kanan agar bisa melihat lampu kanan
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    // --- PERGERAKAN MOUSE ---
    document.addEventListener('mousemove', (e) => {
        const scene = document.querySelector('.game-scene').getBoundingClientRect();
        let relX = (e.clientX - scene.left) / scene.width;
        let relY = (e.clientY - scene.top) / scene.height;
        relX = Math.max(0, Math.min(1, relX));
        relY = Math.max(0, Math.min(1, relY));

        // Area pad disesuaikan kembali (400px)
        const moveX = (relX * 340) - 170; 
        const moveY = (relY * 90) - 45;

        if (virtualMouse) virtualMouse.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        if (handRight) {
            handRight.style.right = `calc(${-moveX}px - 40px)`;
            handRight.style.bottom = `calc(${-moveY}px - 60px)`;
            
            // Tambahkan rotasi dinamis kearah mouse (nilai negatif untuk miring ke kanan)
            const rotateDeg = -15 + (moveX * -0.05); 
            handRight.style.transform = `rotate(${rotateDeg}deg)`;
        }
    });

    // Klik pada gambar langsung tetap didukung
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('mousedown', () => activateKey(key));
        key.addEventListener('mouseup', () => deactivateKey(key));
        key.addEventListener('mouseleave', () => deactivateKey(key));
    });
});
