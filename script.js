// Initialize Icons
lucide.createIcons();

// Lenis Smooth Scroll Setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Custom Cursor Logic (Only active if device supports hover)
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverElements = document.querySelectorAll('.sfx-hover, a, button, .portfolio-item');

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 400, fill: "forwards" });
    });

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
            cursorOutline.style.borderColor = 'rgba(212, 175, 55, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '36px';
            cursorOutline.style.height = '36px';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'var(--text-secondary)';
        });
    });
}

// Preloader & Hero Animation Timeline
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to(".preloader-title", { opacity: 1, duration: 0.8, ease: "power2.out" })
      .to(".preloader-bar", { width: "100%", duration: 1.2, ease: "power2.inOut" }, "-=0.2")
      .to("#preloader", { yPercent: -100, duration: 0.8, ease: "power2.inOut", delay: 0.2 })
      .from(".gsap-nav", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .from(".hero-title .line", { y: "110%", duration: 0.8, stagger: 0.15, ease: "power4.out" }, "-=0.6")
      .from(".gsap-fade-delay", { opacity: 0, y: 20, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.4")
      .from(".hero-slider .slide", { scale: 1.1, duration: 1.5, ease: "power2.out" }, "-=1");
});

// Scroll Animations (GSAP)
gsap.utils.toArray('.gsap-fade-up').forEach(element => {
    gsap.from(element, {
        scrollTrigger: { trigger: element, start: "top 85%" },
        y: 40, opacity: 0, duration: 0.8, ease: "power3.out"
    });
});

// Hero Slider Autoplay
const slides = document.querySelectorAll('.slide');
if(slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4500);
}

// Interactive Magic Hub Node Logic
const magicBtn = document.getElementById('magic-btn');
const subNodes = document.querySelectorAll('.sub-node');
let nodesExpanded = false;

magicBtn.addEventListener('click', () => {
    if (!nodesExpanded) {
        // Expand
        magicBtn.innerText = "One Stop Solution for artists";
        // Calculate dynamic radius based on screen size
        const radius = window.innerWidth < 768 ? 120 : 180;
        
        gsap.to(subNodes, {
            opacity: 1, scale: 1,
            x: (i) => Math.cos(i * (Math.PI * 2) / subNodes.length) * radius,
            y: (i) => Math.sin(i * (Math.PI * 2) / subNodes.length) * radius,
            duration: 0.8, stagger: 0.05, ease: "back.out(1.5)"
        });
    } else {
        // Collapse
        magicBtn.innerText = "don't touch it";
        gsap.to(subNodes, { x: 0, y: 0, opacity: 0, scale: 0.5, duration: 0.5, ease: "power2.in" });
    }
    nodesExpanded = !nodesExpanded;
});

// Theme Toggle
const themeBtn = document.getElementById('theme-btn');
themeBtn.addEventListener('click', () => {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

// ----------------------------------------------------
// NATIVE AUDIO INTEGRATION (Floating Pill Player)
// ----------------------------------------------------
const tracks = document.querySelectorAll('.track-trigger');
const fPlayer = document.getElementById('floating-player');
const audioEl = document.getElementById('native-audio');

const fpCover = document.getElementById('fp-cover');
const fpTitle = document.getElementById('fp-title');
const fpPlayBtn = document.getElementById('fp-play-btn');
const fpCloseBtn = document.getElementById('fp-close-btn');
const playIcon = fpPlayBtn.querySelector('.icon-play');
const pauseIcon = fpPlayBtn.querySelector('.icon-pause');

// Helper to switch Play/Pause UI
function updatePlayerUI(isPlaying) {
    if (isPlaying) {
        fPlayer.classList.remove('paused');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        fPlayer.classList.add('paused');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

tracks.forEach(track => {
    track.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default if wrapped in anchor tags later
        
        const src = track.getAttribute('data-src');
        const title = track.getAttribute('data-title');
        const cover = track.getAttribute('data-cover');
        
        // Update UI
        fpTitle.innerText = title;
        fpCover.src = cover;
        
        // Load and Play Audio
        if (audioEl.src !== src) {
            audioEl.src = src;
        }
        
        audioEl.play().then(() => {
            fPlayer.classList.add('active');
            updatePlayerUI(true);
        }).catch(err => {
            console.error("Audio playback failed (Check Drive Link Format):", err);
            alert("Unable to play track. Ensure link is formatted as a direct download link.");
        });
    });
});

// Toggle Play/Pause from Floating Player
fpPlayBtn.addEventListener('click', () => {
    if (audioEl.paused) {
        audioEl.play();
        updatePlayerUI(true);
    } else {
        audioEl.pause();
        updatePlayerUI(false);
    }
});

// Close Player
fpCloseBtn.addEventListener('click', () => {
    audioEl.pause();
    updatePlayerUI(false);
    fPlayer.classList.remove('active');
});

// Handle Audio End natively
audioEl.addEventListener('ended', () => {
    updatePlayerUI(false);
});
