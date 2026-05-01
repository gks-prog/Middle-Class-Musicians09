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

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverElements = document.querySelectorAll('.sfx-hover, a, button');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Smooth trailing for outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// Preloader & Hero Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to(".preloader-bar", { width: "100%", duration: 1.5, ease: "power2.inOut" })
      .to("#preloader", { yPercent: -100, duration: 0.8, ease: "power2.inOut" })
      .from(".gsap-nav", { y: -50, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-title .line", { y: 100, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }, "-=0.6")
      .from(".gsap-fade-delay", { opacity: 0, y: 20, duration: 0.8, stagger: 0.2 }, "-=0.4")
      .from(".hero-right", { opacity: 0, scale: 0.95, duration: 1 }, "-=0.5");
});

// Scroll Animations (GSAP)
gsap.utils.toArray('.gsap-fade-up').forEach(element => {
    gsap.from(element, {
        scrollTrigger: { trigger: element, start: "top 85%" },
        y: 50, opacity: 0, duration: 0.8, ease: "power2.out"
    });
});

// Hero Slider Autoplay
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}, 4000);

// Interactive Magic Hub Node Explosion
const magicBtn = document.getElementById('magic-btn');
const subNodes = document.querySelectorAll('.sub-node');
let nodesExpanded = false;

magicBtn.addEventListener('click', () => {
    if (!nodesExpanded) {
        gsap.to(subNodes, {
            opacity: 1, scale: 1,
            x: (i) => Math.cos(i * (Math.PI * 2) / subNodes.length) * 150,
            y: (i) => Math.sin(i * (Math.PI * 2) / subNodes.length) * 150,
            duration: 0.8, stagger: 0.05, ease: "back.out(1.5)"
        });
        magicBtn.innerText = "Collapse";
    } else {
        gsap.to(subNodes, { x: 0, y: 0, opacity: 0, scale: 0.5, duration: 0.5, ease: "power2.in" });
        magicBtn.innerText = "Studio Capabilities";
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
// Global Audio Player & Canvas Waveform Logic
// ----------------------------------------------------
const tracks = document.querySelectorAll('.track-trigger');
const globalPlayer = document.getElementById('global-player');
const playerCover = document.getElementById('player-cover');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playBtn = document.getElementById('player-play-btn');
const closeBtn = document.getElementById('player-close-btn');

const canvas = document.getElementById('waveform-canvas');
const ctx = canvas.getContext('2d');

let isPlaying = false;
let animationId;
let bars = Array.from({ length: 40 }, () => Math.random() * 30 + 5); 

// Draw Canvas Waveform Simulation
function drawWaveform() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / bars.length - 2;
    
    for (let i = 0; i < bars.length; i++) {
        // Only animate height if playing
        if(isPlaying) {
            bars[i] = Math.max(5, Math.min(35, bars[i] + (Math.random() - 0.5) * 10));
        } else {
            bars[i] = Math.max(5, bars[i] - 1); // shrink when paused
        }

        const barHeight = bars[i];
        const x = i * (barWidth + 2);
        const y = (canvas.height - barHeight) / 2;
        
        ctx.fillStyle = '#d4af37'; // Gold Accent
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
    }
    animationId = requestAnimationFrame(drawWaveform);
}
drawWaveform(); // Start loop

// Track Click Logic
tracks.forEach(track => {
    track.addEventListener('click', () => {
        // Populate UI
        playerTitle.innerText = track.dataset.title;
        playerArtist.innerText = track.dataset.artist;
        playerCover.src = track.dataset.cover;
        
        // Show Player & Set State to Playing
        globalPlayer.classList.remove('hidden');
        globalPlayer.classList.add('playing');
        isPlaying = true;
        
        // Toggle Icons
        playBtn.querySelector('.icon-play').style.display = 'none';
        playBtn.querySelector('.icon-pause').style.display = 'block';
    });
});

// Player Controls
playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if(isPlaying) {
        globalPlayer.classList.add('playing');
        playBtn.querySelector('.icon-play').style.display = 'none';
        playBtn.querySelector('.icon-pause').style.display = 'block';
    } else {
        globalPlayer.classList.remove('playing');
        playBtn.querySelector('.icon-play').style.display = 'block';
        playBtn.querySelector('.icon-pause').style.display = 'none';
    }
});

closeBtn.addEventListener('click', () => {
    globalPlayer.classList.add('hidden');
    globalPlayer.classList.remove('playing');
    isPlaying = false;
});
