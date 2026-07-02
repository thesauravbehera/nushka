// ==========================================
// 1. Canvas Sparkles & Hearts Background
// ==========================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let particleMode = 'normal'; // 'normal' or 'petals'

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.size = Math.random() * 15 + 5;
    this.opacity = Math.random() * 0.5 + 0.3;
    
    if (particleMode === 'petals') {
      // Start petals from top of screen
      this.y = -(Math.random() * 100);
      this.speedY = Math.random() * 1.5 + 0.8; // fall speed
      this.speedX = Math.random() * 0.8 - 0.4;
    } else {
      // Start normal particles from bottom
      this.y = canvas.height + Math.random() * 100;
      this.speedY = -(Math.random() * 1.5 + 0.5); // float up speed
      this.speedX = Math.random() * 1 - 0.5;
    }
    
    this.type = Math.random() > 0.45 ? 'sparkle' : 'heart';
    
    // Normal color
    this.color = this.type === 'heart' 
      ? `rgba(255, ${Math.floor(Math.random()*80 + 50)}, ${Math.floor(Math.random()*120 + 100)}, ${this.opacity})`
      : `rgba(255, 255, 255, ${this.opacity})`;
      
    // Rose petal colors: magenta, pink, cream jasmine
    const petalColors = [
      `rgba(233, 30, 99, ${this.opacity})`,   // Rose Pink
      `rgba(244, 67, 54, ${this.opacity})`,   // Bright Pink
      `rgba(255, 128, 171, ${this.opacity})`,  // Soft Pink
      `rgba(255, 253, 231, ${this.opacity * 0.85})` // Jasmine Cream
    ];
    this.petalColor = petalColors[Math.floor(Math.random() * petalColors.length)];
    
    this.angle = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.02 - 0.01;
  }

  update() {
    if (particleMode === 'petals') {
      this.y += this.speedY;
      this.x += Math.sin(this.angle) * 0.5 + this.speedX;
      this.angle += this.rotationSpeed;
      if (this.y > canvas.height + 20) {
        this.y = -20;
        this.x = Math.random() * canvas.width;
        this.opacity = Math.random() * 0.5 + 0.3;
      }
    } else {
      this.y += this.speedY;
      this.x += this.speedX;
      this.angle += this.rotationSpeed;
      if (this.y < -20) {
        this.y = canvas.height + 20;
        this.x = Math.random() * canvas.width;
        this.opacity = Math.random() * 0.5 + 0.3;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (particleMode === 'petals') {
      ctx.fillStyle = this.petalColor;
      ctx.beginPath();
      const d = this.size;
      // Draw organic petal leaf shape
      ctx.moveTo(0, -d/2);
      ctx.quadraticCurveTo(-d/2, -d/4, -d/3, d/2);
      ctx.quadraticCurveTo(0, d/3, d/3, d/2);
      ctx.quadraticCurveTo(d/2, -d/4, 0, -d/2);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      if (this.type === 'heart') {
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, d / 4);
        ctx.quadraticCurveTo(-d / 2, -d / 2, -d, d / 4);
        ctx.quadraticCurveTo(-d, d, 0, d * 1.3);
        ctx.quadraticCurveTo(d, d, d, d / 4);
        ctx.quadraticCurveTo(d / 2, -d / 2, 0, d / 4);
        ctx.fill();
      } else {
        ctx.beginPath();
        const s = this.size / 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'white';
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

function initBackground() {
  for (let i = 0; i < 45; i++) {
    particles.push(new Particle());
  }
}

function animateBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateBackground);
}

initBackground();
animateBackground();


// ==========================================
// 2. Romantic Audio Player (audio.mp3)
// ==========================================
const bgAudio = new Audio('audio.mp3');
bgAudio.loop = true;
bgAudio.volume = 0.65; // Soft background volume

const musicWidget = document.getElementById('music-widget');
const musicToggle = document.getElementById('music-toggle');

function toggleMusic() {
  if (bgAudio.paused) {
    bgAudio.play().then(() => {
      musicWidget.classList.add('playing');
      musicToggle.textContent = '🔇 Mute Music';
    }).catch(err => {
      console.warn("Autoplay block: Interaction required.", err);
    });
    return true;
  } else {
    bgAudio.pause();
    musicWidget.classList.remove('playing');
    musicToggle.textContent = '🎵 Play Music';
    return false;
  }
}

musicToggle.addEventListener('click', () => {
  toggleMusic();
});


// ==========================================
// 3. Step Navigation & Flow Control
// ==========================================
let currentStep = 0;
const steps = document.querySelectorAll('.step');
const startSurpriseBtn = document.getElementById('btn-start-surprise');
const cardBody = document.getElementById('card-body');
const scrapbookDesk = document.getElementById('scrapbook-desk');

// Interactive Accept Gift Meme Mechanics
const noBtn = document.getElementById('btn-accept-no');
const feedbackPopup = document.getElementById('meme-feedback-popup');
const feedbackImg = document.getElementById('feedback-meme-img');
const feedbackText = document.getElementById('feedback-meme-text');
let noAttempts = 0;

noBtn.addEventListener('mouseenter', fleeNoButton);
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  fleeNoButton();
});
noBtn.addEventListener('click', () => {
  document.getElementById('gun-modal').style.display = 'flex';
});

