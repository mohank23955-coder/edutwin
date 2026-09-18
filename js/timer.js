/* ==========================================================
   EduTwin - Focus Studio & Pomodoro Timer Module
   Integrated Pomodoro timer with HTML5 Web Audio Ambient Sound Generator
   ========================================================== */

const TimerManager = {
  modes: {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  },

  currentMode: 'pomodoro',
  timeLeft: 25 * 60,
  totalTime: 25 * 60,
  isRunning: false,
  timerInterval: null,

  // Web Audio Context & Synthesizers
  audioCtx: null,
  activeAmbientSource: null,
  activeAmbientGain: null,
  currentAmbientSound: 'none',

  init() {
    this.setupCircleMetrics();
    this.renderDisplay();
    this.setupEventListeners();
  },

  setupCircleMetrics() {
    const circle = document.getElementById('timerProgressCircle');
    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = '0';
    }
  },

  setMode(mode) {
    this.pause();
    this.currentMode = mode;
    this.totalTime = this.modes[mode];
    this.timeLeft = this.totalTime;

    const phaseLabels = {
      pomodoro: 'Deep Focus Block',
      shortBreak: 'Short Rest & Hydrate',
      longBreak: 'Extended Restoration Break'
    };

    const labelElem = document.getElementById('timerPhaseText');
    if (labelElem) labelElem.textContent = phaseLabels[mode];

    // Update active pill
    document.querySelectorAll('.mode-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-mode') === mode);
    });

    this.renderDisplay();
  },

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Initialize audio context on first user gesture
    this.getAudioContext();
    if (this.currentAmbientSound !== 'none') {
      this.playAmbientSound(this.currentAmbientSound);
    }

    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);

    this.updateControlsUI();
  },

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;

    this.stopAmbientSound();
    this.updateControlsUI();
  },

  reset() {
    this.pause();
    this.timeLeft = this.totalTime;
    this.renderDisplay();
  },

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.renderDisplay();
    } else {
      this.onComplete();
    }
  },

  onComplete() {
    this.pause();
    this.playChime();

    if (this.currentMode === 'pomodoro') {
      showToast('🎉 Focus session completed! +25 mins logged to your study goal.', 'success');
      
      // Auto-log time to progress manager
      if (window.ProgressManager) {
        ProgressManager.logStudyHours(0.42); // ~25 mins
      }

      // Check if linked to a task
      const linkedTaskElem = document.getElementById('timerLinkedTask');
      if (linkedTaskElem && linkedTaskElem.value !== 'none') {
        const taskId = linkedTaskElem.value;
        if (window.StudyPlanManager) {
          StudyPlanManager.toggleTask(taskId, true);
        }
      }

      // Switch to short break recommendation
      this.setMode('shortBreak');
    } else {
      showToast('☕ Break completed! Ready to begin your next focus block?', 'info');
      this.setMode('pomodoro');
    }
  },

  renderDisplay() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Update Big Studio display
    const studioDisplay = document.getElementById('studioTimerDigits');
    if (studioDisplay) studioDisplay.textContent = formatted;

    // Update Mini dashboard display
    const miniDisplay = document.getElementById('miniTimerDigits');
    if (miniDisplay) miniDisplay.textContent = formatted;

    // Update SVG Circle stroke
    const circle = document.getElementById('timerProgressCircle');
    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const progressRatio = (this.totalTime - this.timeLeft) / this.totalTime;
      const offset = circumference - (progressRatio * circumference);
      circle.style.strokeDashoffset = offset;
    }
  },

  updateControlsUI() {
    const playBtn = document.getElementById('btnStudioPlayPause');
    const playIcon = document.getElementById('playIcon');
    const miniPlay = document.getElementById('btnMiniTimerPlay');

    if (this.isRunning) {
      if (playIcon) playIcon.textContent = '⏸ Pause';
      if (playBtn) playBtn.classList.replace('btn-primary', 'btn-outline');
      if (miniPlay) {
        miniPlay.textContent = 'Pause';
        miniPlay.classList.replace('btn-primary', 'btn-outline');
      }
    } else {
      if (playIcon) playIcon.textContent = '▶ Start Session';
      if (playBtn) playBtn.classList.replace('btn-outline', 'btn-primary');
      if (miniPlay) {
        miniPlay.textContent = 'Start Focus';
        miniPlay.classList.replace('btn-outline', 'btn-primary');
      }
    }
  },

  // ==========================================
  // Web Audio API Sound Generation (Pure in-browser)
  // ==========================================
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  },

  playChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High-grade two-tone pleasant completion bell
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3); // D6

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 1.8);
      osc2.stop(now + 1.8);
    } catch (e) {
      console.warn('Audio chime notice:', e);
    }
  },

  playAmbientSound(type) {
    this.stopAmbientSound();
    this.currentAmbientSound = type;

    if (type === 'none') return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      // Create noise buffer (3 seconds looped)
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      if (type === 'rain') {
        // Soft low-pass pink-ish rain filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      } else if (type === 'whitenoise') {
        // Calm bandpass ocean / gentle wind
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      } else if (type === 'binaural') {
        // 432Hz Zen Hum oscillator
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(136.1, ctx.currentTime); // Om frequency
        osc.connect(gainNode);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.connect(ctx.destination);
        osc.start();
        this.activeAmbientSource = osc;
        this.activeAmbientGain = gainNode;
        return;
      }

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start();
      this.activeAmbientSource = whiteNoise;
      this.activeAmbientGain = gainNode;
    } catch (err) {
      console.warn('Ambient sound notice:', err);
    }
  },

  stopAmbientSound() {
    if (this.activeAmbientSource) {
      try {
        this.activeAmbientSource.stop();
        this.activeAmbientSource.disconnect();
      } catch (e) {}
      this.activeAmbientSource = null;
    }
  },

  setupEventListeners() {
    // Mode selector pills
    document.querySelectorAll('.mode-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const mode = e.target.getAttribute('data-mode');
        this.setMode(mode);
      });
    });

    // Studio Play/Pause
    const btnPlay = document.getElementById('btnStudioPlayPause');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (this.isRunning) this.pause();
        else this.start();
      });
    }

    // Studio Reset
    const btnReset = document.getElementById('btnStudioReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.reset());
    }

    // Mini timer play / reset
    const miniPlay = document.getElementById('btnMiniTimerPlay');
    if (miniPlay) {
      miniPlay.addEventListener('click', () => {
        if (this.isRunning) this.pause();
        else this.start();
      });
    }

    const miniReset = document.getElementById('btnMiniTimerReset');
    if (miniReset) {
      miniReset.addEventListener('click', () => this.reset());
    }

    // Ambient sound buttons
    document.querySelectorAll('.sound-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.sound-toggle').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const sound = e.currentTarget.getAttribute('data-sound');
        this.currentAmbientSound = sound;
        if (this.isRunning) {
          this.playAmbientSound(sound);
        } else if (sound !== 'none') {
          showToast(`Sound "${sound}" will activate when session starts!`, 'info');
        }
      });
    });
  }
};
