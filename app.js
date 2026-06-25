/*
 * Noah - Mobile First Gen Z Bible Website
 * Custom JavaScript (Interactions & Local State)
 */

document.addEventListener('DOMContentLoaded', () => {
  const isMoses = document.body.classList.contains('theme-moses');
  const dbPrefix = isMoses ? 'moses' : 'noah';

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out-cubic',
      once: true,
      mirror: false,
    });
  }

  // --- Glassmorphism Navbar Scroll Effect ---
  const navbar = document.querySelector('.nav-glass');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle Icon (Hamburger to X) ---
  const navbarCollapse = document.getElementById('navbarNav');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const togglerIcon = navbarToggler ? navbarToggler.querySelector('i') : null;

  if (navbarCollapse && togglerIcon) {
    navbarCollapse.addEventListener('show.bs.collapse', () => {
      togglerIcon.classList.remove('fa-bars');
      togglerIcon.classList.add('fa-xmark');
    });

    navbarCollapse.addEventListener('hide.bs.collapse', () => {
      togglerIcon.classList.remove('fa-xmark');
      togglerIcon.classList.add('fa-bars');
    });
  }

  // --- Dynamic Timeline Progress Filler ---
  const timelineContainer = document.querySelector('.timeline-container');
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const timelineLineFilled = document.querySelector('.timeline-line-filled');

  if (timelineContainer && timelineLineFilled) {
    window.addEventListener('scroll', () => {
      const containerRect = timelineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through the timeline container
      const startTrigger = containerRect.top - windowHeight / 2;
      const totalHeight = containerRect.height;
      let progress = 0;

      if (startTrigger < 0) {
        progress = Math.min(100, Math.max(0, (-startTrigger / totalHeight) * 100));
      }
      
      // Update custom progress bar line height
      timelineLineFilled.style.height = `${progress}%`;

      // Highlight active node depending on viewport position
      timelineSteps.forEach(step => {
        const stepRect = step.getBoundingClientRect();
        // If step is above the middle of the screen
        if (stepRect.top < windowHeight * 0.6) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    });
  }


  // --- The Noah Challenge Pledge (Confetti Burst) ---
  const challengeBtn = document.getElementById('challenge-btn');
  const challengeStatus = document.getElementById('challenge-status');

  // Load challenge state
  if (challengeBtn) {
    const hasPledged = localStorage.getItem(`${dbPrefix}_challenge_pledged`) === 'true';
    if (hasPledged) {
      setChallengePledged(false); // Restore state silently on load
    }

    challengeBtn.addEventListener('click', () => {
      localStorage.setItem(`${dbPrefix}_challenge_pledged`, 'true');
      setChallengePledged(true); // Trigger with animations & confetti!
    });
  }

  function setChallengePledged(triggerConfetti = true) {
    if (challengeBtn && challengeStatus) {
      challengeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Pledge Accepted';
      challengeBtn.disabled = true;
      challengeBtn.style.opacity = '0.8';
      challengeStatus.classList.add('show');

      if (triggerConfetti && typeof confetti === 'function') {
        // Trigger sweet confetti pop!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#FF6B6B', '#FF8E53', '#FFD200', '#4CD964', '#5AC8FA', '#5856D6']
        });
      }
    }
  }

  // --- A Simple Prayer Section (Amen & Floating Hearts) ---
  const prayerBtn = document.getElementById('prayer-btn');
  const prayerStatus = document.getElementById('prayer-status');
  const prayerCard = document.querySelector('.prayer-card');

  if (prayerBtn && prayerCard) {
    prayerBtn.addEventListener('click', (e) => {
      // Show Amen feedback message
      if (prayerStatus) {
        prayerStatus.classList.add('show');
        setTimeout(() => {
          prayerStatus.classList.remove('show');
        }, 4000);
      }

      // Generate floating hearts around the button/card
      const numHearts = 6;
      for (let i = 0; i < numHearts; i++) {
        createFloatingHeart(e.clientX, e.clientY);
      }
    });
  }

  function createFloatingHeart(clickX, clickY) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    
    // Choose premium Font Awesome icons styled with beautiful colors
    const icons = isMoses ? [
      '<i class="fa-solid fa-fire" style="color: #FF9500;"></i>',           // Burning Bush Fire
      '<i class="fa-solid fa-water" style="color: #007AFF;"></i>',          // Red Sea Water
      '<i class="fa-solid fa-hands-praying" style="color: #5856D6;"></i>',  // Prayer
      '<i class="fa-solid fa-scroll" style="color: #FFCC00;"></i>',         // Commandments
      '<i class="fa-solid fa-wand-magic-sparkles" style="color: #FF2D55;"></i>' // Wonder Staff
    ] : [
      '<i class="fa-solid fa-heart" style="color: #FF2D55;"></i>',          // Apple Red
      '<i class="fa-solid fa-rainbow" style="color: #5AC8FA;"></i>',        // Apple Light Blue
      '<i class="fa-solid fa-hands-praying" style="color: #5856D6;"></i>',  // Apple Purple
      '<i class="fa-solid fa-star" style="color: #FFCC00;"></i>',           // Apple Gold
      '<i class="fa-solid fa-dove" style="color: #34C759;"></i>'            // Apple Green
    ];
    heart.innerHTML = icons[Math.floor(Math.random() * icons.length)];
    
    // Calculate click coordinates relative to body
    const bodyRect = document.body.getBoundingClientRect();
    const x = clickX - bodyRect.left;
    const y = clickY - bodyRect.top;

    // Apply starting coordinates and random horizontal drift
    heart.style.left = `${x + (Math.random() * 60 - 30)}px`;
    heart.style.top = `${y - 10}px`;
    
    // Add random duration and scale
    const duration = 1.5 + Math.random() * 1.5;
    heart.style.animationDuration = `${duration}s`;
    
    const scale = 0.6 + Math.random() * 0.8;
    heart.style.transform = `scale(${scale})`;

    document.body.appendChild(heart);

    // Remove element after animation finishes
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  // --- Character List Extensibility Info Trigger ---
  const lockedChars = document.querySelectorAll('.dropdown-item-apple.disabled-char');
  lockedChars.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const charName = item.querySelector('span:first-child').innerText;
      alert(`${charName} is currently locked. We are preparing to roll out more Bible character stories and challenges soon!`);
    });
  });
});

// --- Preloader Dismissal ---
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 800);
  }
});
