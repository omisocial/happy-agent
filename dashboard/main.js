// CodyMaster Automator - Dashboard Logic

const API_BASE = "http://localhost:3000/api";

// --- ONBOARDING LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
  checkOnboarding();
  initTabs();
  initPillSelectors();
  initDispatchButton();
});

function checkOnboarding() {
  const isCompleted = localStorage.getItem('cody_onboarding_done');
  if (!isCompleted) {
    document.getElementById('onboarding-overlay').classList.remove('hidden');
  } else {
    document.getElementById('onboarding-overlay').classList.add('hidden');
  }
}

function toggleObHint() {
  const engine = document.getElementById('ob-ai-engine').value;
  const hint = document.getElementById('ob-ai-hint');
  if (engine === 'not_installed') {
    hint.classList.remove('hidden');
  } else {
    hint.classList.add('hidden');
  }
}

function nextOnboardingStep(step) {
  // Validate if they selected not_installed
  const engine = document.getElementById('ob-ai-engine').value;
  if (step === 2 && engine === 'not_installed') {
    showToast("Vui lòng làm theo hướng dẫn cài đặt thuật toán AI trước khi tiếp tục!");
    return;
  }
  document.querySelectorAll('.onboarding-step').forEach(el => el.classList.add('hidden'));
  document.getElementById(`step-${step}`).classList.remove('hidden');
}

function finishOnboarding() {
  const engine = document.getElementById('ob-ai-engine').value;
  const chromePath = document.getElementById('ob-chrome-path').value;
  
  // Save to config (Mock via localStorage for now)
  localStorage.setItem('cody_engine', engine);
  localStorage.setItem('cody_chromePath', chromePath);
  localStorage.setItem('cody_onboarding_done', 'true');
  
  document.getElementById('onboarding-overlay').classList.add('hidden');
  showToast("Lưu thiết lập thành công. Bắt đầu làm việc!");
}

// --- TAB SWITCHING ---
function initTabs() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove active from all navs & views
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
      
      // Add active to clicked nav & target view
      item.classList.add('active');
      const targetId = item.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// --- PROFILE PILL SELECTOR ---
function initPillSelectors() {
  const pills = document.querySelectorAll('.pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('selected');
    });
  });
}

// --- DISPATCHER & JOB TRACKING ---
function initDispatchButton() {
  const btn = document.getElementById('btn-dispatch');
  btn.addEventListener('click', async () => {
    const selectedSkill = document.getElementById('job-skill-select').value;
    const selectedProfiles = Array.from(document.querySelectorAll('.pill.selected')).map(p => p.getAttribute('data-id'));
    
    if (!selectedSkill) {
      showToast("Vui lòng chọn 1 Skill chạy!");
      return;
    }
    if (selectedProfiles.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 Profile!");
      return;
    }

    showToast(`Đang phân bổ tác vụ cho ${selectedProfiles.length} Profiles...`);
    
    // Clear empty state
    const jobsGrid = document.getElementById('jobs-grid');
    const emptyState = jobsGrid.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    // Create tracking cards for each profile
    selectedProfiles.forEach(profileId => {
      // Mock Start
      createJobCard(profileId, "Đang chuẩn bị Trình duyệt...");
      
      // Call Backend API to trigger the actual CLI engine
      triggerJob(selectedSkill, profileId);
    });
  });
}

function createJobCard(profileId, initialStatus) {
  const jobsGrid = document.getElementById('jobs-grid');
  
  // Card ID
  const cardId = `job-card-${profileId}`;
  
  // Prevent duplicate cards if already running, just reset it
  let card = document.getElementById(cardId);
  if (card) {
    card.remove();
  }

  card = document.createElement('div');
  card.className = 'job-card';
  card.id = cardId;
  card.innerHTML = `
    <div class="job-header">
      <span class="job-profile">${profileId}</span>
      <span class="job-status-badge running" id="status-badge-${profileId}">Running</span>
    </div>
    <div class="job-progress-container">
      <div class="job-progress-bar" id="progress-${profileId}" style="width: 10%;"></div>
    </div>
    <div class="job-text" id="status-text-${profileId}">${initialStatus}</div>
  `;
  
  jobsGrid.appendChild(card);
  
  // Auto-simulate some progress just for visual feedback until WebSocket is fully hooked
  simulateProgress(profileId);
}

function updateJobStatus(profileId, percent, text, isError = false) {
  const progressBar = document.getElementById(`progress-${profileId}`);
  const statusText = document.getElementById(`status-text-${profileId}`);
  const statusBadge = document.getElementById(`status-badge-${profileId}`);
  
  if (progressBar) progressBar.style.width = percent + '%';
  if (statusText) statusText.textContent = text;
  
  if (isError) {
    statusBadge.className = 'job-status-badge error';
    statusBadge.textContent = 'Error';
    progressBar.style.backgroundColor = 'var(--error)';
  } else if (percent === 100) {
    statusBadge.className = 'job-status-badge running';
    statusBadge.style.background = '#dcfce7'; 
    statusBadge.style.color = '#166534';
    statusBadge.textContent = 'Completed';
  }
}

// Temporary simulation function to show the UI working
function simulateProgress(profileId) {
  let progress = 10;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 20);
    if (progress > 90) progress = 90; // hold at 90 until backend says done
    
    updateJobStatus(profileId, progress, "Đang xử lý Form dữ liệu...");
    
    if (progress >= 90) {
      clearInterval(interval);
      // Simulate finish
      setTimeout(() => {
        updateJobStatus(profileId, 100, "Công việc hoàn tất thành công!");
      }, 3000);
    }
  }, 1500);
}

async function triggerJob(skillId, profileId) {
  try {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill: skillId, profile: profileId })
    });
    const data = await res.json();
    appendGlobalLog(`[API] Triggered Job for ${profileId}: ${data.message}`);
  } catch (err) {
    updateJobStatus(profileId, 0, "Lỗi kết nối Server!", true);
    appendGlobalLog(`[ERR] Failed to trigger job for ${profileId}`);
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function appendGlobalLog(text) {
  const logContainer = document.getElementById('global-log-container');
  if (!logContainer) return;
  const div = document.createElement('div');
  div.textContent = text;
  logContainer.appendChild(div);
  logContainer.scrollTop = logContainer.scrollHeight;
}
