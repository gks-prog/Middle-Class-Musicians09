// Initialize Icons
lucide.createIcons();

// PERFORMANCE: Strict Lenis Setup[cite: 3]
// smoothTouch: false prevents scroll-hijacking lag on iOS/Android
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false 
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// PERFORMANCE: Custom Cursor Logic (Isolated to Desktop)[cite: 3]
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverElements = document.querySelectorAll('.sfx-hover, a, button, .portfolio-item');
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function renderCursor() {
        outlineX += (mouseX - outlineX) * 0.15; // Smoother lerp
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.borderColor = 'var(--accent)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'var(--border)';
        });
    });
}

// Cinematic Preloader Timeline
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to(".preloader-bar", { width: "100%", duration: 1.2, ease: "expo.inOut" })
      .to(".preloader-title", { opacity: 0, duration: 0.4 }, "-=0.4")
      .to("#preloader", { yPercent: -100, duration: 0.8, ease: "expo.inOut" })
      .from(".gsap-nav", { y: -30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.4")
      .from(".hero-title .line", { y: "110%", duration: 1, stagger: 0.1, ease: "power4.out" }, "-=0.8")
      .from(".gsap-fade-delay", { opacity: 0, y: 20, duration: 1, stagger: 0.1, ease: "power2.out" }, "-=0.6")
      .from(".hero-slider .slide", { scale: 1.1, duration: 2, ease: "power2.out" }, "-=1.2");
});

// Scroll Animations (GSAP)
gsap.utils.toArray('.gsap-fade-up').forEach(element => {
    gsap.from(element, {
        scrollTrigger: { trigger: element, start: "top 85%" },
        y: 40, opacity: 0, duration: 1, ease: "power3.out"
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
    }, 5000);
}

// ----------------------------------------------------
// ANTI-OVERLAP ELLIPTICAL NODE BURST (Logic Preserved)[cite: 3]
// ----------------------------------------------------
const magicBtn = document.getElementById('magic-btn');
const subNodes = document.querySelectorAll('.sub-node');
let nodesExpanded = false;

magicBtn.addEventListener('click', () => {
    // Dynamic radii based on screen size[cite: 3]
    const radiusX = window.innerWidth < 768 ? 130 : 300;
    const radiusY = window.innerWidth < 768 ? 100 : 180;
    
    if (!nodesExpanded) {
        gsap.to(magicBtn, { opacity: 0, duration: 0.2, onComplete: () => {
            magicBtn.innerText = "One Stop Solution for artists"; // Exact text preserved[cite: 3]
            gsap.to(magicBtn, { opacity: 1, duration: 0.2 });
        }});

        gsap.to(subNodes, {
            opacity: 1, scale: 1,
            // Math strictly preserved[cite: 3]
            x: (i) => Math.cos((i * (Math.PI * 2) / subNodes.length) - Math.PI/2) * radiusX,
            y: (i) => Math.sin((i * (Math.PI * 2) / subNodes.length) - Math.PI/2) * radiusY,
            duration: 1, stagger: 0.05, ease: "expo.out"
        });
    } else {
        gsap.to(magicBtn, { opacity: 0, duration: 0.2, onComplete: () => {
            magicBtn.innerText = "don't touch it"; // Exact text preserved[cite: 3]
            gsap.to(magicBtn, { opacity: 1, duration: 0.2 });
        }});
        gsap.to(subNodes, { x: 0, y: 0, opacity: 0, scale: 0.5, duration: 0.5, ease: "power3.inOut" });
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
// FROSTED GLASS MINI PLAYER LOGIC[cite: 3]
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
        // Only prevent default if clicking directly on a track, not nested links
        if(e.target.tagName !== 'A') e.preventDefault(); 
        
        const src = track.getAttribute('data-src');
        const title = track.getAttribute('data-title');
        const cover = track.getAttribute('data-cover');
        
        fpTitle.innerText = title;
        fpCover.src = cover;
        
        if (audioEl.src !== src) {
            audioEl.src = src;
        }
        
        audioEl.play().then(() => {
            fPlayer.classList.add('active');
            updatePlayerUI(true);
        }).catch(err => console.error("Playback failed:", err));
    });
});

fpPlayBtn.addEventListener('click', () => {
    audioEl.paused ? (audioEl.play(), updatePlayerUI(true)) : (audioEl.pause(), updatePlayerUI(false));
});

fpCloseBtn.addEventListener('click', () => {
    audioEl.pause();
    updatePlayerUI(false);
    fPlayer.classList.remove('active');
});

audioEl.addEventListener('ended', () => updatePlayerUI(false));
