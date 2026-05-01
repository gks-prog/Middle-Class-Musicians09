document.addEventListener("DOMContentLoaded", () => {
    // Lock scroll during preload
    document.body.classList.add('preloading');

    // 1. Initial Setup
    lucide.createIcons();
    window.scrollTo(0, 0); 

    // 2. Lenis Smooth Scroll Setup
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smooth: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            lenis.scrollTo(target, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    });

    // 3. Cinematic Preloader Sequence
    const preloaderTl = gsap.timeline();
    
    preloaderTl.to('.preloader-title', {
        opacity: 1,
        letterSpacing: "0.15em",
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5
    })
    .to('.preloader-bar', {
        width: "100%",
        duration: 1,
        ease: "power2.inOut"
    }, "-=1")
    .to('#preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        delay: 0.5,
        onComplete: () => {
            document.getElementById('preloader').style.display = 'none';
            document.body.classList.remove('preloading');
            initMainAnimations();
        }
    });

    // 4. Custom Cursor
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(pointer: coarse)").matches;
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!isTouchDevice && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX; const posY = e.clientY;
            cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
            cursorOutline.style.left = `${posX}px`; cursorOutline.style.top = `${posY}px`;
        });

        const hoverElements = document.querySelectorAll('.sfx-hover, a, button');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '50px';
                cursorOutline.style.height = '50px';
                cursorOutline.style.backgroundColor = 'rgba(255,255,255,0.1)';
                playSfx(600, 0.05); // subtle hover sound
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '30px';
                cursorOutline.style.height = '30px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
            el.addEventListener('click', () => playSfx(800, 0.1));
        });
    }

    // 5. Web Audio API SFX
    let audioCtx;
    function playSfx(freq, vol) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    }

    // 6. Theme Toggle
    const themeBtn = document.getElementById('theme-btn');
    themeBtn.addEventListener('click', () => {
        const body = document.body;
        const isDark = body.getAttribute('data-theme') === 'dark';
        body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });

    // 7. Hero Slider Auto-Play Fix
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }

    // 8. Interactive Button Logic
    const magicBtn = document.getElementById('magic-btn');
    const subNodes = document.querySelectorAll('.sub-node');
    let isExpanded = false;

    magicBtn.addEventListener('click', () => {
        if (!isExpanded) {
            magicBtn.innerText = "One Stop Solution";
            magicBtn.style.background = "var(--text-primary)";
            magicBtn.style.color = "var(--bg-color)";
            document.querySelector('.sub-nodes').style.pointerEvents = "auto";
            
            const radius = window.innerWidth <= 768 ? 130 : 250; 
            const angleStep = (Math.PI * 2) / subNodes.length;

            subNodes.forEach((node, index) => {
                const angle = index * angleStep - Math.PI / 2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                gsap.to(node, {
                    x: x, y: y,
                    scale: 1, opacity: 1,
                    duration: 1,
                    ease: "back.out(1.5)",
                    delay: index * 0.1
                });
            });
            isExpanded = true;
        } else {
            closeMagicMenu();
        }
    });

    subNodes.forEach(node => {
        node.addEventListener('click', () => {
            if(isExpanded) closeMagicMenu();
        });
    });

    function closeMagicMenu() {
        magicBtn.innerText = "Don't Touch It";
        magicBtn.style.background = "var(--glass-bg)";
        magicBtn.style.color = "var(--text-primary)";
        document.querySelector('.sub-nodes').style.pointerEvents = "none";
        
        gsap.to(subNodes, {
            x: 0, y: 0,
            scale: 0, opacity: 0,
            duration: 0.6,
            ease: "power2.in",
            stagger: 0.05
        });
        isExpanded = false;
    }

    // 9. Floating Equalizer Logic
    const eqPlayer = document.getElementById('eq-player');
    let isPlaying = true;
    eqPlayer.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if(isPlaying) {
            eqPlayer.classList.remove('paused');
            eqPlayer.querySelector('.track-name').innerText = "O Piyaa - Playing";
        } else {
            eqPlayer.classList.add('paused');
            eqPlayer.querySelector('.track-name').innerText = "Paused";
        }
    });

    // 10. GSAP Scroll Animations (Fired after preloader)
    function initMainAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".hero-title .line", {
            y: "110%", duration: 1.5, stagger: 0.15, ease: "power4.out"
        });
        
        gsap.from(".gsap-fade-delay", {
            opacity: 0, y: 20, duration: 1.2, stagger: 0.1, ease: "power3.out", delay: 0.5
        });
        
        gsap.utils.toArray('.gsap-reveal').forEach(header => {
            gsap.from(header, {
                scrollTrigger: { trigger: header, start: "top 85%" },
                y: 30, opacity: 0, duration: 1.2, ease: "power3.out"
            });
        });
        
        gsap.utils.toArray('.gsap-fade-up').forEach(item => {
            gsap.from(item, {
                scrollTrigger: { trigger: item, start: "top 85%" },
                y: 50, opacity: 0, duration: 1.2, ease: "power3.out"
            });
        });
    }

    // 11. Shader Background Init
    initShaderBackground();
});

// --- SHADER (Oscilloscope Vibe) ---
function initShaderBackground() {
    const canvas = document.getElementById('shader-bg');
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() { gl_Position = aVertexPosition; }
    `;

    const fsSource = `
        precision highp float;
        uniform vec2 iResolution;
        uniform float iTime;

        void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            vec2 p = uv * 2.0 - 1.0; 
            
            float time = iTime * 0.5;
            vec3 color = vec3(0.0);
            
            for(float i = 0.0; i < 4.0; i++) {
                float freq = 2.0 + i * 1.5;
                float amp = 0.2 + sin(time + i) * 0.1;
                float j = p.x + sin(time * 2.0 + p.y * 5.0) * 0.1;
                float wave = sin(j * freq + time * (1.0 + i * 0.5)) * amp;
                float thickness = 0.01 / abs(p.y - wave);
                vec3 c = vec3(0.2, 0.1, 0.5) * (i + 1.0);
                if (i == 3.0) c = vec3(0.8, 0.8, 1.0);
                color += c * thickness;
            }
            
            vec3 bg = mix(vec3(0.02, 0.02, 0.03), vec3(0.05, 0.0, 0.1), length(p));
            gl_FragColor = vec4(bg + color * 0.5, 1.0);
        }
    `;

    function loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const resUnif = gl.getUniformLocation(shaderProgram, 'iResolution');
    const timeUnif = gl.getUniformLocation(shaderProgram, 'iTime');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let startTime = Date.now();
    function render() {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(shaderProgram);
        gl.uniform2f(resUnif, canvas.width, canvas.height);
        gl.uniform1f(timeUnif, (Date.now() - startTime) / 1000);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posAttr);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
    }
    render();
}
