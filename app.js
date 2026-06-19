document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initThemeToggle();
  initParticleBackground();
  initTypingAnimation();
  initPhoneSimulator();
  initSkillObserver();
  initTiltEffect();
  initContactForm();
  initCustomCursor();
  initMouseGlow();
  initScrollReveal();
  initCardSpotlight();
  initCardTilt();
});

// Shared mouse coordinate object for particle interactions
const globalMouse = { x: -1000, y: -1000 };

/* 1. Particle Canvas Background */
function initParticleBackground() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  
  window.addEventListener('resize', () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
  });
  
  const particles = [];
  const maxParticles = 65; // increased density for winding flow
  
  // Premium organic colors: magentas, purples, cyans, teals
  const palette = [
    'rgba(236, 72, 153, 0.5)',  // pink/magenta (petals)
    'rgba(168, 85, 247, 0.5)',  // purple
    'rgba(6, 182, 212, 0.5)',   // cyan (sea waves)
    'rgba(20, 184, 166, 0.5)'    // teal
  ];
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 2.5 + 1.5;
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.angle = Math.random() * Math.PI * 2;
      this.spinSpeed = (Math.random() - 0.5) * 0.03;
      this.trail = [];
    }
    
    update(time) {
      // 1. Organic wave wind current drift (sea winding / flowers blowing)
      // Generates continuous flow field waves based on sine waves
      const windX = Math.sin(time * 0.002 + this.y * 0.004) * 0.4;
      const windY = Math.cos(time * 0.002 + this.x * 0.004) * 0.3;
      
      this.vx += windX;
      this.vy += windY;
      
      // 2. Swirling vortex force towards mouse when cursor is active
      const dx = this.x - globalMouse.x;
      const dy = this.y - globalMouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 260) {
        const force = (260 - dist) / 260;
        const angle = Math.atan2(dy, dx);
        
        // Circular swirl direction (perpendicular to angle) + drag pull inward
        const swirlAngle = angle + Math.PI / 2 + 0.15;
        this.vx += Math.cos(swirlAngle) * force * 0.8;
        this.vy += Math.sin(swirlAngle) * force * 0.8;
      }
      
      // 3. Friction & speed damping
      this.vx *= 0.95;
      this.vy *= 0.95;
      
      // Apply movement
      this.x += this.vx;
      this.y += this.vy;
      
      // Angle spin
      this.angle += this.spinSpeed;
      
      // Boundaries wrapping
      if (this.x < -30) this.x = width + 30;
      if (this.x > width + 30) this.x = -30;
      if (this.y < -30) this.y = height + 30;
      if (this.y > height + 30) this.y = -30;
      
      // Trail updates
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 10) {
        this.trail.shift();
      }
    }
    
    draw() {
      // Draw smooth winding light trail
      if (this.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = this.color.replace('0.5', '0.12'); // faint neon tail
        ctx.lineWidth = this.radius * 0.7;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
      
      // Draw organic petal/leaf shape
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      // almond shape
      ctx.moveTo(0, -this.radius * 1.6);
      ctx.quadraticCurveTo(this.radius * 1.3, -this.radius * 0.5, 0, this.radius * 1.6);
      ctx.quadraticCurveTo(-this.radius * 1.3, -this.radius * 0.5, 0, -this.radius * 1.6);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 4;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }
  
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
  
  let lastTime = 0;
  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach((p) => {
      p.update(timestamp);
      p.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(animate);
}

/* 2. Text Typing Effect */
function initTypingAnimation() {
  const words = ["App Developer", "Android Native Dev", "Flutter Specialist", "Full-Stack Creator"];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const target = document.querySelector('.typing-text');
  
  if (!target) return;
  
  function type() {
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }
    
    let speed = isDeleting ? 40 : 100;
    
    if (!isDeleting && charIdx === currentWord.length) {
      speed = 1800; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 400; // pause before typing next
    }
    
    setTimeout(type, speed);
  }
  
  setTimeout(type, 1000);
}

/* 3. Smartphone Simulator App Switching & Functionality */
function initPhoneSimulator() {
  const launcher = document.getElementById('screen-launcher');
  const appPay = document.getElementById('screen-pay');
  const appChat = document.getElementById('screen-chat');
  const appCloud = document.getElementById('screen-cloud');
  const appFit = document.getElementById('screen-fit');
  const appSteel = document.getElementById('screen-steel');
  const appDairy = document.getElementById('screen-dairy');
  const appPets = document.getElementById('screen-pets');
  const appTrack = document.getElementById('screen-track');
  const appCaller = document.getElementById('screen-caller');
  const appFish = document.getElementById('screen-fish');
  
  const backBtn = document.querySelectorAll('.back-arrow');
  
  // Back button functionality
  backBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.screen-content').forEach(s => s.classList.remove('active'));
      launcher.classList.add('active');
      resetAppStates();
    });
  });
  
  // App click events
  document.getElementById('app-pay-btn').addEventListener('click', () => {
    launcher.classList.remove('active');
    appPay.classList.add('active');
  });
  
  document.getElementById('app-chat-btn').addEventListener('click', () => {
    launcher.classList.remove('active');
    appChat.classList.add('active');
    runChatSimulation();
  });
  
  document.getElementById('app-cloud-btn').addEventListener('click', () => {
    launcher.classList.remove('active');
    appCloud.classList.add('active');
    runCloudConsoleSimulation();
  });
  
  document.getElementById('app-fit-btn').addEventListener('click', () => {
    launcher.classList.remove('active');
    appFit.classList.add('active');
    runFitSimulation();
  });

  document.getElementById('app-steel-btn').addEventListener('click', () => {
    launcher.classList.remove('active');
    appSteel.classList.add('active');
  });

  document.getElementById('app-dairy-btn').addEventListener('click', () => {
    launcher.classList.remove('active');
    appDairy.classList.add('active');
  });

  document.getElementById('app-pets-btn').addEventListener('click', () => {
    launcher.classList.remove('active');
    appPets.classList.add('active');
  });

  document.getElementById('app-track-btn').addEventListener('click', () => {
    launcher.classList.remove('active');
    appTrack.classList.add('active');
    if (window.routeTrackInterval) clearInterval(window.routeTrackInterval);
    let lat = 13.0827;
    let lng = 80.2707;
    const latlngText = document.getElementById('track-latlng');
    window.routeTrackInterval = setInterval(() => {
      lat += (Math.random() - 0.5) * 0.0003;
      lng += (Math.random() - 0.5) * 0.0003;
      if (latlngText) latlngText.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }, 1000);
  });

  document.getElementById('app-caller-btn').addEventListener('click', () => {
    launcher.classList.remove('active');
    appCaller.classList.add('active');
  });

  document.getElementById('app-fish-btn').addEventListener('click', () => {
    launcher.classList.remove('active');
    appFish.classList.add('active');
  });
  
  // Razorpay Pay Simulation
  const rpTrigger = document.getElementById('rp-trigger');
  const rpOverlay = document.getElementById('rp-overlay');
  const rpText = document.getElementById('rp-status-text');
  const rpIcon = document.getElementById('rp-status-icon');
  
  if (rpTrigger) {
    rpTrigger.addEventListener('click', () => {
      rpOverlay.style.display = 'flex';
      rpText.textContent = 'Contacting Payment Gateway...';
      rpIcon.className = 'fas fa-spinner fa-spin';
      rpIcon.style.color = '#0284c7';
      
      setTimeout(() => {
        rpText.textContent = 'Processing Payment of ₹100...';
        rpIcon.className = 'fas fa-circle-notch fa-spin';
      }, 1500);
      
      setTimeout(() => {
        rpText.textContent = 'Payment Completed Successfully!';
        rpIcon.className = 'fas fa-check-circle rp-success-icon';
        rpIcon.style.color = '#10b981';
      }, 3500);
      
      setTimeout(() => {
        rpOverlay.style.display = 'none';
      }, 5500);
    });
  }

  // 1. SteelForce Simulation
  const steelForm = document.getElementById('steel-order-form');
  const steelSuccess = document.getElementById('steel-success');
  if (steelForm) {
    steelForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('steel-order-btn');
      btn.disabled = true;
      btn.textContent = 'Submitting...';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Submit Sales Order';
        if (steelSuccess) steelSuccess.style.display = 'block';
        steelForm.reset();
      }, 1200);
    });
  }

  // 2. DairyFresh Simulation
  const dairyBtn = document.getElementById('dairy-dispatch-btn');
  const dairySuccess = document.getElementById('dairy-success');
  if (dairyBtn) {
    dairyBtn.addEventListener('click', () => {
      dairyBtn.disabled = true;
      dairyBtn.textContent = 'Dispatching Cans...';
      setTimeout(() => {
        dairyBtn.disabled = false;
        dairyBtn.textContent = 'Dispatch Milk Cans';
        if (dairySuccess) dairySuccess.style.display = 'block';
      }, 1500);
    });
  }

  // 3. PawsFeed Store Simulation
  let dogQty = 0;
  let catQty = 0;
  const dogPrice = 1850;
  const catPrice = 950;
  const dogVal = document.getElementById('dog-qty-val');
  const catVal = document.getElementById('cat-qty-val');
  const totalBillText = document.getElementById('pet-total-bill');

  function updatePawsBill() {
    const total = (dogQty * dogPrice) + (catQty * catPrice);
    if (totalBillText) totalBillText.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  const dogPlus = document.getElementById('dog-qty-plus');
  const dogMinus = document.getElementById('dog-qty-minus');
  if (dogPlus && dogMinus) {
    dogPlus.addEventListener('click', () => { dogQty++; if (dogVal) dogVal.textContent = dogQty; updatePawsBill(); });
    dogMinus.addEventListener('click', () => { if (dogQty > 0) dogQty--; if (dogVal) dogVal.textContent = dogQty; updatePawsBill(); });
  }

  const catPlus = document.getElementById('cat-qty-plus');
  const catMinus = document.getElementById('cat-qty-minus');
  if (catPlus && catMinus) {
    catPlus.addEventListener('click', () => { catQty++; if (catVal) catVal.textContent = catQty; updatePawsBill(); });
    catMinus.addEventListener('click', () => { if (catQty > 0) catQty--; if (catVal) catVal.textContent = catQty; updatePawsBill(); });
  }

  const petOrderBtn = document.getElementById('pet-order-btn');
  if (petOrderBtn) {
    petOrderBtn.addEventListener('click', () => {
      if (dogQty === 0 && catQty === 0) {
        alert('Please add at least 1 item to checkout!');
        return;
      }
      petOrderBtn.disabled = true;
      petOrderBtn.textContent = 'Placing Order...';
      setTimeout(() => {
        petOrderBtn.disabled = false;
        petOrderBtn.textContent = 'Checkout Order';
        alert('Pet Feed order placed successfully!');
        dogQty = 0;
        catQty = 0;
        if (dogVal) dogVal.textContent = '0';
        if (catVal) catVal.textContent = '0';
        updatePawsBill();
      }, 1500);
    });
  }

  // 4. Telecaller Simulation
  const callBtn = document.getElementById('caller-call-btn');
  const hangupBtn = document.getElementById('caller-hangup-btn');
  const callerStatus = document.getElementById('caller-status-area');
  const callDurText = document.getElementById('call-duration');
  let callSeconds = 0;

  function formatTime(s) {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  if (callBtn) {
    callBtn.addEventListener('click', () => {
      callBtn.style.display = 'none';
      if (callerStatus) callerStatus.style.display = 'flex';
      if (callDurText) callDurText.textContent = 'Connecting...';
      
      callSeconds = 0;
      setTimeout(() => {
        if (window.callerCallInterval) clearInterval(window.callerCallInterval);
        window.callerCallInterval = setInterval(() => {
          callSeconds++;
          if (callDurText) callDurText.textContent = `On Call... ${formatTime(callSeconds)}`;
        }, 1000);
      }, 1000);
    });
  }

  if (hangupBtn) {
    hangupBtn.addEventListener('click', () => {
      if (window.callerCallInterval) clearInterval(window.callerCallInterval);
      if (callerStatus) callerStatus.style.display = 'none';
      if (callBtn) callBtn.style.display = 'block';
    });
  }

  // 5. ChennaiFish Simulation
  let fishCart = { name: '', price: 0, qty: 0 };
  const addFishBtns = document.querySelectorAll('.add-fish-btn');
  const fishBar = document.getElementById('fish-checkout-bar');
  const fishSummary = document.getElementById('fish-cart-summary');
  const fishPay = document.getElementById('fish-pay-btn');

  addFishBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'));
      
      fishCart.name = name;
      fishCart.price = price;
      fishCart.qty = 1;
      
      if (fishSummary) fishSummary.textContent = `1 Item | ₹${price}`;
      if (fishBar) fishBar.style.display = 'flex';
    });
  });

  if (fishPay) {
    fishPay.addEventListener('click', () => {
      fishPay.disabled = true;
      fishPay.textContent = 'Ordering...';
      setTimeout(() => {
        fishPay.disabled = false;
        fishPay.textContent = 'Order Now';
        alert(`ChennaiFish order of ${fishCart.name} placed successfully! Delivering in 10 mins.`);
        if (fishBar) fishBar.style.display = 'none';
        fishCart = { name: '', price: 0, qty: 0 };
      }, 1500);
    });
  }
}

