/**
 * ============================================================================
 * MAXIEMILLIAN // MINIMALIST ELEGANT PORTFOLIO JAVASCRIPT ENGINE
 * Warm Espresso, Cognac & Amber Artisan Theme
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initAmbientCanvas();
  initTopologyCanvas();
  initTypewriter();
  initScrollAnimations();
  initStatCounters();
  initSkillsFilter();
  initPhilosophyQuotes();
  initInteractiveTerminal();
  initProjectModals();
  initAudioSynthesizer();
  initThemeAndNavbar();
  initContactForm();
  initQuickCopy();
  initLanguageSwitcher();
  initNodeGraphNavigation();
});

/* ==========================================================================
   1. CUSTOM WARM MINIMALIST CURSOR
   ========================================================================== */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      document.body.classList.add('cursor-active');
      isMoving = true;
    }
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .quick-chip, .topology-card');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/* ==========================================================================
   2. WARM AMBIENT CANVAS (Golden Amber & Warm Champagne Drift)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 65;
  const maxDistance = 135;
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 1.6 + 0.6;
      this.baseAlpha = Math.random() * 0.4 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      const isDark = document.body.classList.contains('dark-theme');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(223, 173, 114, ${this.baseAlpha * 0.45})`
        : `rgba(140, 88, 40, ${this.baseAlpha * 0.25})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const isDark = document.body.classList.contains('dark-theme');
          const alpha = (1 - dist / maxDistance) * (isDark ? 0.05 : 0.03);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark
            ? `rgba(200, 155, 104, ${alpha})`
            : `rgba(140, 88, 40, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   3. INTERACTIVE 3D DISTRIBUTED CLUSTER TOPOLOGY CANVAS
   ========================================================================== */
function initTopologyCanvas() {
  const canvas = document.getElementById('topologyCanvas');
  const burstBtn = document.getElementById('burstPacketsBtn');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let rotX = 0.35;
  let rotY = 0.45;
  let targetRotX = 0.35;
  let targetRotY = 0.45;
  let hoveredNode = null;
  let mousePos = { x: 0, y: 0 };

  // Skill & Tech Stack Nodes (Languages + Expertise Domains)
  const rawNodes = [
    { id: 0, name: 'Maxiemillian', tag: 'WEB-DEVELOPER', x: 0, y: 0, z: 0, color: '#dfad72', size: 10, isLeader: true, latency: 'Student', rps: '6 repos' },
    { id: 1, name: 'PHP', tag: 'BACKEND · SERVER', x: -115, y: -45, z: 20, color: '#c89b68', size: 7.5, latency: '82%', rps: 'Laravel' },
    { id: 2, name: 'HTML5 & CSS3', tag: 'FRONTEND · WEB', x: 110, y: -65, z: 45, color: '#e6b885', size: 7.5, latency: '88%', rps: 'Responsive UI' },
    { id: 3, name: 'JavaScript', tag: 'FRONTEND · INTERACTIVITY', x: 105, y: 65, z: -35, color: '#dfad72', size: 7.5, latency: '72%', rps: 'DOM & Events' },
    { id: 4, name: 'MySQL', tag: 'DATABASE · SQL', x: -85, y: 85, z: 25, color: '#c27b53', size: 7.5, latency: '80%', rps: 'CRUD & Joins' },
    { id: 5, name: 'GitHub Actions', tag: 'DEVOPS · CI/CD', x: 0, y: -90, z: -40, color: '#f0dfcb', size: 7, latency: '75%', rps: 'CI/CD' }
  ];

  // Connection Edges
  const links = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 3 },
    { from: 0, to: 4 },
    { from: 0, to: 5 },
    { from: 1, to: 2 },
    { from: 3, to: 4 },
    { from: 5, to: 1 }
  ];

  // Packets traveling along links
  let packets = [];
  function spawnPacket(linkIdx, burst = false) {
    const link = links[linkIdx];
    packets.push({
      from: link.from,
      to: link.to,
      progress: 0,
      speed: burst ? 0.022 + Math.random() * 0.015 : 0.007 + Math.random() * 0.006,
      size: burst ? 3.5 : 2.2,
      color: burst ? '#ffffff' : '#dfad72',
      burst: burst
    });
  }

  // Populate initial packets
  for (let i = 0; i < links.length; i++) {
    spawnPacket(i);
    spawnPacket(i);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse interaction
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;

    if (isDragging) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      targetRotY += dx * 0.008;
      targetRotX += dy * 0.008;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }
  });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastMouseX;
      const dy = e.touches[0].clientY - lastMouseY;
      targetRotY += dx * 0.008;
      targetRotX += dy * 0.008;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  });

  canvas.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Click on node to trigger packet burst & update HUD
  canvas.addEventListener('click', () => {
    if (hoveredNode) {
      triggerBurst(hoveredNode.id);
      playUiSound('bloop');
    }
  });

  if (burstBtn) {
    burstBtn.addEventListener('click', () => {
      triggerBurst(0);
      playUiSound('burst');
    });
  }

  function triggerBurst(fromNodeId = 0) {
    for (let i = 0; i < links.length; i++) {
      spawnPacket(i, true);
      spawnPacket(i, true);
      spawnPacket(i, true);
    }
  }

  // 3D Projection math
  function project(x, y, z) {
    // Rotation Y
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;

    // Rotation X
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const fov = 340;
    const scale = fov / (fov + z2);
    const screenX = width / 2 + x1 * scale;
    const screenY = height / 2 + y2 * scale;

    return { x: screenX, y: screenY, z: z2, scale: scale };
  }

  let time = 0;

  function render() {
    time += 0.016;

    // Smooth auto-orbit if not dragging
    if (!isDragging) {
      targetRotY += 0.0025;
      targetRotX = 0.35 + Math.sin(time * 0.5) * 0.08;
    }

    rotX += (targetRotX - rotX) * 0.1;
    rotY += (targetRotY - rotY) * 0.1;

    ctx.clearRect(0, 0, width, height);

    const isDark = document.body.classList.contains('dark-theme');

    // Project all nodes
    const projectedNodes = rawNodes.map((n) => {
      // Subtle float oscillation
      const floatY = n.y + Math.sin(time * 2 + n.id) * 4;
      const proj = project(n.x, floatY, n.z);
      return { ...n, px: proj.x, py: proj.y, pz: proj.z, scale: proj.scale };
    });

    // Check hover
    hoveredNode = null;
    for (let i = 0; i < projectedNodes.length; i++) {
      const n = projectedNodes[i];
      const radius = n.size * n.scale * 1.6;
      const dx = mousePos.x - n.px;
      const dy = mousePos.y - n.py;
      if (dx * dx + dy * dy < radius * radius + 100) {
        hoveredNode = n;
        break;
      }
    }

    // Sort links and nodes by depth (z-index)
    // Draw links
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const p1 = projectedNodes[link.from];
      const p2 = projectedNodes[link.to];

      const isHighlighted = hoveredNode && (hoveredNode.id === link.from || hoveredNode.id === link.to);

      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);

      if (isHighlighted) {
        ctx.strokeStyle = isDark ? 'rgba(223, 173, 114, 0.75)' : 'rgba(140, 88, 40, 0.65)';
        ctx.lineWidth = 1.8;
      } else {
        ctx.strokeStyle = isDark ? 'rgba(214, 180, 140, 0.18)' : 'rgba(120, 80, 40, 0.14)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();
    }

    // Update and draw packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.progress += p.speed;

      const p1 = projectedNodes[p.from];
      const p2 = projectedNodes[p.to];

      if (p.progress >= 1) {
        if (p.burst) {
          packets.splice(i, 1);
          continue;
        } else {
          p.progress = 0;
          p.speed = 0.007 + Math.random() * 0.006;
        }
      }

      const curX = p1.px + (p2.px - p1.px) * p.progress;
      const curY = p1.py + (p2.py - p1.py) * p.progress;
      const curScale = p1.scale + (p2.scale - p1.scale) * p.progress;

      ctx.beginPath();
      ctx.arc(curX, curY, p.size * curScale, 0, Math.PI * 2);
      ctx.fillStyle = p.burst ? (isDark ? '#ffffff' : '#e6b885') : (isDark ? '#dfad72' : '#8c5828');
      ctx.shadowBlur = p.burst ? 12 : 6;
      ctx.shadowColor = '#dfad72';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Sort nodes back-to-front
    const sortedNodes = [...projectedNodes].sort((a, b) => b.pz - a.pz);

    // Draw nodes
    for (let i = 0; i < sortedNodes.length; i++) {
      const n = sortedNodes[i];
      const isHovered = hoveredNode && hoveredNode.id === n.id;
      const radius = (n.size * (isHovered ? 1.35 : 1)) * n.scale;

      // Outer glow / aura
      ctx.beginPath();
      ctx.arc(n.px, n.py, radius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(200, 155, 104, ${isHovered ? 0.25 : 0.08})`
        : `rgba(140, 88, 40, ${isHovered ? 0.18 : 0.05})`;
      ctx.fill();

      // Node ring
      ctx.beginPath();
      ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#161412' : '#ffffff';
      ctx.strokeStyle = isHovered ? '#dfad72' : (isDark ? 'rgba(214, 180, 140, 0.5)' : 'rgba(120, 80, 40, 0.4)');
      ctx.lineWidth = isHovered ? 2 : 1.2;
      ctx.fill();
      ctx.stroke();

      // Node core dot
      ctx.beginPath();
      ctx.arc(n.px, n.py, radius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();

      // Monospace label
      ctx.font = `${Math.max(9, Math.floor(10 * n.scale))}px "Fira Code", monospace`;
      ctx.fillStyle = isHovered
        ? (isDark ? '#ffffff' : '#1c1712')
        : (isDark ? '#cdc3b8' : '#4a3e33');
      ctx.textAlign = 'center';
      ctx.fillText(n.name, n.px, n.py + radius + 13 * n.scale);

      // Node Tag / Pill
      if (isHovered) {
        ctx.font = `8px "Fira Code", monospace`;
        ctx.fillStyle = '#dfad72';
        ctx.fillText(`[${n.tag} • ${n.latency}]`, n.px, n.py - radius - 6);
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. TYPEWRITER EFFECT
   ========================================================================== */
const typewriterPhrases = {
  en: [
    'Functional Web Applications',
    'Clean PHP Backends',
    'MySQL-Powered Systems',
    'Responsive HTML & CSS Interfaces',
    'Modern Laravel Projects'
  ],
  id: [
    'Aplikasi Web Fungsional',
    'Backend PHP yang Bersih',
    'Sistem Berbasis MySQL',
    'Tampilan HTML & CSS Responsif',
    'Proyek Laravel Modern'
  ]
};

let resetTypewriterLang = null;

function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 85;
  let typeTimeout = null;

  resetTypewriterLang = () => {
    if (typeTimeout) clearTimeout(typeTimeout);
    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;
    target.textContent = '';
    type();
  };

  function type() {
    const list = typewriterPhrases[currentLang] || typewriterPhrases.en;
    const currentPhrase = list[phraseIndex % list.length];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % list.length;
      typingSpeed = 400;
    }

    typeTimeout = setTimeout(type, typingSpeed);
  }

  typeTimeout = setTimeout(type, 800);
}

