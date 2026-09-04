// ===================================================
// SCHOOL MANAGEMENT SYSTEM - SCRIPT (LOCAL STORAGE)
// ===================================================

// Default Sample Data
const DEFAULT_STUDENTS = [
  { id: 101, name: 'Alice Walker', class: 'Grade 10', email: 'alice@school.edu', phone: '9876543210' },
  { id: 102, name: 'Bob Smith', class: 'Grade 10', email: 'bob@school.edu', phone: '9876543211' },
  { id: 103, name: 'Charlie Brown', class: 'Grade 9', email: 'charlie@school.edu', phone: '9876543212' },
  { id: 104, name: 'Diana Prince', class: 'Grade 11', email: 'diana@school.edu', phone: '9876543213' }
];

const DEFAULT_TEACHERS = [
  { id: 1, name: 'Dr. Robert Davis', subject: 'Mathematics', email: 'robert.davis@school.edu' },
  { id: 2, name: 'Prof. Sarah Jenkins', subject: 'Physics', email: 'sarah.j@school.edu' },
  { id: 3, name: 'Mr. James Wilson', subject: 'English', email: 'james.w@school.edu' }
];

const DEFAULT_CLASSES = [
  { id: 1, class_name: 'Grade 10', section: 'A', teacher: 'Dr. Robert Davis' },
  { id: 2, class_name: 'Grade 9', section: 'B', teacher: 'Prof. Sarah Jenkins' },
  { id: 3, class_name: 'Grade 11', section: 'A', teacher: 'Mr. James Wilson' }
];

const DEFAULT_NOTICES = [
  { id: 1, title: 'Annual Sports Meet', date: '2026-09-10', description: 'Annual sports competition starts next Monday on the school grounds.' },
  { id: 2, title: 'Mid-Term Exam Schedule', date: '2026-09-15', description: 'Mid-term examinations will begin from September 25th. Check notice board.' }
];

// Data state variables
let students = [];
let teachers = [];
let classes = [];
let notices = [];

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initAuth();
  initNavigation();
  initModals();
  initForms();
  initSearch();
});

// Load from localStorage or initialize with sample data
function loadData() {
  students = JSON.parse(localStorage.getItem('sms_students')) || DEFAULT_STUDENTS;
  teachers = JSON.parse(localStorage.getItem('sms_teachers')) || DEFAULT_TEACHERS;
  classes = JSON.parse(localStorage.getItem('sms_classes')) || DEFAULT_CLASSES;
  notices = JSON.parse(localStorage.getItem('sms_notices')) || DEFAULT_NOTICES;
  saveData();
}

// Save to localStorage
function saveData() {
  localStorage.setItem('sms_students', JSON.stringify(students));
  localStorage.setItem('sms_teachers', JSON.stringify(teachers));
  localStorage.setItem('sms_classes', JSON.stringify(classes));
  localStorage.setItem('sms_notices', JSON.stringify(notices));
}

// ===================================================
// TOAST NOTIFICATIONS
// ===================================================
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

// ===================================================
// AUTHENTICATION & LOGIN
// ===================================================
function initAuth() {
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const loginContainer = document.getElementById('login-container');
  const appContainer = document.getElementById('app-container');

  // Check login state
  if (sessionStorage.getItem('sms_logged_in') === 'true') {
    loginContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    renderDashboard();
  }

  // Handle Login Submit
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === 'admin' && password === 'admin123') {
      sessionStorage.setItem('sms_logged_in', 'true');
      loginContainer.classList.add('hidden');
      appContainer.classList.remove('hidden');
      showToast('Welcome back, Admin!');
      renderDashboard();
    } else {
      showToast('Invalid username or password!', 'error');
    }
  });

  // Handle Logout
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('sms_logged_in');
    appContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    loginForm.reset();
    showToast('Logged out successfully');
  });
}

// ===================================================
// NAVIGATION & TABS
// ===================================================
function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');

  const titles = {
    dashboard: 'Dashboard',
    students: 'Student Management',
    teachers: 'Teacher Directory',
    classes: 'Class & Section Management',
    notices: 'Notice Board'
  };

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(tab => {
        tab.classList.remove('active');
        if (tab.id === `tab-${targetTab}`) {
          tab.classList.add('active');
        }
      });

      pageTitle.textContent = titles[targetTab] || 'Dashboard';

      if (targetTab === 'dashboard') renderDashboard();
      if (targetTab === 'students') renderStudents();
      if (targetTab === 'teachers') renderTeachers();
      if (targetTab === 'classes') renderClasses();
      if (targetTab === 'notices') renderNotices();
    });
  });
}