function fleeNoButton() {
  noAttempts++;
  
  const cardWidth = cardBody.clientWidth;
  const cardHeight = cardBody.clientHeight;
  const btnWidth = noBtn.clientWidth;
  const btnHeight = noBtn.clientHeight;
  
  // Flee randomly inside card body with safety padding
  const padding = 25;
  const minX = padding;
  const maxX = cardWidth - btnWidth - padding;
  const minY = padding;
  const maxY = cardHeight - btnHeight - padding;
  
  const x = Math.floor(Math.random() * (maxX - minX) + minX);
  const y = Math.floor(Math.random() * (maxY - minY) + minY);
  
  noBtn.style.position = 'absolute';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.margin = '0';
  noBtn.style.zIndex = '50';

  // Display floating reaction memes
  showMemeFeedback(x, y);
}

function showMemeFeedback(btnX, btnY) {
  let imgPath = '';
  let msg = '';
  
  const stepVal = (noAttempts - 1) % 3;
  if (stepVal === 0) {
    imgPath = 'images/meme_loading.webp';
    msg = "Brain loading... why would you click NO? 🧠";
  } else if (stepVal === 1) {
    imgPath = 'images/meme_stop.webp';
    msg = "Hey, stop that right now! 🛑";
  } else {
    imgPath = 'images/meme_yell.webp';
    msg = "JUST CLICK YES ALREADY! 😠";
  }
  
  feedbackImg.src = imgPath;
  feedbackText.textContent = msg;
  
  // Offset positioning
  let popupX = btnX + 70;
  let popupY = btnY - 110;
  
  if (popupX > cardBody.clientWidth - 190) popupX = btnX - 190;
  if (popupY < 10) popupY = btnY + 50;
  
  feedbackPopup.style.left = `${popupX}px`;
  feedbackPopup.style.top = `${popupY}px`;
  feedbackPopup.style.display = 'flex';
  
  if (feedbackPopup.timeoutId) clearTimeout(feedbackPopup.timeoutId);
  feedbackPopup.timeoutId = setTimeout(() => {
    feedbackPopup.style.display = 'none';
  }, 1600);
}

function closeGunModal() {
  document.getElementById('gun-modal').style.display = 'none';
  noAttempts = 0;
  // Reset NO button style
  noBtn.style.position = 'absolute';
  noBtn.style.left = '55%';
  noBtn.style.top = 'auto';
}

function acceptGiftFirst() {
  nextStep();
}

// Mughal Palace Activation Flow
let activationStep = 0;
const palaceActionBtn = document.getElementById('palace-action-btn');
const palaceStatusText = document.getElementById('palace-status-text');

function runActivationStep() {
  palaceActionBtn.style.opacity = '0';
  palaceActionBtn.style.pointerEvents = 'none';

  setTimeout(() => {
    if (activationStep === 0) {
      // 1. Light Palace Lamps
      document.getElementById('palace-bg').style.opacity = '0.65';
      const lamps = document.querySelectorAll('.hanging-lamp');
      lamps.forEach((lamp, idx) => {
        setTimeout(() => {
          lamp.classList.add('down');
          setTimeout(() => {
            lamp.classList.add('glow');
          }, 800);
        }, idx * 220);
      });
      
      palaceStatusText.textContent = "Lanterns lit warmly. The palace is glowing! ✨";
      palaceActionBtn.textContent = "Play JAWNY's Honeypie 🎵";
      activationStep = 1;
      
    } else if (activationStep === 1) {
      // 2. Play JAWNY's Honeypie
      if (bgAudio.paused) {
        toggleMusic();
      }
      
      const lamps = document.querySelectorAll('.hanging-lamp');
      lamps.forEach(lamp => {
        lamp.classList.add('pulse');
      });
      
      palaceStatusText.textContent = "Honeypie is playing! Let the happy vibes roll... 🎵";
      palaceActionBtn.textContent = "Drape the Garlands 🌸";
      activationStep = 2;
      
    } else if (activationStep === 2) {
      // 3. Drape the Garlands
      document.getElementById('palace-garland').classList.add('active');
      palaceStatusText.textContent = "Flower garlands are beautifully draped! 🌸";
      palaceActionBtn.textContent = "Release Rose Petals 🌹";
      activationStep = 3;
      
    } else if (activationStep === 3) {
      // 4. Release Rose Petals
      particleMode = 'petals';
      // Reset particles to petals falling down
      particles = [];
      for (let i = 0; i < 45; i++) {
        particles.push(new Particle());
      }
      
      palaceStatusText.textContent = "Soft rose petals fill the air... 🌹";
      palaceActionBtn.textContent = "Start the Journey ✉️";
      activationStep = 4;
      
    } else if (activationStep === 4) {
      // 5. Open Secret Wishes -> First Moment
      nextStep();
      return;
    }
    
    // Fade in action button
    setTimeout(() => {
      palaceActionBtn.style.opacity = '1';
      palaceActionBtn.style.pointerEvents = 'auto';
    }, 500);
    
  }, 400);
}