// Chat simulation timers
let chatTimers = [];
function runChatSimulation() {
  const chatArea = document.getElementById('chat-msg-area');
  chatArea.innerHTML = ''; // reset
  
  const messages = [
    { type: 'in', text: 'Hi Sivaprakash! Can you help integrate Razorpay in our app?' },
    { type: 'out', text: 'Hey there! Yes, absolutely. I have working experience in online payments.' },
    { type: 'in', text: 'Awesome! We are using Flutter for hybrid. Is that fine?' },
    { type: 'out', text: 'Perfect! I write native Java and Flutter apps. We can build it in no time!' },
    { type: 'in', text: 'Cool, let\'s start tomorrow!' }
  ];
  
  let delay = 600;
  messages.forEach((msg, idx) => {
    const t = setTimeout(() => {
      const el = document.createElement('div');
      el.className = `message msg-${msg.type}`;
      el.textContent = msg.text;
      chatArea.appendChild(el);
      chatArea.scrollTop = chatArea.scrollHeight;
    }, delay);
    chatTimers.push(t);
    delay += msg.text.length * 40 + 1000;
  });
}

// Cloud simulator logs
let cloudTimer = null;
function runCloudConsoleSimulation() {
  const consoleArea = document.getElementById('cloud-console-log');
  consoleArea.innerHTML = '';
  
  const logs = [
    '<span class="cyan">system@siva-cloud:~$</span> gcloud projects list',
    'PROJECT_ID         NAME             PROJECT_NUMBER',
    'siva-native-app-1  Android Native   493820938472',
    'siva-flutter-pay   Razorpay Flutter 928471947291',
    '<span class="cyan">system@siva-cloud:~$</span> curl https://api.siva.dev/v1/apps',
    '<span class="purple">HTTP/1.1 200 OK</span>',
    'Content-Type: application/json',
    '{ "apps_delivered": 15, "status": "active" }',
    '<span class="cyan">system@siva-cloud:~$</span> firebase deploy --only functions',
    '=== Deploying to siva-native-app-1...',
    '✔  functions: Finished compiling sources',
    '✔  functions: Functions successfully deployed!'
  ];
  
  let i = 0;
  function printLogLine() {
    if (i < logs.length) {
      const line = document.createElement('div');
      line.className = 'cloud-line';
      line.innerHTML = logs[i];
      consoleArea.appendChild(line);
      consoleArea.scrollTop = consoleArea.scrollHeight;
      i++;
      cloudTimer = setTimeout(printLogLine, 900);
    }
  }
  printLogLine();
}