// ===================================================
// MODAL CONTROLS
// ===================================================
function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function initModals() {
  document.getElementById('btn-add-student').addEventListener('click', () => {
    document.getElementById('student-modal-title').textContent = 'Add Student';
    document.getElementById('student-form').reset();
    document.getElementById('student-id').value = '';
    openModal('student-modal');
  });

  document.getElementById('btn-add-teacher').addEventListener('click', () => {
    document.getElementById('teacher-modal-title').textContent = 'Add Teacher';
    document.getElementById('teacher-form').reset();
    document.getElementById('teacher-id').value = '';
    openModal('teacher-modal');
  });

  document.getElementById('btn-add-class').addEventListener('click', () => {
    document.getElementById('class-modal-title').textContent = 'Add Class';
    document.getElementById('class-form').reset();
    document.getElementById('class-id').value = '';
    openModal('class-modal');
  });

  document.getElementById('btn-add-notice').addEventListener('click', () => {
    document.getElementById('notice-form').reset();
    document.getElementById('notice-date').value = new Date().toISOString().split('T')[0];
    openModal('notice-modal');
  });
}

// ===================================================
// FORM SUBMISSIONS (ADD & EDIT)
// ===================================================
function initForms() {
  // 1. Student Form
  document.getElementById('student-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('student-id').value;
    const name = document.getElementById('student-name').value.trim();
    const className = document.getElementById('student-class').value.trim();
    const email = document.getElementById('student-email').value.trim();
    const phone = document.getElementById('student-phone').value.trim();

    if (id) {
      // Edit
      const index = students.findIndex(s => s.id == id);
      if (index !== -1) {
        students[index] = { id: Number(id), name, class: className, email, phone };
        showToast('Student updated successfully');
      }
    } else {
      // Add
      const nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 101;
      students.unshift({ id: nextId, name, class: className, email, phone });
      showToast('Student added successfully');
    }

    saveData();
    closeModal('student-modal');
    renderStudents();
  });

  // 2. Teacher Form
  document.getElementById('teacher-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('teacher-id').value;
    const name = document.getElementById('teacher-name').value.trim();
    const subject = document.getElementById('teacher-subject').value.trim();
    const email = document.getElementById('teacher-email').value.trim();

    if (id) {
      // Edit
      const index = teachers.findIndex(t => t.id == id);
      if (index !== -1) {
        teachers[index] = { id: Number(id), name, subject, email };
        showToast('Teacher updated successfully');
      }
    } else {
      // Add
      const nextId = teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1;
      teachers.unshift({ id: nextId, name, subject, email });
      showToast('Teacher added successfully');
    }

    saveData();
    closeModal('teacher-modal');
    renderTeachers();
  });

  // 3. Class Form
  document.getElementById('class-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('class-id').value;
    const className = document.getElementById('class-name').value.trim();
    const section = document.getElementById('class-section').value.trim();
    const teacher = document.getElementById('class-teacher').value.trim();

    if (id) {
      // Edit
      const index = classes.findIndex(c => c.id == id);
      if (index !== -1) {
        classes[index] = { id: Number(id), class_name: className, section, teacher };
        showToast('Class updated successfully');
      }
    } else {
      // Add
      const nextId = classes.length > 0 ? Math.max(...classes.map(c => c.id)) + 1 : 1;
      classes.unshift({ id: nextId, class_name: className, section, teacher });
      showToast('Class added successfully');
    }

    saveData();
    closeModal('class-modal');
    renderClasses();
  });

  // 4. Notice Form
  document.getElementById('notice-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('notice-title').value.trim();
    const date = document.getElementById('notice-date').value;
    const description = document.getElementById('notice-description').value.trim();

    const nextId = notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1;
    notices.unshift({ id: nextId, title, date, description });
    showToast('Notice posted successfully');

    saveData();
    closeModal('notice-modal');
    renderNotices();
  });
}

// ===================================================
// DASHBOARD
// ===================================================
function renderDashboard() {
  document.getElementById('stat-students').textContent = students.length;
  document.getElementById('stat-teachers').textContent = teachers.length;
  document.getElementById('stat-classes').textContent = classes.length;
  document.getElementById('stat-notices').textContent = notices.length;

  const noticesContainer = document.getElementById('dashboard-notices-list');
  if (notices.length > 0) {
    noticesContainer.innerHTML = notices.slice(0, 3).map(n => `
      <div class="recent-notice-item">
        <h4>${escapeHtml(n.title)}</h4>
        <p>${escapeHtml(n.description)}</p>
        <div class="recent-notice-date">📅 ${escapeHtml(n.date)}</div>
      </div>
    `).join('');
  } else {
    noticesContainer.innerHTML = '<p style="color: #64748b; font-style: italic;">No notices available.</p>';
  }
}

// ===================================================
// STUDENTS SECTION
// ===================================================
function initSearch() {
  const searchInput = document.getElementById('student-search-input');
  const searchBtn = document.getElementById('student-search-btn');
  const resetBtn = document.getElementById('student-reset-btn');

  searchBtn.addEventListener('click', () => {
    renderStudents(searchInput.value.trim());
  });

  searchInput.addEventListener('input', () => {
    renderStudents(searchInput.value.trim());
  });

  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    renderStudents();
  });
}

