document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initTypingAnimation();
  initPhoneSimulator();
  initSkillObserver();
  initTiltEffect();
  initContactForm();
});

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
  const maxParticles = 40;
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.fill();
    }
  }
  
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach((p, idx) => {
      p.update();
      p.draw();
      
      // Draw lines between nearby particles
      for (let j = idx + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
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
