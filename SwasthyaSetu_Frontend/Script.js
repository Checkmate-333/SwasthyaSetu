// ======================== DOM Elements ========================
const patientIdInput = document.getElementById('patientId');
const voiceBtn = document.getElementById('voiceIdBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('prescriptionFile');
const demoBtn = document.getElementById('demoBtn');
const printBtn = document.getElementById('printSummaryBtn');
const syncNowBtn = document.getElementById('syncNowBtn');
const themeToggle = document.getElementById('themeToggle');
const uploadArea = document.getElementById('uploadArea');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const loadingSpinner = document.getElementById('loadingSpinner');
const summaryContainer = document.getElementById('summaryContainer');
const onlineStatusSpan = document.getElementById('onlineStatus');
const offlineMsgSpan = document.getElementById('offlineMsg');
const recentPatientsList = document.getElementById('recentPatientsList');
const loadPatientBtn = document.getElementById('loadPatientBtn');

// ======================== Helper Functions ========================
function showToast(message, bgColor = '#1f5e3f') {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '20px';
  toast.style.backgroundColor = bgColor;
  toast.style.color = 'white';
  toast.style.padding = '10px 18px';
  toast.style.borderRadius = '40px';
  toast.style.fontSize = '0.8rem';
  toast.style.zIndex = '999';
  toast.style.fontWeight = '500';
  toast.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Mock AI data generator (simulates OCR + NLP)
function generateClinicalSummary(patientName = 'Ramesh Kumar', patientId = 'ABHA: 45-6789-1234') {
  return {
    patient: { name: patientName, id: patientId, age: 54, gender: 'Male' },
    timeline: [
      { date: '12 Jan 2025', diagnosis: 'Type 2 Diabetes (uncontrolled)', facility: 'PHC Bhimtal' },
      { date: '28 Feb 2025', diagnosis: 'Hypertension Stage 1', facility: 'Rural CHC' },
      { date: 'Today', diagnosis: 'Diabetes review + elevated lipids', facility: 'Current visit' }
    ],
    medications: [
      { drug: 'Metformin 500mg', dose: 'Twice daily', duration: 'Ongoing' },
      { drug: 'Telmisartan 40mg', dose: 'Once daily', duration: 'Ongoing' },
      { drug: 'Atorvastatin 10mg', dose: 'Night', duration: '1 month (new)' }
    ],
    testReports: [
      { name: 'HbA1c', value: '7.8%', normal: '<6.5%', flag: 'high', trend: '↑ from 7.2%' },
      { name: 'Fasting Glucose', value: '162 mg/dL', normal: '70-100', flag: 'high', trend: '↑ 145 → 162' },
      { name: 'Lipid profile', value: 'LDL 142 mg/dL', flag: 'high', trend: 'repeated test' }
    ],
    repeatedTestsDetected: ['Lipid profile (3 times in 6 months)', 'Fasting glucose (every visit)'],
    riskAlerts: ['⚠️ Worsening diabetes trend: HbA1c >7.5%', '📈 Rising LDL despite statin - review diet & medication', '🔁 Redundant lipid tests detected, consider 6-month interval'],
    missingDataSuggestions: ['No recent creatinine / kidney function (essential for metformin)', 'Foot examination not recorded'],
    chronicConditions: ['Type 2 Diabetes (since 2022)', 'Hypertension'],
    smartSummaryText: 'Patient with T2DM & HTN shows glycemic deterioration. Current medications: Metformin + Telmisartan. Atorvastatin newly added. Abnormal HbA1c 7.8% & LDL. Repeated lipid panel. Suggest intensifying glucose control & check renal profile.'
  };
}

function renderSummaryUI(data) {
  summaryContainer.innerHTML = `
    <div class="summary-card">
      <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; border-bottom:1px solid #ddd; padding-bottom:0.5rem; margin-bottom:1rem;">
        <div><i class="fas fa-user-circle"></i> <strong>${data.patient.name}</strong> | ${data.patient.id}</div>
        <span class="badge"><i class="fas fa-chart-simple"></i> Chronic: ${data.chronicConditions.join(', ')}</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.9rem;">
        <div>
          <p class="font-semibold"><i class="fas fa-pills"></i> Current Medications</p>
          <ul style="margin-left:1rem;">${data.medications.map(m => `<li>${m.drug} • ${m.dose} • ${m.duration}</li>`).join('')}</ul>
          <p class="font-semibold mt-2"><i class="fas fa-flask"></i> Recent Tests (Abnormal)</p>
          <ul style="margin-left:1rem;">${data.testReports.filter(t => t.flag === 'high').map(t => `<li>${t.name}: ${t.value} ${t.trend ? '('+t.trend+')' : ''} ⚠️</li>`).join('')}</ul>
        </div>
        <div>
          <p class="font-semibold"><i class="fas fa-history"></i> Visit Timeline</p>
          <ul style="font-size:0.8rem;">${data.timeline.map(t => `<li>📅 ${t.date} — ${t.diagnosis} (${t.facility})</li>`).join('')}</ul>
          ${data.repeatedTestsDetected.length ? `<div class="risk-badge" style="margin-top:0.5rem;"><i class="fas fa-repeat"></i> Repeated tests: ${data.repeatedTestsDetected.join(', ')}</div>` : ''}
        </div>
      </div>
      <div style="margin-top:1rem; background:#f7f9f8; padding:0.75rem; border-radius:1rem;">
        <p class="font-semibold"><i class="fas fa-stethoscope"></i> Doctor-Friendly Summary</p>
        <p>${data.smartSummaryText}</p>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.5rem;">
          ${data.riskAlerts.map(alert => `<span class="risk-badge"><i class="fas fa-bell"></i> ${alert}</span>`).join('')}
          ${data.missingDataSuggestions.map(miss => `<span style="background:#e0f0ff; padding:0.2rem 0.6rem; border-radius:2rem; font-size:0.7rem;"><i class="fas fa-question-circle"></i> ${miss}</span>`).join('')}
        </div>
      </div>
      <div class="text-right" style="font-size:0.6rem; margin-top:0.5rem; color:gray;"><i class="fas fa-robot"></i> AI generated via OCR+NLP</div>
    </div>
  `;
}

function processMockAI(file = null) {
  loadingSpinner.classList.remove('hidden');
  setTimeout(() => {
    const patientId = patientIdInput.value.trim() || 'ABHA: 45-6789-1234';
    const summary = generateClinicalSummary('Ramesh Kumar', patientId);
    renderSummaryUI(summary);
    loadingSpinner.classList.add('hidden');
    // store for offline sync simulation
    localStorage.setItem('lastClinicalData', JSON.stringify(summary));
    if (!navigator.onLine) {
      offlineMsgSpan.innerHTML = "📴 Offline mode • data saved locally • click Sync when online";
    } else {
      offlineMsgSpan.innerHTML = "🟢 Online • auto-synced";
    }
    showToast('✅ AI summary generated from prescription data', '#2c6e4f');
  }, 1200);
}

// ======================== File Upload & Drag & Drop ========================
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) {
    const file = e.target.files[0];
    fileNameDisplay.innerText = `📄 ${file.name}`;
    processMockAI(file);
  }
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = '#e0f0e6';
});
uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.backgroundColor = '';
});
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = '';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    fileNameDisplay.innerText = `📄 ${file.name}`;
    processMockAI(file);
  } else {
    showToast('Please drop an image file', '#c0392b');
  }
});