/* ==========================================================================
   5. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   6. STAT COUNTERS
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach((numEl) => {
            const target = parseInt(numEl.getAttribute('data-count'), 10);
            let current = 0;
            const increment = target / 25;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                numEl.textContent = target;
                clearInterval(timer);
              } else {
                numEl.textContent = Math.floor(current);
              }
            }, 40);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroSection = document.querySelector('.hero-section');
  if (heroSection) observer.observe(heroSection);
}

/* ==========================================================================
   7. SKILLS FILTER TABS
   ========================================================================== */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      playUiSound('click');
    });
  });
}

/* ==========================================================================
   8. PHILOSOPHY QUOTE GENERATOR
   ========================================================================== */
const quotes_i18n = {
  en: [
    { text: '"Simplicity is prerequisite for reliability."', author: '— Edsger W. Dijkstra' },
    { text: '"Make it work, make it right, make it fast."', author: '— Kent Beck' },
    { text: '"First, solve the problem. Then, write the code."', author: '— John Johnson' },
    { text: '"Controlling complexity is the essence of computer programming."', author: '— Brian Kernighan' },
    { text: '"Good code is its own best documentation."', author: '— Steve McConnell' }
  ],
  id: [
    { text: '"Kesederhanaan adalah syarat mutlak untuk keandalan."', author: '— Edsger W. Dijkstra' },
    { text: '"Buat agar bekerja, buat agar benar, lalu buat agar cepat."', author: '— Kent Beck' },
    { text: '"Pertama selesaikan masalahnya, baru kemudian tulis kodenya."', author: '— John Johnson' },
    { text: '"Mengendalikan kompleksitas adalah esensi dari pemrograman komputer."', author: '— Brian Kernighan' },
    { text: '"Kode yang baik adalah dokumentasi terbaik bagi dirinya sendiri."', author: '— Steve McConnell' }
  ]
};

let updateQuoteLang = null;

