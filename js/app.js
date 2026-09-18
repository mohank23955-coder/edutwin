/* ==========================================================
   EduTwin - Main Application Controller
   Coordinates routing, flashcards engine, toast notifications & lifecycle
   ========================================================== */

// Global Toast System
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
};

// Flashcards Engine
const FlashcardsManager = {
  deck: [
    {
      id: 1,
      subject: 'Unit 8 & 9 (TN)',
      question: 'Who was the first woman freedom fighter to take up arms against the British East India Company?',
      answer: 'Rani Velu Nachiyar (Sivagangai, 1780)',
      explanation: 'Veeramangai Velu Nachiyar formed an alliance with Hyder Ali and Gopala Nayakar to defeat the British forces and reclaim her kingdom in 1780, decades before the 1857 Revolt.'
    },
    {
      id: 2,
      subject: 'Unit 8 & 9 (TN)',
      question: 'Complete the Thirukkural: "அன்பிலார் எல்லாம் தமக்குரியர் அன்புடையார்..."',
      answer: 'என்பும் உரியர் பிறர்க்கு (Kural 72)',
      explanation: 'Meaning: The unloving keep everything for themselves; the loving yield even their very bones and bodies for others. Frequently asked in TNPSC Unit 8 & General Tamil.'
    },
    {
      id: 3,
      subject: 'Unit 8 & 9 (TN)',
      question: 'Which Tamil Nadu scheme provides ₹1,000 monthly financial aid to girl students entering government higher education?',
      answer: 'Pudhumai Penn Scheme (Moovalur Ramamirtham Higher Education Assurance)',
      explanation: 'Flagship TN welfare scheme under Unit 9 to boost collegiate enrollment of government school girls and prevent child marriages.'
    },
    {
      id: 4,
      subject: 'Indian Polity',
      question: 'Which Article was described by Dr. B.R. Ambedkar as the "Heart and Soul" of the Indian Constitution?',
      answer: 'Article 32 — Right to Constitutional Remedies',
      explanation: 'Article 32 empowers citizens to petition the Supreme Court directly for the enforcement of Fundamental Rights via writs (Habeas Corpus, Mandamus, Quo-Warranto, Certiorari, Prohibition).'
    },
    {
      id: 5,
      subject: 'Indian Polity',
      question: 'Which Constitutional Amendment Act added "Socialist, Secular, and Integrity" into the Preamble?',
      answer: '42nd Constitutional Amendment Act, 1976',
      explanation: 'Known as the "Mini-Constitution", it enacted the only amendment to the Preamble to date and introduced Fundamental Duties (Article 51A).'
    },
    {
      id: 6,
      subject: 'RRB Railway GK',
      question: 'When and between which stations did the first passenger train run in India?',
      answer: 'April 16, 1853 — Bombay (Bori Bunder) to Thane (34 km)',
      explanation: 'Operated by the Great Indian Peninsula Railway with 3 steam engines (Sahib, Sindh, Sultan) carrying 400 passengers across 14 carriages.'
    },
    {
      id: 7,
      subject: 'RRB Railway GK',
      question: 'How many Railway Zones exist in India, and where is the Southern Railway headquartered?',
      answer: '18 Zones; Southern Railway is headquartered in Chennai, Tamil Nadu',
      explanation: 'The newest 18th railway zone is South Coast Railway (SCoR) at Visakhapatnam. Southern Railway was established on April 14, 1951.'
    },
    {
      id: 8,
      subject: 'Aptitude & Math',
      question: 'What is the speed shortcut for the difference between Compound Interest (CI) and Simple Interest (SI) for 2 years?',
      answer: 'Difference = P × (R / 100)²',
      explanation: 'Crucial shortcut for RRB NTPC & TNPSC math. For 3 years: Difference = P × (R/100)² × (3 + R/100).'
    },
    {
      id: 9,
      subject: 'Aptitude & Math',
      question: 'If A finishes a job in 12 days and B finishes in 18 days, how many days will they take working together?',
      answer: '7.2 days (7 days and 4.8 hours)',
      explanation: 'Shortcut: (A × B) / (A + B) = (12 × 18) / (12 + 18) = 216 / 30 = 7.2 days.'
    },
    {
      id: 10,
      subject: 'General Science',
      question: 'What is the normal pH range of human blood, and what maintains it?',
      answer: '7.35 to 7.45 (Slightly Alkaline); Carbonic Acid - Bicarbonate Buffer',
      explanation: 'A staple Samacheer Kalvi 10th Science & NCERT question tested repeatedly in TNPSC Group 4 and RRB NTPC General Science.'
    }
  ],

  currentIndex: 0,
  activeFilter: 'all',
  isFlipped: false,

  init() {
    this.render();
    this.renderMiniPreview();
    this.setupEventListeners();
  },

  getFilteredDeck() {
    if (this.activeFilter === 'all') return this.deck;
    return this.deck.filter(c => c.subject.toLowerCase() === this.activeFilter.toLowerCase());
  },

  render() {
    const filtered = this.getFilteredDeck();
    if (filtered.length === 0) return;

    if (this.currentIndex >= filtered.length) {
      this.currentIndex = 0;
    }

    const card = filtered[this.currentIndex];
    const container = document.getElementById('flashcardElement');

    if (container) {
      container.classList.remove('flipped');
      this.isFlipped = false;
    }

    const subjectTag = document.getElementById('fcSubjectTag');
    if (subjectTag) subjectTag.textContent = card.subject;

    const counter = document.getElementById('fcCounter');
    if (counter) counter.textContent = `Card ${this.currentIndex + 1} / ${filtered.length}`;

    const qElem = document.getElementById('fcQuestion');
    if (qElem) qElem.textContent = card.question;

    const aElem = document.getElementById('fcAnswer');
    if (aElem) aElem.textContent = card.answer;

    const expElem = document.getElementById('fcExplanation');
    if (expElem) expElem.textContent = card.explanation;
  },

  renderMiniPreview() {
    const card = this.deck[0];
    const miniSub = document.getElementById('miniCardSubject');
    const miniQ = document.getElementById('miniCardQuestion');

    if (miniSub) miniSub.textContent = card.subject;
    if (miniQ) miniQ.textContent = card.question;
  },

  toggleFlip() {
    const container = document.getElementById('flashcardElement');
    if (container) {
      this.isFlipped = !this.isFlipped;
      container.classList.toggle('flipped', this.isFlipped);
    }
  },

  nextCard() {
    const filtered = this.getFilteredDeck();
    this.currentIndex = (this.currentIndex + 1) % filtered.length;
    this.render();
  },

  prevCard() {
    const filtered = this.getFilteredDeck();
    this.currentIndex = (this.currentIndex - 1 + filtered.length) % filtered.length;
    this.render();
  },

  evaluate(quality) {
    const currentCard = this.getFilteredDeck()[this.currentIndex];
    
    if (quality === 'easy') {
      if (window.ProgressManager) {
        ProgressManager.boostSubjectMastery(currentCard.subject, 4);
      }
      showToast(`⭐ "${currentCard.subject}" mastered! +4% Subject Mastery.`, 'success');
    } else if (quality === 'good') {
      if (window.ProgressManager) {
        ProgressManager.boostSubjectMastery(currentCard.subject, 2);
      }
      showToast(`Good recall! Reinforced in memory.`, 'info');
    } else {
      showToast(`Flagged for priority review session.`, 'info');
    }

    this.nextCard();
  },

  setupEventListeners() {
    const cardElem = document.getElementById('flashcardElement');
    if (cardElem) {
      cardElem.addEventListener('click', () => this.toggleFlip());
    }

    const btnNext = document.getElementById('btnFcNext');
    if (btnNext) btnNext.addEventListener('click', () => this.nextCard());

    const btnPrev = document.getElementById('btnFcPrev');
    if (btnPrev) btnPrev.addEventListener('click', () => this.prevCard());

    const btnAgain = document.getElementById('btnFcAgain');
    if (btnAgain) btnAgain.addEventListener('click', () => this.evaluate('hard'));

    const btnGood = document.getElementById('btnFcGood');
    if (btnGood) btnGood.addEventListener('click', () => this.evaluate('good'));

    const btnEasy = document.getElementById('btnFcEasy');
    if (btnEasy) btnEasy.addEventListener('click', () => this.evaluate('easy'));

    // Filter buttons
    document.querySelectorAll('.deck-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.deck-filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeFilter = e.currentTarget.getAttribute('data-subject');
        this.currentIndex = 0;
        this.render();
      });
    });

    // Dashboard mini card
    const miniCard = document.getElementById('miniFlashCard');
    if (miniCard) {
      let miniFlipped = false;
      miniCard.addEventListener('click', () => {
        const filtered = this.getFilteredDeck();
        const card = filtered[this.currentIndex];
        miniFlipped = !miniFlipped;
        if (miniFlipped) {
          document.getElementById('miniCardQuestion').textContent = card.answer;
          document.querySelector('.flashcard-hint-text').textContent = 'Answer shown. Click again for question.';
        } else {
          document.getElementById('miniCardQuestion').textContent = card.question;
          document.querySelector('.flashcard-hint-text').textContent = 'Click card to reveal answer';
        }
      });
    }

    const btnMiniNext = document.getElementById('btnMiniCardNext');
    if (btnMiniNext) {
      btnMiniNext.addEventListener('click', () => {
        this.nextCard();
        const card = this.getFilteredDeck()[this.currentIndex];
        document.getElementById('miniCardSubject').textContent = card.subject;
        document.getElementById('miniCardQuestion').textContent = card.question;
        document.querySelector('.flashcard-hint-text').textContent = 'Click card to reveal answer';
      });
    }

    const btnMiniMaster = document.getElementById('btnMiniCardMaster');
    if (btnMiniMaster) {
      btnMiniMaster.addEventListener('click', () => {
        this.evaluate('easy');
        const card = this.getFilteredDeck()[this.currentIndex];
        document.getElementById('miniCardSubject').textContent = card.subject;
        document.getElementById('miniCardQuestion').textContent = card.question;
      });
    }
  }
};