function renderStudents(query = '') {
  const tbody = document.getElementById('students-table-body');
  let list = students;

  if (query) {
    const q = query.toLowerCase();
    list = students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.class.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.phone && s.phone.toLowerCase().includes(q))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">No students found.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(s => `
    <tr>
      <td><strong>#${s.id}</strong></td>
      <td>${escapeHtml(s.name)}</td>
      <td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-weight: 500;">${escapeHtml(s.class)}</span></td>
      <td>${escapeHtml(s.email)}</td>
      <td>${escapeHtml(s.phone)}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="editStudent(${s.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteStudent(${s.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editStudent(id) {
  const s = students.find(item => item.id === id);
  if (!s) return;

  document.getElementById('student-modal-title').textContent = 'Edit Student';
  document.getElementById('student-id').value = s.id;
  document.getElementById('student-name').value = s.name;
  document.getElementById('student-class').value = s.class;
  document.getElementById('student-email').value = s.email;
  document.getElementById('student-phone').value = s.phone;

  openModal('student-modal');
}

function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;
  students = students.filter(s => s.id !== id);
  saveData();
  showToast('Student deleted successfully');
  renderStudents();
}

// ===================================================
// TEACHERS SECTION
// ===================================================
function renderTeachers() {
  const tbody = document.getElementById('teachers-table-body');

  if (teachers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">No teachers found.</td></tr>';
    return;
  }

  tbody.innerHTML = teachers.map(t => `
    <tr>
      <td><strong>#${t.id}</strong></td>
      <td>${escapeHtml(t.name)}</td>
      <td><span style="background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 4px; font-weight: 500;">${escapeHtml(t.subject)}</span></td>
      <td>${escapeHtml(t.email)}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="editTeacher(${t.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTeacher(${t.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editTeacher(id) {
  const t = teachers.find(item => item.id === id);
  if (!t) return;

  document.getElementById('teacher-modal-title').textContent = 'Edit Teacher';
  document.getElementById('teacher-id').value = t.id;
  document.getElementById('teacher-name').value = t.name;
  document.getElementById('teacher-subject').value = t.subject;
  document.getElementById('teacher-email').value = t.email;

  openModal('teacher-modal');
}

function deleteTeacher(id) {
  if (!confirm('Are you sure you want to delete this teacher?')) return;
  teachers = teachers.filter(t => t.id !== id);
  saveData();
  showToast('Teacher deleted successfully');
  renderTeachers();
}

// ===================================================
// CLASSES SECTION
// ===================================================
function renderClasses() {
  const tbody = document.getElementById('classes-table-body');

  if (classes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-cell">No classes found.</td></tr>';
    return;
  }

  tbody.innerHTML = classes.map(c => `
    <tr>
      <td>${escapeHtml(c.class_name)}</td>
      <td><span style="background: #f3e8ff; color: #7e22ce; padding: 2px 8px; border-radius: 4px; font-weight: 500;">Section ${escapeHtml(c.section)}</span></td>
      <td>${escapeHtml(c.teacher)}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="editClass(${c.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteClass(${c.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editClass(id) {
  const c = classes.find(item => item.id === id);
  if (!c) return;

  document.getElementById('class-modal-title').textContent = 'Edit Class';
  document.getElementById('class-id').value = c.id;
  document.getElementById('class-name').value = c.class_name;
  document.getElementById('class-section').value = c.section;
  document.getElementById('class-teacher').value = c.teacher;

  openModal('class-modal');
}

function deleteClass(id) {
  if (!confirm('Are you sure you want to delete this class?')) return;
  classes = classes.filter(c => c.id !== id);
  saveData();
  showToast('Class deleted successfully');
  renderClasses();
}

// ===================================================
// NOTICES SECTION
// ===================================================
function renderNotices() {
  const container = document.getElementById('notices-grid');

  if (notices.length === 0) {
    container.innerHTML = '<p class="empty-cell" style="grid-column: 1/-1;">No notices posted yet.</p>';
    return;
  }

  container.innerHTML = notices.map(n => `
    <div class="notice-card">
      <div class="notice-card-header">
        <h3>${escapeHtml(n.title)}</h3>
        <span class="notice-date-badge">📅 ${escapeHtml(n.date)}</span>
      </div>
      <div class="notice-card-body">
        ${escapeHtml(n.description)}
      </div>
      <div class="notice-card-footer">
        <button class="btn btn-danger btn-sm" onclick="deleteNotice(${n.id})">Delete Notice</button>
      </div>
    </div>
  `).join('');
}

function deleteNotice(id) {
  if (!confirm('Are you sure you want to delete this notice?')) return;
  notices = notices.filter(n => n.id !== id);
  saveData();
  showToast('Notice deleted successfully');
  renderNotices();
}

// ===================================================
// UTILITY: ESCAPE HTML
// ===================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
