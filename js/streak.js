/* ==========================================================
   EduTwin - Streak Maintenance Module
   Manages streak count, daily check-in, 7-day history, streak shields & milestones
   ========================================================== */

const StreakManager = {
  data: {
    currentStreak: 7,
    lastCheckinDate: null,
    freezesAvailable: 1,
    weeklyHistory: [true, true, true, true, true, true, false], // Mon - Sun
    milestones: [
      { id: 'm3', days: 3, title: '3-Day Spark', icon: '⚡', unlocked: true },
      { id: 'm7', days: 7, title: '7-Day Flame', icon: '🔥', unlocked: true },
      { id: 'm14', days: 14, title: '14-Day Torch', icon: '🌟', unlocked: false },
      { id: 'm30', days: 30, title: '30-Day Inferno', icon: '👑', unlocked: false }
    ]
  },

  STORAGE_KEY: 'edutwin_streak_data',

  init() {
    this.loadData();
    this.render();
    this.setupEventListeners();
  },

  loadData() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.data = { ...this.data, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse streak data', e);
      }
    }
  },

  saveData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  },

  render() {
    // Header streak count
    const headerCount = document.getElementById('headerStreakCount');
    if (headerCount) headerCount.textContent = `${this.data.currentStreak} Days`;

    // Hero streak circle
    const heroCount = document.getElementById('streakHeroCount');
    if (heroCount) heroCount.textContent = this.data.currentStreak;

    // Freeze shield text
    const freezeCount = document.getElementById('freezeCountText');
    if (freezeCount) freezeCount.textContent = `${this.data.freezesAvailable} Freeze Available`;

    // Check-in status text
    const promptTitle = document.getElementById('streakActionPrompt');
    const promptSub = document.getElementById('streakActionSub');
    const btnCheckin = document.getElementById('btnDailyCheckin');

    const todayStr = new Date().toDateString();
    const isCheckedToday = this.data.lastCheckinDate === todayStr;

    if (isCheckedToday) {
      if (promptTitle) promptTitle.textContent = "Today's Streak Secured! 🔥";
      if (promptSub) promptSub.textContent = "Awesome job! You've logged active study today. Come back tomorrow to keep the flame alive.";
      if (btnCheckin) {
        btnCheckin.disabled = true;
        btnCheckin.textContent = "Checked In Today ✓";
        btnCheckin.classList.replace('btn-emerald', 'btn-ghost');
      }
    } else {
      if (promptTitle) promptTitle.textContent = "Today's Check-In Pending";
      if (promptSub) promptSub.textContent = "Complete a study block or click check-in to preserve your momentum.";
      if (btnCheckin) {
        btnCheckin.disabled = false;
        btnCheckin.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Daily Check-In`;
        btnCheckin.className = "btn btn-emerald";
      }
    }

    // Render 7-day consistency heatmap
    this.renderDayPills(isCheckedToday);

    // Render Milestones
    this.renderMilestones();
  },

  renderDayPills(isCheckedToday) {
    const container = document.getElementById('dayPillsContainer');
    if (!container) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Let's assume today is Sunday or current day of week (0-indexed where 0 is Sun or 1 is Mon)
    const currentDayIdx = (new Date().getDay() + 6) % 7; // Mon = 0, Sun = 6

    container.innerHTML = days.map((day, idx) => {
      const isPast = idx < currentDayIdx;
      const isToday = idx === currentDayIdx;
      const done = isToday ? isCheckedToday : (this.data.weeklyHistory[idx] ?? isPast);

      return `
        <div class="day-pill ${done ? 'completed' : ''} ${isToday ? 'today' : ''}">
          <span class="day-name">${day}</span>
          <span class="day-status-icon">${done ? '🔥' : (isToday ? '⏳' : '⚪')}</span>
        </div>
      `;
    }).join('');
  },

  renderMilestones() {
    const container = document.getElementById('milestonesContainer');
    if (!container) return;

    // Check unlocks
    this.data.milestones.forEach(m => {
      if (this.data.currentStreak >= m.days) {
        m.unlocked = true;
      }
    });

    container.innerHTML = this.data.milestones.map(m => `
      <div class="milestone-badge ${m.unlocked ? 'unlocked' : ''}" title="${m.days}-Day Study Streak ${m.unlocked ? '(Completed!)' : `(${m.days - this.data.currentStreak} days to go)`}">
        <span>${m.icon}</span>
        <span>${m.title}</span>
      </div>
    `).join('');
  },

  checkIn(isAuto = false) {
    const todayStr = new Date().toDateString();
    if (this.data.lastCheckinDate === todayStr) {
      if (!isAuto) showToast('You already checked in for today! Keep studying.', 'info');
      return;
    }

    this.data.currentStreak += 1;
    this.data.lastCheckinDate = todayStr;

    // Mark today in weekly history
    const currentDayIdx = (new Date().getDay() + 6) % 7;
    this.data.weeklyHistory[currentDayIdx] = true;

    // Check milestone reward: if hit 14 days, reward an extra freeze shield
    if (this.data.currentStreak === 14 || this.data.currentStreak === 30) {
      this.data.freezesAvailable += 1;
      showToast(`🎉 Milestone reached! +1 Streak Shield added!`, 'success');
    }

    this.saveData();
    this.render();

    // Trigger sync recalculation
    if (window.ProgressManager) {
      ProgressManager.recalculateSyncScore();
    }

    showToast(`🔥 Streak updated: ${this.data.currentStreak} Days strong!`, 'success');
  },

  useStreakShield() {
    if (this.data.freezesAvailable <= 0) {
      showToast('No streak shields remaining. Complete a 14-day streak to earn another!', 'info');
      return;
    }

    if (confirm('Use 1 Streak Shield to protect your streak today?')) {
      this.data.freezesAvailable -= 1;
      const todayStr = new Date().toDateString();
      this.data.lastCheckinDate = todayStr;
      
      const currentDayIdx = (new Date().getDay() + 6) % 7;
      this.data.weeklyHistory[currentDayIdx] = true;

      this.saveData();
      this.render();
      showToast('🛡️ Streak Shield activated! Today is protected.', 'success');
    }
  },

  setupEventListeners() {
    const btnCheckin = document.getElementById('btnDailyCheckin');
    if (btnCheckin) {
      btnCheckin.addEventListener('click', () => this.checkIn());
    }

    const btnShield = document.getElementById('btnUseShield');
    if (btnShield) {
      btnShield.addEventListener('click', () => this.useStreakShield());
    }

    const headerBadge = document.getElementById('headerStreakBadge');
    if (headerBadge) {
      headerBadge.addEventListener('click', () => {
        showToast(`🔥 You have maintained your study streak for ${this.data.currentStreak} consecutive days!`, 'info');
      });
    }
  }
};
