const playBtn = document.getElementById('playBtn');
const playIcon = playBtn.querySelector('i');
const photoContainer = document.getElementById('photoContainer');
const progressBar = document.getElementById('progressBar');
const progressHandle = document.getElementById('progressHandle');
const progressBarArea = document.getElementById('progressBarArea');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

// Configuration
const photos = [
    'assets/photos/file_0000000011fc7207880c324c4e14b2ef.png',
    'assets/photos/file_0000000016a47207a2c4c5df06298df8.png',
    'assets/photos/file_000000001a947207afd0fa389c497a5b.png',
    'assets/photos/file_0000000044ac7207a633f1d37d8a8563.png',
    'assets/photos/file_0000000053c472079b8518945bfb6b9a.png',
    'assets/photos/file_00000000ed307207a9d44b3cc7444567.png',
    'assets/photos/file_00000000f1f47207a6aceb6f14a7f570.png'
];

// Audio Element
const audio = new Audio('assets/musics/Bruno Mars - Just The Way You Are (Official Music Video).mp3');
let isPlaying = false;
let duration = 0;
let playInterval;
let photoInterval;

// Initialize Photos
function initPhotos() {
    photos.forEach((src, index) => {
        const img = document.createElement('div');
        img.className = `photo-item ${index === 0 ? 'active' : ''}`;
        img.style.backgroundImage = `url('${src}')`;
        photoContainer.appendChild(img);
    });
}

// Audio Setup
audio.addEventListener('loadedmetadata', () => {
    duration = audio.duration;
    totalTimeEl.innerText = formatTime(duration);
});

audio.addEventListener('ended', () => {
    pause();
    audio.currentTime = 0;
    updateUI();
});

audio.addEventListener('timeupdate', () => {
    if (!progressBarArea.dataset.seeking) {
        updateUI();
    }
});

// Controls
playBtn.addEventListener('click', togglePlay);

function togglePlay() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function play() {
    isPlaying = true;
    playIcon.className = 'fas fa-pause';
    playBtn.classList.add('playing');

    audio.play();
    startPhotoCycle();
}

function pause() {
    isPlaying = false;
    playIcon.className = 'fas fa-play';
    playBtn.classList.remove('playing');

    audio.pause();
    clearInterval(photoInterval);
}

// Progress Bar Logic
function updateUI() {
    if (!duration) return;

    const currentProgress = audio.currentTime;
    const percentage = (currentProgress / duration) * 100;
    progressBar.style.width = `${percentage}%`;
    progressHandle.style.left = `${percentage}%`;

    // Time Text
    currentTimeEl.innerText = formatTime(currentProgress);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Scrubbing (Click on bar)
progressBarArea.addEventListener('click', (e) => {
    const rect = progressBarArea.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;

    audio.currentTime = percentage * duration;
    updateUI();
});

// Prevent UI jump during seeking
progressBarArea.addEventListener('mousedown', () => {
    progressBarArea.dataset.seeking = 'true';
});

progressBarArea.addEventListener('mouseup', () => {
    delete progressBarArea.dataset.seeking;
});

// Photo Cycling
let currentPhotoIndex = 0;
function startPhotoCycle() {
    // Change photo every 4 seconds
    clearInterval(photoInterval);
    photoInterval = setInterval(() => {
        nextPhoto();
    }, 4000);
}

function nextPhoto() {
    const items = document.querySelectorAll('.photo-item');
    items[currentPhotoIndex].classList.remove('active');
    currentPhotoIndex = (currentPhotoIndex + 1) % items.length;
    items[currentPhotoIndex].classList.add('active');
}

function prevPhoto() {
    const items = document.querySelectorAll('.photo-item');
    items[currentPhotoIndex].classList.remove('active');
    currentPhotoIndex = (currentPhotoIndex - 1 + items.length) % items.length;
    items[currentPhotoIndex].classList.add('active');
}

// Navigation buttons
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

prevBtn.addEventListener('click', () => {
    prevPhoto();
    // Skip backward 10 seconds in audio
    audio.currentTime = Math.max(0, audio.currentTime - 10);
});

nextBtn.addEventListener('click', () => {
    nextPhoto();
    // Skip forward 10 seconds in audio
    audio.currentTime = Math.min(duration, audio.currentTime + 10);
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowLeft':
            prevPhoto();
            audio.currentTime = Math.max(0, audio.currentTime - 10);
            break;
        case 'ArrowRight':
            nextPhoto();
            audio.currentTime = Math.min(duration, audio.currentTime + 10);
            break;
    }
});

// Init
initPhotos();
currentTimeEl.innerText = "0:00";
totalTimeEl.innerText = "0:00";

// Smooth Heart Rain Effect using Canvas
class HeartRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.lastTime = 0;
        this.heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '💘'];

        this.init();
    }

    init() {
        this.setCanvasSize();
        this.createParticles();
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.setCanvasSize();
            this.createParticles();
        });
    }

    setCanvasSize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
        this.canvas.width = Math.floor(w * dpr);
        this.canvas.height = Math.floor(h * dpr);

        this.ctx.scale(dpr, dpr);
        this.width = w;
        this.height = h;
    }

    createParticles() {
        const count = Math.min(25, Math.floor((this.width * this.height) / 30000));
        this.particles = [];

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height - this.height,
                size: 16 + Math.random() * 16,
                speed: 1 + Math.random() * 2,
                swaySpeed: 0.02 + Math.random() * 0.02,
                swayAmount: 20 + Math.random() * 40,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.03,
                opacity: 0.6 + Math.random() * 0.4,
                emoji: this.heartEmojis[Math.floor(Math.random() * this.heartEmojis.length)],
                phase: Math.random() * Math.PI * 2,
                wind: 0
            });
        }
    }

    animate(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Wind effect
        const windStrength = Math.sin(currentTime * 0.001) * 0.5;

        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Update physics
            particle.phase += particle.swaySpeed;
            particle.rotation += particle.rotationSpeed;

            // Sway motion
            const sway = Math.sin(particle.phase) * particle.swayAmount;
            particle.x += sway * 0.02;

            // Wind effect
            particle.x += windStrength;

            // Gravity
            particle.y += particle.speed;

            // Reset particle when off screen
            if (particle.y > this.height + 50) {
                particle.y = -50;
                particle.x = Math.random() * this.width;
            }

            // Wrap horizontal movement
            if (particle.x > this.width + 50) particle.x = -50;
            if (particle.x < -50) particle.x = this.width + 50;

            // Draw heart
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.font = `${particle.size}px serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);

            this.ctx.fillText(particle.emoji, 0, 0);
            this.ctx.restore();
        });

        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Start smooth heart rain
const heartRain = new HeartRain('heartCanvas');