// Fit simulator animation
function runFitSimulation() {
  const container = document.getElementById('fit-chart-anim');
  container.innerHTML = '';
  
  // Create 6 dynamic height bars
  const heights = [30, 65, 45, 90, 60, 80];
  heights.forEach((h, idx) => {
    const bar = document.createElement('div');
    bar.className = 'fit-bar';
    bar.style.height = '0%';
    container.appendChild(bar);
    
    setTimeout(() => {
      bar.style.height = `${h}%`;
    }, 100 * idx);
  });
}

function resetAppStates() {
  // Clear chat simulators
  chatTimers.forEach(t => clearTimeout(t));
  chatTimers = [];
  
  // Clear cloud simulator
  if (cloudTimer) clearTimeout(cloudTimer);
  
  // Hide overlays
  const rpOverlay = document.getElementById('rp-overlay');
  if (rpOverlay) rpOverlay.style.display = 'none';

  // Reset SteelForce success state
  const steelSuccess = document.getElementById('steel-success');
  if (steelSuccess) steelSuccess.style.display = 'none';

  // Reset DairyFresh success state
  const dairySuccess = document.getElementById('dairy-success');
  if (dairySuccess) dairySuccess.style.display = 'none';

  // Reset PawsFeed Quantities
  const dogVal = document.getElementById('dog-qty-val');
  const catVal = document.getElementById('cat-qty-val');
  const totalBillText = document.getElementById('pet-total-bill');
  if (dogVal) dogVal.textContent = '0';
  if (catVal) catVal.textContent = '0';
  if (totalBillText) totalBillText.textContent = '₹0';

  // Reset CallDesk Call Timer
  if (window.callerCallInterval) {
    clearInterval(window.callerCallInterval);
  }
  const callBtn = document.getElementById('caller-call-btn');
  const callerStatus = document.getElementById('caller-status-area');
  if (callerStatus) callerStatus.style.display = 'none';
  if (callBtn) callBtn.style.display = 'block';

  // Reset RouteFlow Location Tracker
  if (window.routeTrackInterval) {
    clearInterval(window.routeTrackInterval);
  }

  // Reset ChennaiFish Checkout Bar
  const fishBar = document.getElementById('fish-checkout-bar');
  if (fishBar) fishBar.style.display = 'none';
}