function showStep(index) {
  steps.forEach(step => step.classList.remove('active'));
  
  // Custom step configurations
  const stepElement = steps[index];
  const stepId = stepElement ? stepElement.getAttribute('data-step') : null;
  if (stepId === '7') {
    // Scrapbook Desk reveal!
    cardBody.style.pointerEvents = 'none';
    cardBody.style.background = 'rgba(255, 255, 255, 0.02)';
    cardBody.style.border = '1px solid rgba(255, 255, 255, 0.05)';
    cardBody.style.transform = 'translateY(150px) scale(0.85)';
    cardBody.style.boxShadow = 'none';
    
    // Hide standard backgrounds, show scrapbook table
    scrapbookDesk.style.display = 'block';

    // Inject the meow overlay if not already injected
    if (!document.querySelector('.meow-bg-overlay')) {
      const meowOverlay = document.createElement('div');
      meowOverlay.className = 'meow-bg-overlay';
      let meows = '';
      for (let i = 0; i < 600; i++) {
        meows += 'MEOW ';
      }
      meowOverlay.textContent = meows;
      scrapbookDesk.appendChild(meowOverlay);
    }

    setTimeout(() => {
      scrapbookDesk.style.opacity = '1';
      distributePapers();
    }, 50);

    // Launch beautiful confetti celebration
    launchConfetti(120);
  } else {
    // Restore layout
    cardBody.style.pointerEvents = 'auto';
    cardBody.style.background = 'var(--glass-bg)';
    cardBody.style.border = '1px solid var(--glass-border)';
    cardBody.style.transform = 'translateY(0) scale(1)';
    cardBody.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4)';
    scrapbookDesk.style.opacity = '0';
    setTimeout(() => { scrapbookDesk.style.display = 'none'; }, 800);
  }

  // Activate next step card
  steps[index].classList.add('active');
  currentStep = index;
}

function nextStep() {
  // Autoplay music upon interaction if not already playing
  if (bgAudio.paused) {
    toggleMusic();
  }
  showStep(currentStep + 1);
}


// Section removed since the invitation envelope mechanism was replaced by the slide journey flow.


// Section removed since the invitation game mechanisms were replaced by the slide journey flow.


// ==========================================
// 7. Step 3: Blow out the Candle (Mic + Tap)
// ==========================================
const candleFlame = document.getElementById('candle-flame');
const candleSmoke = document.getElementById('candle-smoke');
const micToggleBtn = document.getElementById('mic-toggle-btn');
const micBar = document.getElementById('mic-bar');
const micFill = document.getElementById('mic-fill');

let micStream = null;
let audioAnalyzer = null;
let micActive = false;
let candleBlown = false;

// Audio context microphone analysis
async function initMicrophone() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    micStream = stream;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    audioAnalyzer = audioContext.createAnalyser();
    audioAnalyzer.fftSize = 512;
    source.connect(audioAnalyzer);
    
    micActive = true;
    micToggleBtn.textContent = '🎙️ Mic Active (Blow Now!)';
    micToggleBtn.classList.add('active');
    micBar.style.display = 'block';
    
    monitorBlow();
  } catch (err) {
    console.warn("Microphone access denied or unsupported context.", err);
    micToggleBtn.textContent = '🎙️ Mic Denied (Tap Flame Instead)';
    micToggleBtn.style.color = '#ff8a80';
    micBar.style.display = 'none';
  }
}

