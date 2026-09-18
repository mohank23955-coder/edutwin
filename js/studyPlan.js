/* ==========================================================
   EduTwin - Personalized Study Plan Module (TNPSC & RRB Edition)
   Dynamic plan generator, weekly curriculum roadmap, task checklist & subject filters
   ========================================================== */

const StudyPlanManager = {
  // 1-Click Government Exam Presets
  presets: {
    tnpsc_g4: {
      examGoal: 'TNPSC Group 4 / VAO',
      daysAhead: 45,
      dailyHours: 5.0,
      subjects: ['General Tamil', 'Unit 8 & 9 (TN)', 'Indian Polity', 'Aptitude & Mental Ability', 'General Science'],
      weakAreas: 'Unit 8 & 9 (TN), Aptitude & Mental Ability'
    },
    tnpsc_g2: {
      examGoal: 'TNPSC Group 2 & 2A (Prelims & Mains)',
      daysAhead: 60,
      dailyHours: 6.0,
      subjects: ['Unit 8 & 9 (TN)', 'Indian Polity', 'Indian Economy & INM', 'Aptitude & Mental Ability', 'General Science'],
      weakAreas: 'Unit 8 & 9 (TN), Indian Polity'
    },
    rrb_ntpc: {
      examGoal: 'RRB NTPC (CBT 1 & 2)',
      daysAhead: 50,
      dailyHours: 5.0,
      subjects: ['Aptitude & Mental Ability', 'RRB Reasoning', 'General Science', 'RRB General Awareness'],
      weakAreas: 'Aptitude & Mental Ability, RRB General Awareness'
    },
    rrb_groupd: {
      examGoal: 'RRB Group D / ALP Level 1',
      daysAhead: 40,
      dailyHours: 4.5,
      subjects: ['General Science', 'Aptitude & Mental Ability', 'RRB Reasoning', 'RRB General Awareness'],
      weakAreas: 'General Science, RRB Reasoning'
    }
  },

  config: {
    examGoal: 'TNPSC Group 4 & RRB NTPC',
    examDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dailyHours: 5.0,
    subjects: ['Unit 8 & 9 (TN)', 'Indian Polity', 'Aptitude & Mental Ability', 'General Science', 'Indian Economy & INM', 'RRB General Awareness'],
    weakAreas: 'Unit 8 & 9 (TN), Aptitude & Mental Ability'
  },

  // High-Yield 4-Week Government Exam Study Roadmap
  weeks: {
    1: [
      { id: 'w1_d1_1', day: 'Day 1', title: 'Unit 8: Thirukkural - Role in Socio-Political Movements & Equality (Porutpaal)', subject: 'Unit 8 & 9 (TN)', duration: 50, priority: 'High', completed: true },
      { id: 'w1_d1_2', day: 'Day 1', title: 'Polity: Preamble, Fundamental Rights (Art 14-32) & Writs (Habeas Corpus)', subject: 'Indian Polity', duration: 50, priority: 'High', completed: true },
      { id: 'w1_d2_1', day: 'Day 2', title: 'Aptitude: LCM & HCF Speed Tricks, Factorization & Division Rules', subject: 'Aptitude & Mental Ability', duration: 45, priority: 'High', completed: true },
      { id: 'w1_d2_2', day: 'Day 2', title: 'RRB GK: Indian Railways History (1853), 18 Railway Zones & World Heritage Sites', subject: 'RRB General Awareness', duration: 40, priority: 'Medium', completed: true },
      { id: 'w1_d3_1', day: 'Day 3', title: 'Unit 8: Early Resistance to British Rule - Rani Velu Nachiyar & Veerapandiya Kattabomman', subject: 'Unit 8 & 9 (TN)', duration: 60, priority: 'High', completed: false },
      { id: 'w1_d3_2', day: 'Day 3', title: 'Science: Samacheer Kalvi 9th/10th - Motion, Laws of Gravitation & Work-Energy', subject: 'General Science', duration: 45, priority: 'Medium', completed: false },
      { id: 'w1_d4_1', day: 'Day 4', title: 'Polity: Directive Principles of State Policy (DPSP) vs Fundamental Rights', subject: 'Indian Polity', duration: 45, priority: 'High', completed: false }
    ],
    2: [
      { id: 'w2_d1_1', day: 'Day 8', title: 'Unit 9: Tamil Nadu Social Welfare Schemes - Pudhumai Penn, Moovalur Ramamirtham', subject: 'Unit 8 & 9 (TN)', duration: 60, priority: 'High', completed: false },
      { id: 'w2_d1_2', day: 'Day 8', title: 'Aptitude: Percentage, Profit & Loss Formulas & Successive Discount Shortcuts', subject: 'Aptitude & Mental Ability', duration: 55, priority: 'High', completed: false },
      { id: 'w2_d2_1', day: 'Day 9', title: 'Economy & INM: 1857 Great Revolt, Swadeshi Movement & VOC Ship Company', subject: 'Indian Economy & INM', duration: 50, priority: 'High', completed: false },
      { id: 'w2_d2_2', day: 'Day 9', title: 'RRB Reasoning: Syllogisms (Venn Diagrams), Statement-Conclusion Drills', subject: 'RRB Reasoning', duration: 45, priority: 'Medium', completed: false },
      { id: 'w2_d3_1', day: 'Day 10', title: 'Science: Periodic Classification, Acids, Bases & Salts (10th Samacheer/NCERT)', subject: 'General Science', duration: 45, priority: 'Medium', completed: false }
    ],
    3: [
      { id: 'w3_d1_1', day: 'Day 15', title: 'Polity: Union Parliament (Lok Sabha vs Rajya Sabha), Money Bill Art 110', subject: 'Indian Polity', duration: 60, priority: 'High', completed: false },
      { id: 'w3_d1_2', day: 'Day 15', title: 'Aptitude: Simple vs Compound Interest 2-Year & 3-Year Difference Formulas', subject: 'Aptitude & Mental Ability', duration: 60, priority: 'High', completed: false },
      { id: 'w3_d2_1', day: 'Day 16', title: 'Unit 8: Dravidian Movement, Self-Respect Movement (Periyar) & Justice Party Milestones', subject: 'Unit 8 & 9 (TN)', duration: 60, priority: 'High', completed: false },
      { id: 'w3_d3_1', day: 'Day 17', title: 'Full-Length Mock Paper: 100 General Studies & Aptitude PYQ Timed Test', subject: 'Aptitude & Mental Ability', duration: 90, priority: 'High', completed: false }
    ],
    4: [
      { id: 'w4_d1_1', day: 'Day 22', title: 'High-Yield OMR Speed Drill: 25 Aptitude Questions in 22 Minutes', subject: 'Aptitude & Mental Ability', duration: 45, priority: 'High', completed: false },
      { id: 'w4_d2_1', day: 'Day 23', title: 'TNPSC & RRB Current Affairs: Last 6 Months TN Schemes, Awards & Rail Innovations', subject: 'RRB General Awareness', duration: 60, priority: 'High', completed: false },
      { id: 'w4_d3_1', day: 'Day 24', title: 'Final Comprehensive 200-Question Exam Simulation (OMR / CBT Timer)', subject: 'Unit 8 & 9 (TN)', duration: 120, priority: 'High', completed: false }
    ]
  },

  activeWeek: 1,
  activeFilter: 'all',
  STORAGE_KEY: 'edutwin_govt_plan_data_v2',

  init() {
    this.loadData();
    this.calculateCountdown();
    this.render();
    this.setupEventListeners();
  },

  loadData() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.config && parsed.config.subjects && !parsed.config.subjects.includes('Calculus')) {
          this.config = { ...this.config, ...parsed.config };
          if (parsed.weeks) this.weeks = parsed.weeks;
        }
      } catch (e) {
        console.error('Failed to parse plan data', e);
      }
    }
  },

  saveData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      config: this.config,
      weeks: this.weeks
    }));
  },

  getTasks() {
    let all = [];
    Object.values(this.weeks).forEach(weekTasks => {
      all = all.concat(weekTasks);
    });
    return all;
  },

  calculateCountdown() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(this.config.examDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const countElem = document.getElementById('daysRemainingVal');
    if (countElem) {
      countElem.textContent = diffDays > 0 ? `${diffDays} Days` : (diffDays === 0 ? 'Today!' : 'Passed');
    }

    const examNameElem = document.getElementById('targetExamName');
    if (examNameElem) examNameElem.textContent = this.config.examGoal;

    const planDateVal = document.getElementById('planDateVal');
    if (planDateVal) planDateVal.textContent = diffDays > 0 ? `In ${diffDays} Days` : 'Due';

    const planGoalVal = document.getElementById('planGoalVal');
    if (planGoalVal) planGoalVal.textContent = this.config.examGoal;

    const planHoursVal = document.getElementById('planHoursVal');
    if (planHoursVal) planHoursVal.textContent = `${this.config.dailyHours} hrs / day`;

    const planWeakVal = document.getElementById('planWeakVal');
    if (planWeakVal) planWeakVal.textContent = this.config.weakAreas || 'None specified';
  },

  render() {
    this.renderDashboardTasks();
    this.renderFullPlanWeek();
    this.populateFilterDropdown();
    this.populateTaskSelectorForTimer();
    if (window.ProgressManager) ProgressManager.updateTaskMetrics();
  },

  renderDashboardTasks() {
    const container = document.getElementById('todayTasksList');
    if (!container) return;

    let tasks = this.weeks[this.activeWeek] || [];
    if (this.activeFilter !== 'all') {
      tasks = tasks.filter(t => t.subject === this.activeFilter);
    }

    if (tasks.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 32px; color: var(--text-muted);">
          <p>No study tasks found for this subject filter. Switch filter to "All Subjects" or add a custom topic.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = tasks.map(task => `
      <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
        <div class="task-left">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
          <div class="task-details">
            <span class="task-title">${task.title}</span>
            <div class="task-tags">
              <span class="task-tag tag-subject">${task.subject}</span>
              <span class="task-tag tag-time">⏱️ ${task.duration}m</span>
              ${task.priority === 'High' ? '<span class="task-tag tag-priority-high">Priority Weak Area</span>' : ''}
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-xs delete-task-btn" data-id="${task.id}" title="Remove task">✕</button>
      </div>
    `).join('');

    // Attach checkbox listeners
    container.querySelectorAll('.task-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.toggleTask(id, e.target.checked);
      });
    });

    // Attach delete listeners
    container.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.deleteTask(id);
      });
    });
  },

  renderFullPlanWeek() {
    const container = document.getElementById('planWeekTasksContainer');
    if (!container) return;

    const tasks = this.weeks[this.activeWeek] || [];

    const grouped = {};
    tasks.forEach(t => {
      const d = t.day || 'Day 1';
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(t);
    });

    const daysKeys = Object.keys(grouped);
    if (daysKeys.length === 0) {
      container.innerHTML = '<p class="text-subtle">No tasks scheduled for this week yet.</p>';
      return;
    }

    container.innerHTML = daysKeys.map(dayName => `
      <div class="day-column-card">
        <div class="day-column-header">
          <strong>${dayName}</strong>
          <span>${grouped[dayName].length} Topics</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${grouped[dayName].map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" style="padding: 8px 12px;">
              <div class="task-left">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <div class="task-details">
                  <span class="task-title" style="font-size: 0.84rem;">${task.title}</span>
                  <div class="task-tags">
                    <span class="task-tag tag-subject" style="font-size: 0.68rem;">${task.subject}</span>
                    <span class="task-tag tag-time" style="font-size: 0.68rem;">${task.duration}m</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.task-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.toggleTask(id, e.target.checked);
      });
    });
  },

  toggleTask(taskId, isChecked) {
    let found = false;
    let foundSubject = '';

    for (const weekNum in this.weeks) {
      const task = this.weeks[weekNum].find(t => t.id === taskId);
      if (task) {
        task.completed = isChecked;
        found = true;
        foundSubject = task.subject;
        break;
      }
    }

    if (found) {
      this.saveData();
      this.render();

      if (isChecked) {
        if (window.ProgressManager) {
          ProgressManager.boostSubjectMastery(foundSubject, 3);
        }
        showToast(`🎉 Syllabus topic completed! EduTwin Sync updated.`, 'success');
      }
    }
  },

  deleteTask(taskId) {
    for (const weekNum in this.weeks) {
      const idx = this.weeks[weekNum].findIndex(t => t.id === taskId);
      if (idx !== -1) {
        this.weeks[weekNum].splice(idx, 1);
        this.saveData();
        this.render();
        showToast('Task removed from roadmap.', 'info');
        break;
      }
    }
  },

  addCustomTask(title, subject, duration) {
    const newTask = {
      id: 'custom_' + Date.now(),
      day: 'Day 1',
      title: title,
      subject: subject,
      duration: parseInt(duration, 10) || 45,
      priority: 'Medium',
      completed: false
    };

    if (!this.weeks[this.activeWeek]) this.weeks[this.activeWeek] = [];
    this.weeks[this.activeWeek].unshift(newTask);

    this.saveData();
    this.render();
    showToast(`Added "${title}" to today's roadmap!`, 'success');
  },

  generateAdaptiveRoadmap(examGoal, examDate, dailyHours, subjects, weakAreas) {
    this.config.examGoal = examGoal;
    this.config.examDate = examDate;
    this.config.dailyHours = parseFloat(dailyHours) || 5.0;
    this.config.subjects = subjects;
    this.config.weakAreas = weakAreas;

    const weakList = weakAreas.toLowerCase().split(',').map(s => s.trim());

    // Authentic curriculum bank for TNPSC and RRB
    const curriculumTemplates = {
      'Unit 8 & 9 (TN)': [
        'Thirukkural Core Concepts (Anbudaimai, Porutpaal & Secular Ethics)',
        'Early Anti-British Uprisings (Velu Nachiyar, Pulithevar, Kattabomman)',
        'Dravidian Movement, South Indian Liberal Federation (Justice Party) & Periyar',
        'TN Social Welfare Schemes, HDI Indicators & Reservation Policies',
        'e-Governance in Tamil Nadu, TNeGA & Industrial Growth Corridors'
      ],
      'Indian Polity': [
        'Constitutional Framework: Preamble & Salient Features',
        'Fundamental Rights (Art 14-32) & Constitutional Remedies (Writs)',
        'Union Parliament (Lok Sabha/Rajya Sabha), President & Governor Powers',
        'Supreme Court, High Courts & Judicial Review',
        'Panchayati Raj (73rd & 74th Constitutional Amendment Acts)'
      ],
      'Aptitude & Mental Ability': [
        'Simplification (BODMAS, Surds, Indices & Square Roots)',
        'LCM, HCF & Number System Fundamentals',
        'Percentages, Profit & Loss, Ratio & Proportion',
        'Simple Interest & Compound Interest Difference Shortcuts',
        'Time & Work, Pipes & Cisterns, Speed-Distance-Time'
      ],
      'General Science': [
        'Samacheer Kalvi Physics: Motion, Optics, Electricity & Sound',
        'Samacheer Kalvi Chemistry: Acids, Bases, Salts, Metals & Ores',
        'Life Sciences: Human Physiology, Diseases & Blood Circulation',
        'Nutrition, Balanced Diet, Respiration & Endocrine System',
        'Environmental Ecology, Bio-fertilizers & Pollution Control'
      ],
      'Indian Economy & INM': [
        '1857 Revolt & Early Freedom Struggles in Tamil Nadu',
        'Swadeshi Movement, VOC, Subramania Bharati & Extremist Phase',
        'Gandhian Era, Non-Cooperation & Quit India Movement',
        'Five-Year Plans, NITI Aayog & GST Structure',
        'Reserve Bank of India, Monetary Policy & Inflation Control'
      ],
      'RRB General Awareness': [
        'Indian Railways: 1853 First Train, 18 Zones & Headquarters',
        'Vande Bharat Express, Dedicated Freight Corridors & Rail Inventions',
        'Indian Geography: Rivers, National Parks, Biosphere Reserves & Dams',
        'Static GK: Major International Organizations, Treaties & Heads',
        'Current Affairs: National Awards, Sports, Defense & Science Tech'
      ],
      'RRB Reasoning': [
        'Analogy, Classification & Coding-Decoding',
        'Syllogisms & Venn Diagram Representations',
        'Blood Relations & Direction Sense Tests',
        'Mathematical Operations, Number Series & Puzzles',
        'Non-Verbal Reasoning, Mirror Images & Embedded Figures'
      ],
      'General Tamil': [
        'Pothu Tamil: Ilakkanam (Peyarcol, Vinaicol, Sandhi Rules)',
        'Thirukkural, Pathinenkeelkanakku & Silappathikaram Quotes',
        'Bharathiyar, Bharathidasan & Kavignargal Padaippugal',
        'Dravidian Languages & Tamil Inscriptions (Keezhadi Archaeological Findings)',
        'Previous 10 Years TNPSC Group 4 Tamil PYQ Drills'
      ]
    };

    const newWeeks = { 1: [], 2: [], 3: [], 4: [] };

    subjects.forEach(subject => {
      const isWeak = weakList.some(w => subject.toLowerCase().includes(w));
      const topics = curriculumTemplates[subject] || [
        `${subject}: Samacheer Kalvi Fundamentals`,
        `${subject}: High-Yield PYQ Problem Sets`,
        `${subject}: Mock Test & Speed Drill`,
        `${subject}: Final Revision & Formula Summary`
      ];

      topics.forEach((topicName, idx) => {
        const weekNum = (idx % 4) + 1;
        const dayNum = Math.floor(idx / 2) + 1;
        newWeeks[weekNum].push({
          id: `gen_govt_${subject.replace(/[^a-zA-Z]/g, '')}_${idx}_${Date.now()}`,
          day: `Day ${dayNum}`,
          title: topicName,
          subject: subject,
          duration: isWeak ? 60 : 45,
          priority: isWeak ? 'High' : 'Medium',
          completed: false
        });
      });
    });

    this.weeks = newWeeks;
    this.saveData();
    this.calculateCountdown();
    this.render();
    showToast('✨ New personalized government exam plan generated!', 'success');
  },

  applyPreset(presetKey) {
    const preset = this.presets[presetKey];
    if (!preset) return;

    const goalInput = document.getElementById('inputExamGoal');
    if (goalInput) goalInput.value = preset.examGoal;

    const dateInput = document.getElementById('inputExamDate');
    if (dateInput) {
      const targetDate = new Date(Date.now() + preset.daysAhead * 24 * 60 * 60 * 1000);
      dateInput.value = targetDate.toISOString().split('T')[0];
    }

    const hoursInput = document.getElementById('inputDailyHours');
    if (hoursInput) hoursInput.value = preset.dailyHours;

    const weakInput = document.getElementById('inputWeakAreas');
    if (weakInput) weakInput.value = preset.weakAreas;

    // Check matching checkboxes in modal
    const checkboxes = document.querySelectorAll('input[name="subjectCheck"]');
    checkboxes.forEach(cb => {
      cb.checked = preset.subjects.includes(cb.value);
    });

    showToast(`📋 Loaded preset: ${preset.examGoal}`, 'info');
  },

  populateFilterDropdown() {
    const filterSelect = document.getElementById('taskSubjectFilter');
    if (!filterSelect) return;

    const currentVal = filterSelect.value;
    const subjects = this.config.subjects;

    filterSelect.innerHTML = '<option value="all">All Subjects</option>' +
      subjects.map(s => `<option value="${s}">${s}</option>`).join('');

    filterSelect.value = currentVal || 'all';
  },

  populateTaskSelectorForTimer() {
    const select = document.getElementById('timerLinkedTask');
    if (!select) return;

    const tasks = this.getTasks().filter(t => !t.completed);
    select.innerHTML = '<option value="none">General Focus Session</option>' +
      tasks.map(t => `<option value="${t.id}">[${t.subject}] ${t.title}</option>`).join('');
  },

  setupEventListeners() {
    // Subject filter change
    const filterSelect = document.getElementById('taskSubjectFilter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.activeFilter = e.target.value;
        this.renderDashboardTasks();
      });
    }

    // Week tabs in Plan View
    const weekTabs = document.querySelectorAll('.week-tab');
    weekTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        weekTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.activeWeek = parseInt(e.target.getAttribute('data-week'), 10) || 1;
        this.renderFullPlanWeek();
      });
    });

    // Preset button triggers in Plan Modal
    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const presetKey = e.currentTarget.getAttribute('data-preset');
        this.applyPreset(presetKey);
      });
    });

    // Custom Task Modal trigger
    const btnAddQuick = document.getElementById('btnAddNewTaskQuick');
    const taskModal = document.getElementById('taskModal');
    const btnCloseTaskModal = document.getElementById('btnCloseTaskModal');
    const btnCancelTaskModal = document.getElementById('btnCancelTaskModal');
    const customTaskForm = document.getElementById('customTaskForm');

    if (btnAddQuick && taskModal) {
      btnAddQuick.addEventListener('click', () => {
        taskModal.classList.add('active');
      });
    }

    if (btnCloseTaskModal && taskModal) {
      btnCloseTaskModal.addEventListener('click', () => taskModal.classList.remove('active'));
    }

    if (btnCancelTaskModal && taskModal) {
      btnCancelTaskModal.addEventListener('click', () => taskModal.classList.remove('active'));
    }

    if (customTaskForm) {
      customTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('customTaskTitle').value;
        const subject = document.getElementById('customTaskSubject').value;
        const duration = document.getElementById('customTaskDuration').value;

        this.addCustomTask(title, subject, duration);
        customTaskForm.reset();
        taskModal.classList.remove('active');
      });
    }

    // Study Plan Form submission
    const planForm = document.getElementById('studyPlanForm');
    const planModal = document.getElementById('planModal');
    if (planForm) {
      planForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const goal = document.getElementById('inputExamGoal').value;
        const date = document.getElementById('inputExamDate').value;
        const hours = document.getElementById('inputDailyHours').value;
        const weak = document.getElementById('inputWeakAreas').value;

        const subjectBoxes = document.querySelectorAll('input[name="subjectCheck"]:checked');
        const selectedSubjects = Array.from(subjectBoxes).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
          showToast('Please select at least one syllabus subject.', 'info');
          return;
        }

        this.generateAdaptiveRoadmap(goal, date, hours, selectedSubjects, weak);
        if (planModal) planModal.classList.remove('active');
      });
    }

    // Regenerate Roadmap button
    const btnRegen = document.getElementById('btnGenerateNewPlan');
    if (btnRegen) {
      btnRegen.addEventListener('click', () => {
        if (planModal) planModal.classList.add('active');
      });
    }

    // Customize Plan button
    const btnCust = document.getElementById('btnCustomizePlan');
    if (btnCust) {
      btnCust.addEventListener('click', () => {
        if (planModal) planModal.classList.add('active');
      });
    }
  }
};