/* 4. Intersection Observer for Skills */
function initSkillObserver() {
  const skillSection = document.getElementById('skills');
  const bars = document.querySelectorAll('.skill-bar-fill');
  
  if (!skillSection || bars.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bars.forEach(bar => {
          const progress = bar.getAttribute('data-progress');
          bar.style.width = `${progress}%`;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(skillSection);
}

/* 5. 3D Tilt Effect on Smartphone Simulator */
function initTiltEffect() {
  const wrapper = document.querySelector('.phone-mockup-wrapper');
  const phone = document.querySelector('.smartphone');
  
  if (!wrapper || !phone) return;
  
  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate tilt
    const xAngle = (rect.height / 2 - y) / 15; // pitch
    const yAngle = (x - rect.width / 2) / 15;  // yaw
    
    phone.style.transform = `rotateX(${xAngle}deg) rotateY(${yAngle}deg) scale(1.02)`;
  });
  
  wrapper.addEventListener('mouseleave', () => {
    phone.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

/* 6. Contact Form Validation & Simulated Send */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  const btn = form.querySelector('.submit-btn');
  const btnText = btn.innerHTML;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Perform simple validation
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const msg = document.getElementById('form-message').value.trim();
    
    if (!name || !email || !msg) {
      alert('Please fill out all fields.');
      return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
    
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      
      form.reset();
      
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = btnText;
        btn.style.background = '';
      }, 3000);
      
    }, 2000);
  });
}

