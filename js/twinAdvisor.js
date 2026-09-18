/* ==========================================================
   EduTwin - AI Digital Twin Advisor Module (TNPSC & RRB Edition)
   Interactive Government Exam Ranker Co-Pilot, syllabus diagnostics & chat
   ========================================================== */

const TwinAdvisor = {
  messages: [
    {
      sender: 'twin',
      text: "👋 Vanakkam & Greetings, Aspirant! I am your EduTwin Govt Exam Co-Pilot. I track your syllabus coverage across TNPSC (Group 1, 2, 4) & RRB (NTPC, Group D), monitor your study velocity, and optimize your daily roadmap. How can I assist your rank preparation today?"
    }
  ],

  init() {
    this.renderMessages();
    this.setupEventListeners();
  },

  renderMessages() {
    const chatContainer = document.getElementById('advisorChatHistory');
    if (!chatContainer) return;

    chatContainer.innerHTML = this.messages.map(msg => `
      <div class="chat-bubble ${msg.sender === 'twin' ? 'chat-twin' : 'chat-user'}">
        ${msg.text}
      </div>
    `).join('');

    chatContainer.scrollTop = chatContainer.scrollHeight;
  },

  sendMessage(userText) {
    if (!userText.trim()) return;

    // Add user message
    this.messages.push({ sender: 'user', text: userText });
    this.renderMessages();

    // Generate intelligent response based on student context
    setTimeout(() => {
      const response = this.generateTwinResponse(userText);
      this.messages.push({ sender: 'twin', text: response });
      this.renderMessages();
    }, 400);
  },

  generateTwinResponse(query) {
    const q = query.toLowerCase();
    const sync = window.ProgressManager ? ProgressManager.data.syncScore : 88;
    const streak = window.StreakManager ? StreakManager.data.currentStreak : 7;
    const weak = window.StudyPlanManager ? StudyPlanManager.config.weakAreas : 'Unit 8 & 9 (TN), Aptitude';

    if (q.includes('unit 8') || q.includes('unit 9') || q.includes('thirukkural') || q.includes('heritage')) {
      return `🏛️ <strong>3-Step High-Scoring Protocol for TNPSC Unit 8 & 9:</strong><br><br>` +
             `1. <strong>Thirukkural:</strong> Master the 25 prescribed Athikarams (especially <em>Anbudaimai</em>, <em>Porutpaal</em> socio-political ethics, and secular principles). Focus on deep contextual meaning.<br>` +
             `2. <strong>Samacheer Kalvi 11th & 12th Ethics & Tamil:</strong> Thoroughly read chapters on Sangam Age polity, Keezhadi archaeological excavations, and early freedom fighters (Velu Nachiyar, Pulithevar, Kattabomman).<br>` +
             `3. <strong>Unit 9 Social Schemes:</strong> Track official TN welfare initiatives (Pudhumai Penn, Moovalur Ramamirtham, Naan Mudhalvan, Kalaignar Magalir Urimai) with launch years and eligibility.`;
    }

    if (q.includes('negative') || q.includes('rrb') || q.includes('cbt') || q.includes('guess')) {
      return `🎯 <strong>RRB 1/3rd Negative Marking Defence Protocol:</strong><br><br>` +
             `• In RRB CBT 1 & 2, every wrong answer costs you 0.33 marks. Guessing 15 questions wrong deducts 5 full marks, dropping your normalized score by 10-15 merit positions!<br>` +
             `• <strong>The 50:50 Rule:</strong> Attempt a doubtful question ONLY if you can eliminate at least two options with certainty.<br>` +
             `• <strong>3-Pass Exam Technique:</strong><br>` +
             `&nbsp;&nbsp;• <em>Pass 1:</em> Attempt 100% sure General Awareness and quick questions (40 mins).<br>` +
             `&nbsp;&nbsp;• <em>Pass 2:</em> Solve calculation-heavy Aptitude & Reasoning questions.<br>` +
             `&nbsp;&nbsp;• <em>Pass 3:</em> Review flagged questions without wild guessing.`;
    }

    if (q.includes('samacheer') || q.includes('book') || q.includes('ncert') || q.includes('material') || q.includes('source')) {
      return `📚 <strong>Mandatory Samacheer Kalvi & NCERT Source Checklist:</strong><br><br>` +
             `• <strong>General Science:</strong> 6th to 10th Standard Samacheer Kalvi Science covers 95% of direct questions in TNPSC Group 4 and RRB NTPC.<br>` +
             `• <strong>Indian Polity:</strong> 10th Social Science (Civics section) + 11th & 12th Political Science + M. Laxmikanth for article references.<br>` +
             `• <strong>Indian National Movement (INM):</strong> 10th Social Science Vol 2 (Chapters on Freedom Struggle in TN and India).<br>` +
             `• <strong>Aptitude & Mental Ability:</strong> Complete all "Do You Know" boxes and exercise problems from 6th-10th school math textbooks before touching external guides.`;
    }

    if (q.includes('speed') || q.includes('math') || q.includes('aptitude') || q.includes('shortcut') || q.includes('reasoning')) {
      return `⏱️ <strong>Aptitude 25/25 Target Formula for TNPSC & RRB:</strong><br><br>` +
             `• <strong>Daily Routine:</strong> Solve 25 aptitude questions every morning before starting GS readings.<br>` +
             `• <strong>Instant Memory:</strong> Memorize multiplication tables up to 25, squares up to 30, and cubes up to 15.<br>` +
             `• <strong>CI vs SI Shortcut:</strong> 2-Year difference = <em>P × (R / 100)²</em>; 3-Year difference = <em>P × (R/100)² × (3 + R/100)</em>.<br>` +
             `• <strong>Work & Time:</strong> Remember (A × B) / (A + B) for 2 individuals, and convert efficiency into ratios.`;
    }

    if (q.includes('burnout') || q.includes('tired') || q.includes('overwhelmed') || q.includes('stress')) {
      return `☕ <strong>Take a breath, Future Officer.</strong> Fatigue is common during rigorous competitive exam prep.<br><br>` +
             `Recommendation:<br>` +
             `• Take a <strong>10-minute restorative break</strong> with the 'Calm Waves' audio in our Focus Studio.<br>` +
             `• Lower today's pressure: solve 5 flashcards on your phone rather than reading dense textbooks.<br>` +
             `• You have <strong>1 Streak Shield</strong> available if you need a planned rest day to recharge!`;
    }

    if (q.includes('sync') || q.includes('score') || q.includes('calculated')) {
      return `📊 <strong>Your EduTwin Sync is currently ${sync}%!</strong><br><br>` +
             `Here is your Govt Exam Readiness Breakdown:<br>` +
             `• <strong>45% Syllabus Coverage:</strong> Topics checked off across Unit 8/9, Polity, Aptitude, and Science.<br>` +
             `• <strong>35% Daily Focus:</strong> Logging your target study hours (currently ${ProgressManager.data.hoursLoggedToday}h logged).<br>` +
             `• <strong>20% Habit Consistency:</strong> Maintaining your ${streak}-day flame streak.`;
    }

    return `💡 <strong>EduTwin Co-Pilot Insight:</strong> Your consistency (${streak} days) is what separates successful rankers from ordinary aspirants. Prioritize a 25-minute Pomodoro sprint on your weakest subject (<strong>${weak}</strong>) today to maximize retention.`;
  },

  setupEventListeners() {
    const advisorModal = document.getElementById('twinAdvisorModal');
    const btnOpenQuick = document.getElementById('btnTwinAdvisorQuick');
    const btnClose = document.getElementById('btnCloseAdvisorModal');
    const btnSend = document.getElementById('btnSendAdvisorMessage');
    const input = document.getElementById('advisorUserInput');

    if (btnOpenQuick && advisorModal) {
      btnOpenQuick.addEventListener('click', () => {
        advisorModal.classList.add('active');
        if (input) input.focus();
      });
    }

    if (btnClose && advisorModal) {
      btnClose.addEventListener('click', () => {
        advisorModal.classList.remove('active');
      });
    }

    if (btnSend && input) {
      btnSend.addEventListener('click', () => {
        this.sendMessage(input.value);
        input.value = '';
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage(input.value);
          input.value = '';
        }
      });
    }

    // Quick prompt pills
    document.querySelectorAll('.quick-prompt-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const text = e.target.getAttribute('data-prompt');
        this.sendMessage(text);
      });
    });
  }
};