function initPhilosophyQuotes() {
  const quoteText = document.getElementById('philosophyQuote');
  const quoteAuthor = document.querySelector('.quote-author');
  const btn = document.getElementById('nextQuoteBtn');
  if (!quoteText || !btn) return;

  let index = 0;

  updateQuoteLang = () => {
    const list = quotes_i18n[currentLang] || quotes_i18n.en;
    quoteText.textContent = list[index % list.length].text;
    if (quoteAuthor) quoteAuthor.textContent = list[index % list.length].author;
  };

  btn.addEventListener('click', () => {
    const list = quotes_i18n[currentLang] || quotes_i18n.en;
    index = (index + 1) % list.length;
    quoteText.style.opacity = '0';
    quoteText.style.transform = 'translateY(-4px)';

    setTimeout(() => {
      quoteText.textContent = list[index].text;
      if (quoteAuthor) quoteAuthor.textContent = list[index].author;
      quoteText.style.opacity = '1';
      quoteText.style.transform = 'translateY(0)';
    }, 180);

    playUiSound('bloop');
  });
}

/* ==========================================================================
   9. INTERACTIVE DEVELOPER TERMINAL
   ========================================================================== */
let updateTerminalLang = null;

function initInteractiveTerminal() {
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  const welcome = document.getElementById('terminalWelcome');
  const chips = document.querySelectorAll('.quick-chip');
  if (!input || !output) return;

  const commands = {
    help: () => currentLang === 'id' ? `Daftar Perintah:
  • help / bantuan     - Menampilkan daftar perintah
  • about / tentang    - Ringkasan latar belakang & fokus
  • skills / keahlian  - Keahlian teknis & stack
  • projects / proyek  - Portofolio proyek pilihan
  • contact / kontak   - Informasi email & jejaring
  • quote / kutipan    - Prinsip pemrograman
  • clear / bersih     - Membersihkan layar konsol` : `Available Commands:
  • help       - Show available commands
  • about      - Summary of engineering ethos & background
  • skills     - Technical proficiencies & stack
  • projects   - Notable production architectures
  • contact    - Email & coordinate details
  • quote      - Engineering principle
  • clear      - Clear console buffer`,

    about: () => currentLang === 'id' ? `Maxiemillian (alvenath) — Web Developer & Mahasiswa Sistem Informasi.
Mahasiswa asal Indonesia, berspesialisasi dalam Pengembangan Web dengan PHP,
MySQL, dan membangun aplikasi web berbasis data yang fungsional dan bersih.
Saat ini mendalami framework Laravel untuk memperluas kemampuan full-stack.` : `Maxiemillian (alvenath) — Web Developer & Information Systems Student.
College student from Indonesia, specializing in Web Development with PHP,
MySQL, and building clean, functional data-driven web applications.
Currently learning Laravel to expand full-stack capabilities.`,

    skills: () => currentLang === 'id' ? `[KEAHLIAN INTI]:
  Bahasa:     PHP, JavaScript, HTML5, CSS3, SQL
  Backend:    PHP (sedang mendalami Laravel), MySQL, GitHub Actions
  Frontend:   HTML5, CSS3, JavaScript, Desain Responsif
  Basis Data: MySQL (CRUD, Relasi Joins, Desain Skema)
  DevOps:     GitHub, GitHub Actions (CI/CD)` : `[CORE STACK]:
  Languages:  PHP, JavaScript, HTML5, CSS3, SQL
  Backend:    PHP (Laravel - learning), MySQL, GitHub Actions
  Frontend:   HTML5, CSS3, JavaScript, Responsive Design
  Database:   MySQL (CRUD, Joins, Schema Design)
  DevOps:     GitHub, GitHub Actions (CI/CD)`,

    projects: () => currentLang === 'id' ? `[PROYEK PILIHAN]:
  1. Dapur Ina Aina - Sistem Kasir & Inventaris Restoran (PHP + MySQL)
  2. Portofolio Ini - Web Showcase (HTML5 / CSS3 / Vanilla JS)
  3. K-List         - Platform Rating Drama Korea (Supabase + JS)` : `[SELECTED PROJECTS]:
  1. Dapur Ina Aina - Restaurant Order & Billing System (PHP + MySQL)
  2. This Portfolio - HTML5 / CSS3 / Vanilla JS Showcase
  3. K-List         - K-Drama Listing & Rating App (Supabase + JS)`,

    contact: () => currentLang === 'id' ? `Koordinat & Kontak:
  Email:   maxiemillian911@gmail.com
  GitHub:  https://github.com/alvenath
  Status:  Terbuka untuk kolaborasi & proyek web tingkat pemula.` : `Coordinates:
  Email:   maxiemillian911@gmail.com
  GitHub:  https://github.com/alvenath
  Status:  Open to collaboration & beginner-friendly web projects.`,

    quote: () => currentLang === 'id'
      ? `"Hanya ada dua hal yang sulit dalam Ilmu Komputer: pembatalan cache dan penamaan hal." — Phil Karlton`
      : `"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton`,

    clear: () => {
      output.innerHTML = '';
      return '';
    }
  };

  // Indonesian command aliases
  commands.bantuan = commands.help;
  commands.tentang = commands.about;
  commands.keahlian = commands.skills;
  commands.proyek = commands.projects;
  commands.kontak = commands.contact;
  commands.kutipan = commands.quote;
  commands.bersih = commands.clear;

  updateTerminalLang = () => {
    if (welcome) {
      welcome.innerHTML = currentLang === 'id'
        ? `Maxiemillian (alvenath) Interactive Shell v1.0.<br />Ketik <span class="term-cmd-highlight">help</span> untuk melihat perintah, <span class="term-cmd-highlight">skills</span>, <span class="term-cmd-highlight">projects</span>, atau <span class="term-cmd-highlight">clear</span>.`
        : `Maxiemillian (alvenath) Interactive Shell v1.0.<br />Type <span class="term-cmd-highlight">help</span> to list commands, <span class="term-cmd-highlight">skills</span>, <span class="term-cmd-highlight">projects</span>, or <span class="term-cmd-highlight">clear</span>.`;
    }
    if (input) {
      input.placeholder = currentLang === 'id'
        ? "Ketik perintah (contoh: 'help', 'skills', 'projects')..."
        : "Type a command (e.g., 'help', 'skills', 'projects')...";
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear' || cmd === 'bersih') {
      commands.clear();
      input.value = '';
      return;
    }

    const item = document.createElement('div');
    item.className = 'terminal-output-item';

    const cmdRow = document.createElement('div');
    cmdRow.className = 'terminal-output-cmd';
    cmdRow.textContent = `max@workspace:~$ ${rawCmd}`;

    const resRow = document.createElement('div');
    resRow.className = 'terminal-output-res';

    if (commands[cmd]) {
      resRow.textContent = commands[cmd]();
    } else {
      resRow.textContent = currentLang === 'id'
        ? `zsh: perintah tidak ditemukan: "${rawCmd}". Ketik 'help' untuk panduan.`
        : `zsh: command not found: "${rawCmd}". Type 'help' for manual.`;
    }

    item.appendChild(cmdRow);
    item.appendChild(resRow);
    output.appendChild(item);

    input.value = '';
    const screen = document.getElementById('terminalScreen');
    if (screen) screen.scrollTop = screen.scrollHeight;
    playUiSound('click');
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
}

/* ==========================================================================
   10. PROJECT CASE STUDY MODALS
   ========================================================================== */
const projectData_i18n = {
  en: {
    1: {
      title: 'Dapur Ina Aina',
      subtitle: 'Restaurant POS, Inventory & Billing System (PHP + MySQL)',
      overview: 'A complete culinary order and transaction processing system developed for "Dapur Ina Aina". Built with modular PHP using PDO for database security and MySQL/MariaDB for relational storage. Features structured customer order handling, dynamic inventory and ingredient stock updates, and a flexible billing engine supporting both cash and digital payment methods with automated receipt calculations.',
      metrics: [
        { label: 'Backend', val: 'PHP (PDO) + MySQL' },
        { label: 'Modules', val: 'Orders, Stock, Billing' },
        { label: 'Payments', val: 'Cash & QRIS/Transfer' }
      ],
      stack: ['PHP (PDO)', 'MySQL', 'MariaDB', 'HTML5', 'CSS3', 'JavaScript']
    },
    2: {
      title: 'This Portfolio // Interactive Developer Showcase',
      subtitle: 'Pure HTML5, CSS3 & Vanilla JavaScript',
      overview: 'A personal portfolio website built with zero frameworks — pure HTML5, CSS3, and Vanilla JavaScript. Features an animated ambient canvas, interactive 3D skill graph with physics simulation, a functional developer terminal CLI, smooth scroll reveal animations, and a responsive glassmorphism design system.',
      metrics: [
        { label: 'Tech', val: 'No frameworks' },
        { label: 'Canvas', val: '3D Topology' },
        { label: 'Terminal', val: 'CLI commands' }
      ],
      stack: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Canvas API', 'FontAwesome']
    },
    3: {
      title: 'K-List // K-Drama Rating & Bucketlist Platform',
      subtitle: 'Full-Stack Platform (Supabase, JavaScript, Vercel)',
      overview: 'A dedicated platform for Korean drama enthusiasts to discover, catalog, rate, and track drama series. Built with a responsive modern frontend and powered by Supabase for user authentication, cloud PostgreSQL database management, and media storage. Features user ratings, reviews, watchlist categories (Watching, Completed, Plan to Watch), and dynamic actor & drama detail pages, deployed live on Vercel.',
      metrics: [
        { label: 'Backend', val: 'Supabase (Auth & DB)' },
        { label: 'Catalog', val: 'Dynamic Watchlist' },
        { label: 'Deployment', val: 'Vercel Live' }
      ],
      stack: ['JavaScript', 'Supabase', 'PostgreSQL', 'HTML5', 'CSS3', 'Vercel']
    }
  },
  id: {
    1: {
      title: 'Dapur Ina Aina',
      subtitle: 'Sistem Kasir, Stok & Penagihan Restoran (PHP + MySQL)',
      overview: 'Sistem pemrosesan pesanan dan transaksi kuliner menyeluruh yang dirancang untuk restoran "Dapur Ina Aina". Dibangun dengan PHP modular menggunakan PDO demi keamanan basis data, serta MySQL/MariaDB untuk penyimpanan relasional. Memiliki fitur manajemen pesanan meja pelanggan, pembaruan stok bahan secara real-time, dan mesin pembayaran fleksibel yang mendukung tunai maupun non-tunai (QRIS) dengan kalkulasi nota otomatis.',
      metrics: [
        { label: 'Backend', val: 'PHP (PDO) + MySQL' },
        { label: 'Modul', val: 'Pesanan, Stok, Kasir' },
        { label: 'Pembayaran', val: 'Tunai & QRIS/Transfer' }
      ],
      stack: ['PHP (PDO)', 'MySQL', 'MariaDB', 'HTML5', 'CSS3', 'JavaScript']
    },
    2: {
      title: 'Portofolio Ini // Showcase Interaktif Developer',
      subtitle: 'Murni HTML5, CSS3 & Vanilla JavaScript',
      overview: 'Website portofolio pribadi yang dibangun murni tanpa framework — hanya HTML5, CSS3, dan Vanilla JavaScript. Dilengkapi latar kanvas partikel dinamis, graf keahlian 3D interaktif berbasis simulasi fisika, terminal CLI developer yang berfungsi penuh, animasi gulir halus, dan sistem desain glassmorphism yang elegan.',
      metrics: [
        { label: 'Teknologi', val: 'Tanpa framework' },
        { label: 'Kanvas', val: 'Topologi 3D' },
        { label: 'Terminal', val: 'Perintah CLI' }
      ],
      stack: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Canvas API', 'FontAwesome']
    },
    3: {
      title: 'K-List // Platform Rating & Daftar Pantau K-Drama',
      subtitle: 'Platform Full-Stack (Supabase, JavaScript, Vercel)',
      overview: 'Platform khusus bagi pecinta drama Korea untuk menjelajah, mengkatalog, memberi rating, dan mencatat serial drama. Dibangun dengan antarmuka frontend modern yang responsif dan ditenagai Supabase untuk autentikasi pengguna, manajemen basis data PostgreSQL cloud, serta penyimpanan media. Dilengkapi rating komunitas, ulasan, daftar pantauan (Sedang Ditonton, Selesai, Rencana Ditonton), dan halaman detail aktor & drama.',
      metrics: [
        { label: 'Backend', val: 'Supabase (Auth & DB)' },
        { label: 'Katalog', val: 'Daftar Pantau Dinamis' },
        { label: 'Deployment', val: 'Live di Vercel' }
      ],
      stack: ['JavaScript', 'Supabase', 'PostgreSQL', 'HTML5', 'CSS3', 'Vercel']
    }
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggers = document.querySelectorAll('.project-modal-trigger');
  if (!modal || !modalBody) return;

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project-id');
      const langData = projectData_i18n[currentLang] || projectData_i18n.en;
      const data = langData[id];
      if (!data) return;

      modalBody.innerHTML = `
        <h2 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--text-primary); margin-bottom: 0.35rem;">${data.title}</h2>
        <p style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent-cognac); margin-bottom: 1.25rem;">${data.subtitle}</p>
        
        <p style="color: var(--text-secondary); line-height: 1.65; font-size: 0.95rem; margin-bottom: 1.5rem;">${data.overview}</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          ${data.metrics.map(m => `
            <div style="background: var(--accent-soft); padding: 0.85rem; border-radius: 8px; border: 1px solid var(--border-glass);">
              <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; display: block;">${m.label}</span>
              <span style="font-size: 1.1rem; font-weight: 700; color: var(--accent-amber);">${m.val}</span>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 1rem;">
          <h4 style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">${currentLang === 'id' ? 'Arsitektur & Stack' : 'Architecture Stack'}</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${data.stack.map(s => `<span style="font-family: var(--font-mono); font-size: 0.72rem; padding: 0.25rem 0.6rem; background: var(--bg-secondary); border: 1px solid var(--border-glass); border-radius: 4px; color: var(--text-primary);">${s}</span>`).join('')}
          </div>
        </div>
      `;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      playUiSound('click');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

/* ==========================================================================
   11. PROCEDURAL WEB AUDIO SYNTHESIZER (Tactile UI Audio)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioSynthesizer() {
  const toggleBtn = document.getElementById('soundToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    soundEnabled = !soundEnabled;
    toggleBtn.classList.toggle('active', soundEnabled);
    const dict = typeof translations !== 'undefined' ? (translations[currentLang] || translations.en) : null;
    toggleBtn.querySelector('span').textContent = soundEnabled 
      ? (dict ? dict.sound_on : 'Sound: ON') 
      : (dict ? dict.sound_off : 'Sound: OFF');
    toggleBtn.querySelector('i').className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';

    if (soundEnabled) {
      playUiSound('bloop');
    }
  });
}

function playUiSound(type) {
  if (!soundEnabled || !audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'bloop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'burst') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (err) {
    // Graceful fallback
  }
}

/* ==========================================================================
   12. THEME SWITCHER & NAVBAR CONTROLS
   ========================================================================== */
function initThemeAndNavbar() {
  const themeToggle = document.getElementById('themeToggle');
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  // Theme switch
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      }
      playUiSound('click');
    });
  }

  // Navbar scroll background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   13. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn = document.getElementById('submitBtn');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (btn) btn.disabled = true;

    const dict = typeof translations !== 'undefined' ? (translations[currentLang] || translations.en) : null;
    status.textContent = dict ? dict.form_sending : 'Transmitting packet...';
    status.className = 'form-status';

    setTimeout(() => {
      status.textContent = dict ? dict.form_success : '✓ Message received! Maxiemillian will respond within 24 hours.';
      status.className = 'form-status success';
      form.reset();
      if (btn) btn.disabled = false;
      showToast(dict ? dict.toast_sent : 'Message sent successfully.');
      playUiSound('bloop');
    }, 1000);
  });
}

/* ==========================================================================
   14. QUICK CLIPBOARD COPY
   ========================================================================== */
function initQuickCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');
  if (!copyBtn || !emailText) return;

  copyBtn.addEventListener('click', () => {
    const email = emailText.textContent.trim();
    navigator.clipboard.writeText(email).then(() => {
      const dict = typeof translations !== 'undefined' ? (translations[currentLang] || translations.en) : null;
      showToast(dict ? dict.toast_copied : 'Email address copied to clipboard.');
      playUiSound('click');
    });
  });
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-check"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ==========================================================================
   15. BILINGUAL INTERNATIONALIZATION (English & Bahasa Indonesia)
   ========================================================================== */
let currentLang = localStorage.getItem('portfolio_lang') || 'en';

const translations = {
  en: {
    // Nav
    nav_about: 'Philosophy',
    nav_graph: 'Node Graph',
    nav_stack: 'Stack',
    nav_works: 'Works',
    nav_journey: 'Journey',
    nav_cli: 'CLI',
    nav_contact: 'Initiate Contact',

    // Sound
    sound_off: 'Sound: OFF',
    sound_on: 'Sound: ON',

    // Hero
    hero_badge: 'Open to Web Projects & Collaboration',
    hero_role_title: 'Web Developer & Student',
    hero_building: 'Building',
    hero_bio: 'College student majoring in Information Systems in Indonesia, passionate about web development. Building functional, data-driven applications with PHP backends and clean, modern user interfaces.',
    hero_cta_projects: 'Explore Selected Work',
    hero_cta_cli: 'Launch Terminal CLI',
    hero_cta_contact: 'Direct Contact',
    stat_repos: 'Repositories',
    stat_stack: 'Tech Stack Areas',
    stat_passion: 'Passion for Code',
    scroll_down: 'Scroll Down',

    // Topology
    topo_title: 'SKILL GRAPH // WEB DEV STACK',
    topo_hint: 'Click & Drag Nodes - Orbit Physics',
    topo_core: 'Core Skills',
    topo_domains: '5 Domains',
    topo_focus_lbl: 'Focus',
    topo_focus_val: 'Web Dev',
    topo_status_lbl: 'Status',
    topo_status_val: 'Student',
    topo_btn: 'Skill Pulse',

    // Section 1 - About
    about_subtitle: '01 // About Me',
    about_title: 'Code with purpose. Build with clarity.',
    about_desc: 'A passionate web developer and student from Indonesia, building functional, data-driven web applications.',
    about_lead: "I'm Maxiemillian Davin Airell a college student from Indonesia majoring in Information Systems, with a passion for web development and building things that actually work.",
    about_body: "I specialize in integrating backend systems (PHP, MySQL) with modern, clean frontend interfaces. Currently expanding my skills into full-stack development with Laravel, while exploring the intersection of clean code and great design.",
    val1_title: 'Full-Stack Web Development',
    val1_desc: 'Building functional, data-driven apps with PHP backends and clean CSS frontends.',
    val2_title: 'Database-Driven Applications',
    val2_desc: 'Designing and querying MySQL databases to power robust web applications.',
    val3_title: 'Always Learning',
    val3_desc: 'Currently mastering Laravel and exploring modern web frameworks to level up my craft.',
    matrix_title: 'DEVELOPER PROFILE',
    m_focus_key: 'Primary Focus',
    m_focus_val: 'Web Development & Information Systems',
    m_stack_key: 'Core Stack',
    m_avail_key: 'Availability',
    m_avail_val: 'Open for beginner-friendly projects & collaboration',
    m_loc_key: 'Location',
    m_loc_val: 'Indonesia',
    m_learn_key: 'Currently Learning',
    m_learn_val: 'Laravel Framework',
    next_maxim: 'Next Maxim',

    // Section 2 - Skills
    skills_subtitle: '02 // Stack & Tooling',
    skills_title: 'Technologies I Work With',
    skills_desc: 'Tools and languages I use regularly for coursework, personal projects, and data-driven web applications.',
    filter_all: 'All Stack',
    filter_backend: 'Systems & Backend',
    filter_frontend: 'Frontend & Graphics',
    filter_cloud: 'Cloud & Orchestration',
    filter_data: 'Storage & Streaming',
    skill_php_desc: 'Server-side scripting, form handling, session management, and backend logic for web apps',
    skill_laravel_desc: 'Currently mastering Laravel — MVC architecture, Eloquent ORM, and Blade templating',
    skill_html_desc: 'Semantic markup, responsive layouts, clean CSS design, and modern UI patterns',
    skill_js_desc: 'DOM manipulation, event handling, fetch API, and interactive user interface components',
    skill_mysql_desc: 'Relational database design, SQL queries, joins, and data management for web applications',
    skill_git_desc: 'Version control, repository management, and basic CI/CD automation with GitHub Actions',

    // Section 3 - Projects
    projects_subtitle: '03 // Projects',
    projects_title: "What I've Been Building",
    projects_desc: 'Personal and coursework projects showcasing my passion for web development, clean design, and data-driven applications.',
    p1_tag: 'Restaurant POS & Order System',
    p1_summary: 'A complete food ordering, inventory, and payment processing system engineered for "Dapur Ina Aina". Built with PHP (PDO) and MySQL/MariaDB to manage dining orders, track ingredient stock levels, and generate invoices with cash and cashless payment options.',
    p1_hl1: 'Modular PHP with PDO security & normalized MariaDB/MySQL database',
    p1_hl2: 'Multi-channel billing (Cash / QRIS), receipts, and live inventory tracking',
    p2_tag: 'Portfolio & Personal Project',
    p2_title: 'This Portfolio // Interactive Developer Showcase',
    p2_summary: 'A personal portfolio website built with pure HTML, CSS, and Vanilla JavaScript. Features animated canvas backgrounds, interactive 3D skill graph, developer terminal CLI, and smooth scroll animations.',
    p2_hl1: 'Interactive 3D topology canvas with physics',
    p2_hl2: 'CLI terminal with real commands',
    p3_tag: 'Full-Stack Web Platform // Entertainment',
    p3_title: 'K-List // K-Drama Rating & Bucketlist',
    p3_summary: 'A modern full-stack web application designed for listing, tracking, and rating Korean dramas. Built with a responsive modern UI and integrated with Supabase for user authentication, cloud PostgreSQL database, and media storage, with instant continuous deployment on Vercel.',
    p3_hl1: 'Supabase backend integration (Auth, Postgres DB & Storage)',
    p3_hl2: 'Interactive community ratings, reviews & custom watchlists',
    btn_details: 'Project Details',
    btn_repo: 'Repository',
    btn_demo: 'Live Demo',

    // Section 4 - Experience
    exp_subtitle: '04 // Education & Journey',
    exp_title: 'My Learning Path',
    exp1_period: '2022 - Present',
    exp1_inst: 'University Gunadarma',
    exp1_role: "Bachelor's Degree - Information Systems",
    exp1_desc: 'Currently pursuing my degree in Information Systems in Indonesia, with a specialization in Web Development. Learning backend systems, database management, and integrating server-side logic with modern user interfaces.',
    exp2_period: '2023 - Present',
    exp2_inst: 'Self-Learning',
    exp2_role: 'Full-Stack Web Development',
    exp2_desc: 'Expanding portfolio with full-stack projects using PHP for backend logic, clean CSS design for the frontend, and now exploring Laravel as a modern framework to build more scalable web applications.',
    exp3_period: '2024 - Present',
    exp3_inst: 'Open Source & Community',
    exp3_role: 'Open to Collaboration',
    exp3_desc: 'Looking to collaborate on beginner-friendly web projects and contribute to documentation. Passionate about building functional applications and growing as a developer through community contribution.',

    // Section 5 - Terminal
    cli_subtitle: '05 // Interactive Console',
    cli_title: 'Developer Terminal',
    cli_desc: "Type <code class='inline-code'>help</code> to run diagnostics, view architecture specs, or inspect contact channels.",
    cli_welcome: "Maxiemillian (alvenath) Interactive Shell v1.0.<br />Type <span class='term-cmd-highlight'>help</span> to list commands, <span class='term-cmd-highlight'>skills</span>, <span class='term-cmd-highlight'>projects</span>, or <span class='term-cmd-highlight'>clear</span>.",
    cli_placeholder: "Type a command (e.g., 'help', 'skills', 'projects')...",
    cli_cmds_label: 'Commands:',

    // Section 6 - Contact
    contact_subtitle: '06 // Get In Touch',
    contact_title: "Let's Build Something Together",
    contact_desc: "Have a web project idea, want to collaborate, or just want to say hi? I'd love to connect!",
    contact_channels: 'Direct Channels',
    contact_label_email: 'Email',
    contact_label_location: 'Location',
    contact_label_tz: 'Timezone',
    contact_val_tz: 'WIB (UTC+7)',
    form_name_label: 'Your Name',
    form_email_label: 'Email Address',
    form_subject_label: 'Subject / Topic',
    form_msg_label: 'Message',
    form_name_ph: 'Jane Doe',
    form_email_ph: 'jane@example.com',
    form_subject_ph: 'Architecture review, contract, full-time...',
    form_msg_ph: 'Tell me about your project, timeline, and goals...',
    form_send: 'Send Message',
    form_sending: 'Transmitting packet...',
    form_success: '✓ Message received! Maxiemillian will respond within 24 hours.',

    // Footer
    footer_text: 'Crafted with restraint and clarity.',
    footer_tech: 'Pure HTML5, CSS3, & Modern Vanilla JS.',
    back_to_top: 'Back to Top',

    // Toasts
    toast_copied: 'Email address copied to clipboard.',
    toast_sent: 'Message sent successfully.',
    toast_lang: 'Language switched to English.'
  },

  id: {
    // Nav
    nav_about: 'Tentang Saya',
    nav_graph: 'Graf Node',
    nav_stack: 'Teknologi',
    nav_works: 'Portofolio',
    nav_journey: 'Pendidikan',
    nav_cli: 'Terminal CLI',
    nav_contact: 'Hubungi Saya',

    // Sound
    sound_off: 'Suara: MATI',
    sound_on: 'Suara: HIDUP',

    // Hero
    hero_badge: 'Terbuka untuk Proyek Web & Kolaborasi',
    hero_role_title: 'Web Developer & Mahasiswa',
    hero_building: 'Membangun',
    hero_bio: 'Mahasiswa jurusan Sistem Informasi di Indonesia yang bersemangat dalam pengembangan web. Membangun aplikasi berbasis data yang fungsional dengan backend PHP dan tampilan antarmuka yang bersih serta modern.',
    hero_cta_projects: 'Lihat Karya Pilihan',
    hero_cta_cli: 'Buka Terminal CLI',
    hero_cta_contact: 'Kontak Langsung',
    stat_repos: 'Repositori',
    stat_stack: 'Bidang Keahlian',
    stat_passion: 'Dedikasi Kode',
    scroll_down: 'Gulir ke Bawah',

    // Topology
    topo_title: 'GRAF KEAHLIAN // WEB DEV STACK',
    topo_hint: 'Klik & Tarik Node - Fisika Orbit',
    topo_core: 'Keahlian Inti',
    topo_domains: '5 Domain',
    topo_focus_lbl: 'Fokus',
    topo_focus_val: 'Dev Web',
    topo_status_lbl: 'Status',
    topo_status_val: 'Mahasiswa',
    topo_btn: 'Pulsa Keahlian',

    // Section 1 - About
    about_subtitle: '01 // Tentang Saya',
    about_title: 'Menulis kode dengan tujuan. Membangun dengan kejelasan.',
    about_desc: 'Seorang web developer dan mahasiswa asal Indonesia yang bersemangat membangun aplikasi web berbasis data yang fungsional.',
    about_lead: 'Saya Maxiemillian Davin Airell, mahasiswa Sistem Informasi dari Indonesia yang memiliki minat mendalam pada pengembangan web dan membangun sistem yang benar-benar berfungsi.',
    about_body: 'Saya berspesialisasi dalam mengintegrasikan sistem backend (PHP, MySQL) dengan antarmuka frontend yang modern dan rapi. Saat ini sedang memperluas keahlian ke full-stack development dengan Laravel, sekaligus menjelajahi perpaduan kode bersih dan desain yang baik.',
    val1_title: 'Pengembangan Web Full-Stack',
    val1_desc: 'Membangun aplikasi fungsional berbasis data dengan backend PHP dan frontend CSS yang rapi.',
    val2_title: 'Aplikasi Berbasis Basis Data',
    val2_desc: 'Merancang dan membuat kueri basis data MySQL untuk mendukung aplikasi web yang andal.',
    val3_title: 'Selalu Belajar',
    val3_desc: 'Saat ini mendalami Laravel dan mempelajari framework web modern untuk meningkatkan kemampuan teknis.',
    matrix_title: 'PROFIL PENGEMBANG',
    m_focus_key: 'Fokus Utama',
    m_focus_val: 'Pengembangan Web & Sistem Informasi',
    m_stack_key: 'Stack Utama',
    m_avail_key: 'Ketersediaan',
    m_avail_val: 'Terbuka untuk proyek pemula & kolaborasi',
    m_loc_key: 'Lokasi',
    m_loc_val: 'Indonesia',
    m_learn_key: 'Sedang Dipelajari',
    m_learn_val: 'Framework Laravel',
    next_maxim: 'Kutipan Berikutnya',

    // Section 2 - Skills
    skills_subtitle: '02 // Stack & Alat',
    skills_title: 'Teknologi yang Saya Gunakan',
    skills_desc: 'Alat dan bahasa pemrograman yang rutin saya gunakan untuk perkuliahan, proyek pribadi, dan aplikasi web berbasis data.',
    filter_all: 'Semua Stack',
    filter_backend: 'Sistem & Backend',
    filter_frontend: 'Frontend & Desain',
    filter_cloud: 'Cloud & CI/CD',
    filter_data: 'Basis Data & Penyimpanan',
    skill_php_desc: 'Scripting server-side, pemrosesan form, manajemen sesi, dan logika backend aplikasi web',
    skill_laravel_desc: 'Mendalami Laravel — arsitektur MVC, Eloquent ORM, dan Blade templating',
    skill_html_desc: 'Markup semantik, layout responsif, desain CSS rapi, dan pola UI modern',
    skill_js_desc: 'Manipulasi DOM, event handling, fetch API, dan komponen antarmuka pengguna interaktif',
    skill_mysql_desc: 'Desain basis data relasional, kueri SQL, relasi join, dan manajemen data untuk web',
    skill_git_desc: 'Version control, manajemen repositori, dan otomatisasi CI/CD dasar dengan GitHub Actions',

    // Section 3 - Projects
    projects_subtitle: '03 // Proyek',
    projects_title: 'Proyek yang Telah Saya Bangun',
    projects_desc: 'Proyek pribadi dan perkuliahan yang memperlihatkan antusiasme saya dalam web development, desain bersih, dan aplikasi berbasis data.',
    p1_tag: 'Sistem Kasir & Pemesanan Restoran',
    p1_summary: 'Sistem pemesanan makanan, inventaris, dan pemrosesan pembayaran lengkap yang dibuat untuk "Dapur Ina Aina". Dibangun menggunakan PHP (PDO) dan MySQL/MariaDB untuk mengelola pesanan meja, memantau stok bahan, serta mencetak struk dengan opsi pembayaran tunai maupun non-tunai.',
    p1_hl1: 'PHP modular dengan keamanan PDO & basis data MariaDB/MySQL yang dinormalisasi',
    p1_hl2: 'Penagihan multi-metode (Tunai / QRIS), struk belanja, dan pemantauan stok langsung',
    p2_tag: 'Portofolio & Proyek Pribadi',
    p2_title: 'Portofolio Ini // Showcase Interaktif Developer',
    p2_summary: 'Website portofolio pribadi yang dibangun murni dengan HTML, CSS, dan Vanilla JavaScript tanpa framework. Dilengkapi latar kanvas bergerak, graf keahlian 3D interaktif, terminal CLI developer, dan animasi gulir yang mulus.',
    p2_hl1: 'Kanvas topologi 3D interaktif dengan simulasi fisika',
    p2_hl2: 'Terminal CLI dengan perintah fungsional langsung',
    p3_tag: 'Platform Web Full-Stack // Hiburan',
    p3_title: 'K-List // Rating & Daftar Tontonan Drama Korea',
    p3_summary: 'Aplikasi web full-stack modern untuk menjelajah, mencatat, dan memberi rating drama Korea. Dibangun dengan UI responsif dan terintegrasi dengan Supabase untuk autentikasi pengguna, basis data cloud PostgreSQL, penyimpanan media, serta deployment instan di Vercel.',
    p3_hl1: 'Integrasi backend Supabase (Autentikasi, PostgreSQL DB & Storage)',
    p3_hl2: 'Rating komunitas interaktif, ulasan & daftar pantauan kustom',
    btn_details: 'Detail Proyek',
    btn_repo: 'Repositori',
    btn_demo: 'Demo Langsung',

    // Section 4 - Experience
    exp_subtitle: '04 // Pendidikan & Perjalanan',
    exp_title: 'Jejak Pembelajaran Saya',
    exp1_period: '2022 - Sekarang',
    exp1_inst: 'Universitas Gunadarma',
    exp1_role: 'Sarjana - Sistem Informasi',
    exp1_desc: 'Saat ini sedang menempuh pendidikan sarjana Sistem Informasi di Indonesia, dengan fokus pada Web Development. Mempelajari sistem backend, pengelolaan basis data, dan mengintegrasikan logika server dengan antarmuka modern.',
    exp2_period: '2023 - Sekarang',
    exp2_inst: 'Belajar Mandiri',
    exp2_role: 'Pengembangan Web Full-Stack',
    exp2_desc: 'Memperluas portofolio dengan proyek full-stack menggunakan PHP untuk backend, CSS bersih untuk frontend, dan mulai mengeksplorasi Laravel sebagai framework modern untuk aplikasi yang lebih skalabel.',
    exp3_period: '2024 - Sekarang',
    exp3_inst: 'Open Source & Komunitas',
    exp3_role: 'Terbuka untuk Kolaborasi',
    exp3_desc: 'Tertarik berkolaborasi pada proyek web untuk pemula dan berkontribusi dalam dokumentasi. Bersemangat membangun aplikasi yang bermanfaat dan berkembang bersama komunitas.',

    // Section 5 - Terminal
    cli_subtitle: '05 // Konsol Interaktif',
    cli_title: 'Terminal Pengembang',
    cli_desc: "Ketik <code class='inline-code'>help</code> untuk diagnosa, melihat ringkasan keahlian, atau membuka jalur kontak.",
    cli_welcome: "Maxiemillian (alvenath) Interactive Shell v1.0.<br />Ketik <span class='term-cmd-highlight'>help</span> untuk daftar perintah, <span class='term-cmd-highlight'>skills</span>, <span class='term-cmd-highlight'>projects</span>, atau <span class='term-cmd-highlight'>clear</span>.",
    cli_placeholder: "Ketik perintah (contoh: 'help', 'skills', 'projects')...",
    cli_cmds_label: 'Perintah:',

    // Section 6 - Contact
    contact_subtitle: '06 // Kontak',
    contact_title: 'Mari Berkolaborasi',
    contact_desc: 'Punya ide proyek web, ingin berkolaborasi, atau sekadar menyapa? Saya siap terhubung!',
    contact_channels: 'Saluran Langsung',
    contact_label_email: 'Email',
    contact_label_location: 'Lokasi',
    contact_label_tz: 'Zona Waktu',
    contact_val_tz: 'WIB (UTC+7)',
    form_name_label: 'Nama Lengkap',
    form_email_label: 'Alamat Email',
    form_subject_label: 'Subjek / Topik',
    form_msg_label: 'Pesan',
    form_name_ph: 'Nama Anda',
    form_email_ph: 'email@contoh.com',
    form_subject_ph: 'Proyek web, kolaborasi, pertanyaan...',
    form_msg_ph: 'Ceritakan tentang ide proyek, linimasa, dan kebutuhan Anda...',
    form_send: 'Kirim Pesan',
    form_sending: 'Mengirimkan pesan...',
    form_success: '✓ Pesan terkirim! Maxiemillian akan merespons dalam 24 jam.',

    // Footer
    footer_text: 'Dibuat dengan ketelitian dan kejelasan.',
    footer_tech: 'Murni HTML5, CSS3, & Modern Vanilla JS.',
    back_to_top: 'Kembali ke Atas',

    // Toasts
    toast_copied: 'Alamat email berhasil disalin ke papan klip.',
    toast_sent: 'Pesan berhasil dikirim.',
    toast_lang: 'Bahasa diubah ke Bahasa Indonesia.'
  }
};

function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;

  // Text content & innerHTML updates
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (key === 'cli_welcome' || key === 'cli_desc' || key === 'p1_hl1' || key === 'p1_hl2' || key === 'p2_hl1' || key === 'p2_hl2' || key === 'p3_hl1' || key === 'p3_hl2') {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Placeholder updates
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update Sound pill text
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    const soundSpan = soundToggle.querySelector('span');
    if (soundSpan) {
      soundSpan.textContent = soundEnabled ? dict.sound_on : dict.sound_off;
    }
  }

  // Update language toggle button visual
  const langEn = document.getElementById('langEn');
  const langId = document.getElementById('langId');
  if (langEn && langId) {
    langEn.classList.toggle('active', lang === 'en');
    langId.classList.toggle('active', lang === 'id');
  }

  // Update dynamic modules
  if (typeof resetTypewriterLang === 'function') resetTypewriterLang();
  if (typeof updateQuoteLang === 'function') updateQuoteLang();
  if (typeof updateTerminalLang === 'function') updateTerminalLang();
}

function initLanguageSwitcher() {
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'id' : 'en';
      localStorage.setItem('portfolio_lang', currentLang);
      applyTranslations(currentLang);
      const dict = translations[currentLang] || translations.en;
      showToast(dict.toast_lang);
      playUiSound('click');
    });
  }

  // Apply saved language on initial load
  applyTranslations(currentLang);
}

/* ==========================================================================
   16. NODE GRAPH NAVIGATION & INTERACTION
   ========================================================================== */
function initNodeGraphNavigation() {
  const target = document.getElementById('topologyContainer');
  if (!target) return;

  function focusNodeGraph() {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.remove('highlight-pulse');
    void target.offsetWidth; // Force CSS repaint
    target.classList.add('highlight-pulse');

    const burstBtn = document.getElementById('burstPacketsBtn');
    if (burstBtn) {
      burstBtn.click();
    }
  }

  // Handle all links pointing to topologyContainer or architecture
  const graphLinks = document.querySelectorAll('a[href="#topologyContainer"], a[href="#architecture"], #navNodeGraph');
  graphLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      focusNodeGraph();
      history.pushState(null, null, '#topologyContainer');
    });
  });

  // Check URL hash on initial load
  if (window.location.hash === '#topologyContainer' || window.location.hash === '#architecture') {
    setTimeout(focusNodeGraph, 400);
  }
}