function monitorBlow() {
  if (!micActive || candleBlown) return;
  
  const bufferLength = audioAnalyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  audioAnalyzer.getByteFrequencyData(dataArray);
  
  // Calculate average volume in high frequencies (characteristic of wind blowing/hissing)
  let sum = 0;
  const startBin = Math.floor(bufferLength * 0.3); // Focus on mid-to-high pitch ranges
  for (let i = startBin; i < bufferLength; i++) {
    sum += dataArray[i];
  }
  const avgHighFreqVolume = sum / (bufferLength - startBin);
  
  // Update indicator bar UI
  const fillWidth = Math.min(100, (avgHighFreqVolume / 180) * 100);
  micFill.style.width = `${fillWidth}%`;

  // Blow threshold
  if (avgHighFreqVolume > 85) {
    blowCandle();
  } else {
    requestAnimationFrame(monitorBlow);
  }
}

// Stop mic access to release resources
function stopMicrophone() {
  micActive = false;
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
  }
  micBar.style.display = 'none';
}

micToggleBtn.addEventListener('click', () => {
  if (!micActive) {
    initMicrophone();
  } else {
    stopMicrophone();
    micToggleBtn.textContent = '🎙️ Enable Microphone Blow';
    micToggleBtn.classList.remove('active');
  }
});

candleFlame.addEventListener('click', () => {
  blowCandle();
});

function blowCandle() {
  if (candleBlown) return;
  candleBlown = true;
  
  stopMicrophone();
  
  // Extinguish flame and release smoke
  candleFlame.style.display = 'none';
  candleSmoke.style.display = 'block';
  
  launchConfetti(150);

  // Automate transition to scrapbook
  setTimeout(() => {
    nextStep();
  }, 1500);
}


// ==========================================
// 8. Step 4: Draggable Scrapbook Mechanism
// ==========================================
let highestZ = 10;

class DraggablePaper {
  constructor(paperEl) {
    this.paper = paperEl;
    this.holdingPaper = false;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotation = Math.random() * 20 - 10;
  }

  init() {
    // Desktop Handlers
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.paper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mouseup', () => this.handleMouseUp());

    // Mobile Handlers
    this.paper.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.paper.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.paper.addEventListener('touchend', () => this.handleTouchEnd());
  }