// ======================== Demo Button ========================
demoBtn.addEventListener('click', () => processMockAI());

// ======================== Print Summary ========================
printBtn.addEventListener('click', () => {
  const printContents = summaryContainer.innerHTML;
  const win = window.open('', '', 'width=800,height=600');
  win.document.write(`
    <html><head><title>Clinical Summary</title><link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></head>
    <body style="font-family:Inter; padding:2rem;">${printContents}</body></html>
  `);
  win.document.close();
  win.print();
});

// ======================== Offline / Sync Simulation ========================
function updateOnlineStatus() {
  if (navigator.onLine) {
    onlineStatusSpan.innerText = 'Online';
    offlineMsgSpan.innerHTML = '🟢 Online mode • auto-sync';
    // try sync pending
    const pending = localStorage.getItem('pendingSync');
    if (pending) {
      showToast('🔄 Syncing offline data to cloud...', '#1f5e3f');
      localStorage.removeItem('pendingSync');
      setTimeout(() => showToast('✅ Sync complete', '#1f5e3f'), 800);
    }
  } else {
    onlineStatusSpan.innerText = 'Offline';
    offlineMsgSpan.innerHTML = '📴 Offline • data stored locally • will sync later';
    // store current summary as pending if exists
    const currentSummary = summaryContainer.innerText;
    if (currentSummary && !currentSummary.includes('Upload a prescription')) {
      localStorage.setItem('pendingSync', 'true');
    }
  }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

syncNowBtn.addEventListener('click', () => {
  if (navigator.onLine) {
    const pending = localStorage.getItem('pendingSync');
    if (pending) {
      localStorage.removeItem('pendingSync');
      showToast('☁️ Manual sync completed', '#1f5e3f');
      updateOnlineStatus();
    } else showToast('No pending offline data', '#6c757d');
  } else {
    showToast('No internet connection', '#c0392b');
  }
});

// ======================== Voice Input ========================
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceBtn.addEventListener('click', () => {
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      patientIdInput.value = transcript;
      showToast(`🎤 Voice input: ${transcript}`, '#2c6e4f');
    };
    recognition.onerror = () => showToast('Mic error', '#c0392b');
  });
} else {
  voiceBtn.disabled = true;
  voiceBtn.title = 'Voice not supported';
}