// Active navigation link highlighting on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  
  let currentSec = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) {
      currentSec = sec.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSec}`) {
      link.classList.add('active');
    }
  });
});

/* 7. Mouse Spotlight Glow Control */
function initMouseGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;
  
  window.addEventListener('mousemove', (e) => {
    // Update global mouse pointer positions
    globalMouse.x = e.clientX;
    globalMouse.y = e.clientY;
    
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });
}

/* 8. Premium Dual Custom Cursor Control */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Instantly set position of center core dot
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });
  
  // Smoothly LERP position of outer tracking ring
  function updateRing() {
    const ease = 0.15;
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;
    
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(updateRing);
  }
  requestAnimationFrame(updateRing);
  
  // Bind hover states using high-performance mouseover/mouseout event delegation
  document.addEventListener('mouseover', (e) => {
    const interactive = e.target.closest('a, button, input, textarea, select, .btn, .app-icon-wrapper, .back-arrow, .project-link, .submit-btn, .pay-btn, #rp-trigger');
    if (interactive) {
      dot.classList.add('hover');
      ring.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const interactive = e.target.closest('a, button, input, textarea, select, .btn, .app-icon-wrapper, .back-arrow, .project-link, .submit-btn, .pay-btn, #rp-trigger');
    if (interactive) {
      if (!e.relatedTarget || !interactive.contains(e.relatedTarget)) {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      }
    }
  });
}

/* 9. Scroll Reveal Observer */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

/* 10. Card Spotlight Glow Control */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-mouse-x', `${x}px`);
      card.style.setProperty('--card-mouse-y', `${y}px`);
    });
  });
}

/* 11. 3D Tilt Card Effect */
function initCardTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -(y - centerY) / 12; // pitch
      const rotateY = (x - centerX) / 12;  // yaw
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* 12. Animated Splash Screen Control */
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;
  
  // Set overflow hidden on body to prevent scrolling during splash
  document.body.style.overflow = 'hidden';
  
  let isRemoved = false;
  
  function removeSplash() {
    if (isRemoved) return;
    isRemoved = true;
    
    // Fade out splash overlay
    splash.classList.add('fade-out');
    document.body.style.overflow = ''; // Restore page scrolling
    
    // Completely remove from DOM after CSS transition completes
    setTimeout(() => {
      splash.remove();
    }, 800);
  }
  
  // Auto-remove after 2.5 seconds (gives animations time to run)
  setTimeout(removeSplash, 2500);
}

/* 13. Light/Dark Theme Toggle Control */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  const icon = toggleBtn.querySelector('i');
  
  // Check saved setting or default to system
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set default (default is dark, so light theme is chosen if saved as 'light' or if system defaults to light)
  const isLight = savedTheme === 'light' || (!savedTheme && !systemPrefersDark);
  
  if (isLight) {
    document.body.classList.add('light-theme');
    if (icon) icon.className = 'fa-solid fa-sun';
  } else {
    document.body.classList.remove('light-theme');
    if (icon) icon.className = 'fa-solid fa-moon';
  }
  
  toggleBtn.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.toggle('light-theme');
    
    // Smooth transition toggle
    document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
    
    if (isCurrentlyLight) {
      localStorage.setItem('theme', 'light');
      if (icon) {
        icon.className = 'fa-solid fa-sun';
      }
    } else {
      localStorage.setItem('theme', 'dark');
      if (icon) {
        icon.className = 'fa-solid fa-moon';
      }
    }
    
    // Clear transition to avoid cursor lag issues later
    setTimeout(() => {
      document.body.style.transition = '';
    }, 400);
  });
}