  updatePosition() {
    this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotate(${this.rotation}deg)`;
  }

  liftPaper() {
    highestZ++;
    this.paper.style.zIndex = highestZ;
  }

  // --- MOUSE HANDLERS ---
  handleMouseDown(e) {
    if (this.holdingPaper || e.button !== 0) return;
    this.holdingPaper = true;
    this.liftPaper();
    
    this.prevMouseX = e.clientX;
    this.prevMouseY = e.clientY;
  }

  handleMouseMove(e) {
    if (!this.holdingPaper) return;
    
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    
    this.velX = this.mouseX - this.prevMouseX;
    this.velY = this.mouseY - this.prevMouseY;
    
    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;
    
    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;
    
    this.updatePosition();
  }

  handleMouseUp() {
    this.holdingPaper = false;
  }

  // --- TOUCH HANDLERS ---
  handleTouchStart(e) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    this.liftPaper();
    
    const touch = e.touches[0];
    this.prevMouseX = touch.clientX;
    this.prevMouseY = touch.clientY;
  }

  handleTouchMove(e) {
    if (!this.holdingPaper) return;
    e.preventDefault(); // Prevent scrolling on mobile while dragging
    
    const touch = e.touches[0];
    this.mouseX = touch.clientX;
    this.mouseY = touch.clientY;
    
    this.velX = this.mouseX - this.prevMouseX;
    this.velY = this.mouseY - this.prevMouseY;
    
    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;
    
    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;
    
    this.updatePosition();
  }

  handleTouchEnd() {
    this.holdingPaper = false;
  }
}

// Initial positioning of papers to layout nicely across desktop and mobile desks
const paperElements = Array.from(document.querySelectorAll('.paper'));
const draggablePapers = paperElements.map(el => new DraggablePaper(el));

draggablePapers.forEach(dp => dp.init());

function distributePapers() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width < 600;

  paperElements.forEach((paper, index) => {
    const dp = draggablePapers[index];
    
    // Distribute them in random, scattered layouts
    let targetX = 0;
    let targetY = 0;
    
    if (isMobile) {
      // Stack them primarily in the lower screen space
      targetX = (Math.random() * (width - 160)) - (width / 2) + 80;
      targetY = (Math.random() * (height - 320)) - (height / 2) + 180;
    } else {
      // Scatter nicely across wide viewports
      targetX = (Math.random() * (width - 320)) - (width / 2) + 160;
      targetY = (Math.random() * (height - 350)) - (height / 2) + 160;
    }
    
    // Set variables
    dp.currentPaperX = targetX;
    dp.currentPaperY = targetY;
    dp.rotation = Math.random() * 30 - 15;
    dp.liftPaper();
    dp.updatePosition();
  });
}


// ==========================================
// 9. Confetti Particle System
// ==========================================
function launchConfetti(amount = 100) {
  const colors = ['#ff4081', '#ff80ab', '#ffd54f', '#b388ff', '#82b1ff', '#ffffff'];
  
  for (let i = 0; i < amount; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Direct falling animation settings
    c.style.top = '-20px';
    const dur = 2 + Math.random() * 2.5;
    c.style.animation = `confettiFall ${dur}s linear forwards`;
    
    // Dynamic shapes
    const size = Math.random() * 10 + 6;
    c.style.width = `${size}px`;
    c.style.height = `${size}px`;
    if (Math.random() > 0.5) c.style.borderRadius = '50%';
    
    document.body.appendChild(c);
    
    // Remove from DOM when completed
    setTimeout(() => c.remove(), dur * 1000);
  }
}

// Inline CSS for confetti animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes confettiFall {
  0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
  50% { transform: translateY(50vh) rotate(360deg) translateX(25px); opacity: 0.8; }
  100% { transform: translateY(105vh) rotate(720deg) translateX(-25px); opacity: 0; }
}
`;
document.head.appendChild(styleSheet);


// ==========================================
// 10. Restart / Loop Flow
// ==========================================
function restartWish() {
  // Reset Candle
  candleBlown = false;
  candleFlame.style.display = 'block';
  candleSmoke.style.display = 'none';
  micActive = false;
  micToggleBtn.textContent = '🎙️ Enable Microphone Blow';
  micToggleBtn.classList.remove('active');

  // Reset Accept Gift Flow
  noAttempts = 0;
  noBtn.style.position = 'absolute';
  noBtn.style.left = '55%';
  noBtn.style.top = 'auto';
  noBtn.style.margin = '';

  // Reset Palace Flow
  activationStep = 0;
  particleMode = 'normal';
  document.getElementById('palace-bg').style.opacity = '0';
  document.getElementById('palace-garland').classList.remove('active');
  
  const lamps = document.querySelectorAll('.hanging-lamp');
  lamps.forEach(lamp => {
    lamp.className = 'hanging-lamp'; // resets glow, pulse, down classes
  });
  
  palaceActionBtn.textContent = "Light the Palace Lamps 🏮";
  palaceStatusText.textContent = "Welcome to your virtual birthday palace, Sandali. It looks a bit dark and quiet... Let's activate the magic one by one!";
  
  // Reinitialize normal floating particles
  particles = [];
  for (let i = 0; i < 45; i++) {
    particles.push(new Particle());
  }

  // Go to step 0
  showStep(0);
}

// ==========================================
// 11. 3D Tilt Card Motion (Desktop & Mobile)
// ==========================================
function init3DTilt() {
  const cards = document.querySelectorAll('.glass-card, .paper.image, .final-card-container');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (max 12 degrees)
      const rotateX = ((centerY - y) / centerY) * 12;
      const rotateY = ((x - centerX) / centerX) * 12;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
    
    // Mobile Touch interaction
    card.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const rect = card.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((centerY - y) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      }
    }, { passive: true });
    
    card.addEventListener('touchend', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
}

// ==========================================
// 12. Forehead Girl Interactive Mechanics
// ==========================================
function initForeheadGirl() {
  const wrappers = document.querySelectorAll('.forehead-girl-wrapper');
  
  wrappers.forEach(wrapper => {
    const head = wrapper.querySelector('.forehead-girl');
    
    // Head follows mouse slightly
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((centerY - y) / centerY) * 15;
      const rotateY = ((x - centerX) / centerX) * 15;
      
      head.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    wrapper.addEventListener('mouseleave', () => {
      head.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
    
    // Spawn sparkles on click
    wrapper.addEventListener('click', (e) => {
      const emojis = ['✨', '⭐', '💖', '💡', '🌟', '💥'];
      
      // Spawn 8 sparkles around the click point
      for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'fg-sparkle';
        sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Random horizontal travel offset
        const tx = Math.floor(Math.random() * 80 - 40);
        sparkle.style.setProperty('--tx', `${tx}px`);
        
        // Position sparkle at click position
        sparkle.style.left = `${e.clientX}px`;
        sparkle.style.top = `${e.clientY}px`;
        
        document.body.appendChild(sparkle);
        
        // Remove after animation completes
        setTimeout(() => {
          sparkle.remove();
        }, 1100);
      }
    });
  });
}

// Initialize Interactive Mechanics
init3DTilt();
initForeheadGirl();