// ======================== Theme Toggle ========================
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
themeToggle.addEventListener('click', () => {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// ======================== Recent Patients (Mock Continuity) ========================
const mockPatients = [
  { name: 'Sunita Devi', id: 'ABHA: 98-7654-3210', lastVisit: '20 Mar 2025' },
  { name: 'Mohan Singh', id: '+91 9876543210', lastVisit: '15 Mar 2025' },
  { name: 'Geeta Kumari', id: 'ABHA: 12-3456-7890', lastVisit: '10 Mar 2025' }
];
function renderRecentPatients() {
  recentPatientsList.innerHTML = mockPatients.map(p => `
    <div class="patient-item">
      <span><i class="fas fa-user"></i> ${p.name}</span>
      <span>${p.id}</span>
      <span><i class="fas fa-calendar-alt"></i> ${p.lastVisit}</span>
    </div>
  `).join('');
}
renderRecentPatients();
loadPatientBtn.addEventListener('click', () => {
  const randomPatient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
  patientIdInput.value = randomPatient.id;
  showToast(`Loaded patient: ${randomPatient.name}`, '#1f5e3f');
  processMockAI(); // regenerate summary for new patient
});

// ======================== Charts (Glucose & BP) ========================
let glucoseChart, bpChart;
function initCharts() {
  const ctxGlucose = document.getElementById('glucoseChart').getContext('2d');
  const ctxBP = document.getElementById('bpChart').getContext('2d');
  glucoseChart = new Chart(ctxGlucose, {
    type: 'line',
    data: { labels: ['Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25'], datasets: [{ label: 'Fasting Glucose (mg/dL)', data: [128, 135, 148, 158, 162], borderColor: '#c0392b', backgroundColor: '#c0392b20', tension: 0.3, fill: true }] },
    options: { responsive: true, maintainAspectRatio: true }
  });
  bpChart = new Chart(ctxBP, {
    type: 'line',
    data: { labels: ['Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25'], datasets: [{ label: 'Systolic BP (mmHg)', data: [138, 142, 145, 148, 152], borderColor: '#e67e22', backgroundColor: '#e67e2220', tension: 0.3, fill: true }] },
    options: { responsive: true, maintainAspectRatio: true }
  });
}
initCharts();

// ======================== Initial Load ========================
processMockAI(); // show default summary on load