// Navigation View Switcher
const NavigationManager = {
  init() {
    const navButtons = document.querySelectorAll('#mainNav .nav-btn');
    const viewPanels = document.querySelectorAll('.view-panel');

    const switchView = (targetId) => {
      viewPanels.forEach(panel => {
        panel.classList.toggle('active-view', panel.id === targetId);
      });

      navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === targetId);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        switchView(target);
      });
    });

    // Support quick-switch buttons (e.g. data-switch="focusView")
    document.querySelectorAll('[data-switch]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-switch');
        switchView(target);
      });
    });
  }
};

// Modals Master Controller
const ModalManager = {
  init() {
    const planModal = document.getElementById('planModal');
    const btnOpenPlan = document.getElementById('btnOpenPlanModal');
    const btnClosePlan = document.getElementById('btnClosePlanModal');
    const btnCancelPlan = document.getElementById('btnCancelPlanModal');

    if (btnOpenPlan && planModal) {
      btnOpenPlan.addEventListener('click', () => planModal.classList.add('active'));
    }

    if (btnClosePlan && planModal) {
      btnClosePlan.addEventListener('click', () => planModal.classList.remove('active'));
    }

    if (btnCancelPlan && planModal) {
      btnCancelPlan.addEventListener('click', () => planModal.classList.remove('active'));
    }

    // Close on overlay backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  }
};

// Application Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  // Set default date picker to 18 days in future if empty
  const dateInput = document.getElementById('inputExamDate');
  if (dateInput && !dateInput.value) {
    const futureDate = new Date(Date.now() + 18 * 24 * 60 * 60 * 1000);
    dateInput.value = futureDate.toISOString().split('T')[0];
  }

  // Initialize all subsystems
  TimerManager.init();
  StreakManager.init();
  StudyPlanManager.init();
  ProgressManager.init();
  FlashcardsManager.init();
  TwinAdvisor.init();
  NavigationManager.init();
  ModalManager.init();

  console.log('🚀 EduTwin initialized successfully with full interactivity and light theme.');
});
