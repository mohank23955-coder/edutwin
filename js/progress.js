/* ==========================================================
   EduTwin - Progress Tracker & Analytics Module
   Tracks syllabus completion, subject mastery, hours studied, and EduTwin sync %
   ========================================================== */

const ProgressManager = {
  data: {
    hoursLoggedToday: 3.0,
    dailyHoursTarget: 5.0,
    totalHoursThisWeek: 16.5,
    subjectMastery: [
      { subject: 'Unit 8 & 9 (TN)', score: 78, color: '#7c3aed' },
      { subject: 'Indian Polity', score: 84, color: '#4f46e5' },
      { subject: 'Aptitude & Mental Ability', score: 70, color: '#059669' },
      { subject: 'General Science', score: 65, color: '#0284c7' },
      { subject: 'RRB General Awareness', score: 72, color: '#d97706' }
    ],
    syncScore: 88
  },

  STORAGE_KEY: 'edutwin_govt_progress_data_v2',

  init() {
    this.loadData();
    this.render();
    this.setupEventListeners();
  },

  loadData() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.subjectMastery && !parsed.subjectMastery.some(s => s.subject === 'Calculus')) {
          this.data = { ...this.data, ...parsed };
        }
      } catch (e) {
        console.error('Failed to parse progress data', e);
      }
    }
  },

  saveData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  },

  render() {
    // Today hours
    const todayHours = document.getElementById('todayHoursLogged');
    if (todayHours) {
      todayHours.textContent = `${this.data.hoursLoggedToday.toFixed(1)} / ${this.data.dailyHoursTarget.toFixed(1)} hrs`;
    }

    // Weekly hours
    const weekHours = document.getElementById('totalHoursWeek');
    if (weekHours) {
      weekHours.textContent = `${this.data.totalHoursThisWeek.toFixed(1)} hrs`;
    }

    // Subject Mastery List
    const masteryList = document.getElementById('subjectMasteryList');
    if (masteryList) {
      masteryList.innerHTML = this.data.subjectMastery.map(s => `
        <div class="subject-item">
          <div class="subject-meta">
            <span class="subject-meta-name">${s.subject}</span>
            <span class="subject-meta-score">${s.score}%</span>
          </div>
          <div class="subject-track">
            <div class="subject-fill" style="width: ${s.score}%; background-color: ${s.color};"></div>
          </div>
        </div>
      `).join('');
    }

    // Calculate overall tasks ratio and syllabus percent
    this.updateTaskMetrics();
  },

  updateTaskMetrics() {
    if (!window.StudyPlanManager) return;
    const tasks = StudyPlanManager.getTasks();
    const total = tasks.length || 1;
    const done = tasks.filter(t => t.completed).length;
    const percent = Math.round((done / total) * 100);

    const ratioElem = document.getElementById('tasksDoneRatio');
    if (ratioElem) ratioElem.textContent = `${done}/${total} Tasks`;

    const percentElem = document.getElementById('overallProgressPercent');
    if (percentElem) percentElem.textContent = `${percent}%`;

    const progressBar = document.getElementById('overallProgressBar');
    if (progressBar) progressBar.style.width = `${percent}%`;

    this.recalculateSyncScore(percent);
  },

  recalculateSyncScore(syllabusPercent) {
    if (syllabusPercent === undefined) {
      const tasks = window.StudyPlanManager ? StudyPlanManager.getTasks() : [];
      const total = tasks.length || 1;
      const done = tasks.filter(t => t.completed).length;
      syllabusPercent = Math.round((done / total) * 100);
    }

    const streakVal = window.StreakManager ? StreakManager.data.currentStreak : 7;
    const hoursRatio = Math.min(this.data.hoursLoggedToday / (this.data.dailyHoursTarget || 4), 1.2);

    // Formula: 50% syllabus completion + 30% daily hours ratio + 20% streak consistency
    const streakFactor = Math.min(streakVal * 4, 100);
    let calculatedSync = Math.round((syllabusPercent * 0.45) + (hoursRatio * 100 * 0.35) + (streakFactor * 0.20));
    calculatedSync = Math.min(Math.max(calculatedSync, 45), 99); // realistic range

    this.data.syncScore = calculatedSync;
    this.saveData();

    // Update banner UI
    const scoreElem = document.getElementById('twinSyncScore');
    if (scoreElem) scoreElem.textContent = `${calculatedSync}%`;

    const tagElem = document.getElementById('twinStatusTag');
    if (tagElem) {
      if (calculatedSync >= 80) {
        tagElem.textContent = 'Pacing Target: Ahead of Schedule';
        tagElem.className = 'badge badge-emerald';
      } else if (calculatedSync >= 60) {
        tagElem.textContent = 'Pacing Target: On Track';
        tagElem.className = 'badge badge-indigo';
      } else {
        tagElem.textContent = 'Pacing Target: Needs Quick Review';
        tagElem.className = 'badge badge-amber';
      }
    }
  },

  logStudyHours(amountHours) {
    this.data.hoursLoggedToday += amountHours;
    this.data.totalHoursThisWeek += amountHours;
    this.saveData();
    this.render();

    // Check in streak if not already checked in
    if (window.StreakManager && StreakManager.data.lastCheckinDate !== new Date().toDateString()) {
      StreakManager.checkIn(true);
    }

    showToast(`⏱️ Added ${Math.round(amountHours * 60)} mins to your study log!`, 'success');
  },

  boostSubjectMastery(subjectName, boostPercent = 5) {
    const item = this.data.subjectMastery.find(s => s.subject.toLowerCase() === subjectName.toLowerCase());
    if (item) {
      item.score = Math.min(item.score + boostPercent, 100);
    } else {
      this.data.subjectMastery.push({
        subject: subjectName,
        score: Math.min(50 + boostPercent, 100),
        color: '#4f46e5'
      });
    }
    this.saveData();
    this.render();
  },

  setupEventListeners() {
    const btnQuickLog = document.getElementById('btnQuickLogHour');
    if (btnQuickLog) {
      btnQuickLog.addEventListener('click', () => {
        this.logStudyHours(0.5);
      });
    }
  }
};
