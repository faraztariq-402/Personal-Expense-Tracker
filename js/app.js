/**
 * ==============================================================================
 * GLOBAL APPLICATION CONTROLLER (js/app.js)
 * ==============================================================================
 * Course: Web Application Development (Bahria University Karachi Campus)
 * Handles:
 * 1. Authentication & Protected Page Session Check
 * 2. Real Logout Flow (Clears session -> redirects to login.html)
 * 3. Dark & Light Theme Switcher
 * 4. Mobile Sidebar Navigation Toggle
 * 5. Universal Add/Edit Transaction Modal
 * 6. Toast Alerts
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Check if user is logged in for protected dashboard pages
  checkPageAuth();

  // 2. Initialize UI components
  initTheme();
  initSidebar();
  initHeaderProfile();
  initLogoutButtons();
  initTransactionModal();
});

// ------------------------------------------------------------------------------
// 1. AUTHENTICATION & ACCESS CONTROL FLOW
// ------------------------------------------------------------------------------
function checkPageAuth() {
  const currentPath = window.location.pathname.toLowerCase();
  const publicPages = ['index.html', 'login.html', 'register.html', ''];
  const isPublic = publicPages.some(page => currentPath.endsWith(page));

  const currentUser = window.store ? window.store.getCurrentUser() : null;

  // If user visits a protected dashboard page without logging in, redirect to login!
  if (!isPublic && !currentUser) {
    alert('Please log in first to access your expense tracker account.');
    window.location.href = 'login.html';
    return;
  }

  // If a regular user visits admin.html, inform them
  if (currentPath.endsWith('admin.html') && currentUser && currentUser.role !== 'admin') {
    showToast('Viewing Admin Portal in Demonstration Mode', 'info');
  }
}

// ------------------------------------------------------------------------------
// 2. LOGOUT FLOW (Clear session from LocalStorage & redirect)
// ------------------------------------------------------------------------------
function initLogoutButtons() {
  const logoutLinks = document.querySelectorAll('.logout-trigger');

  logoutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const confirmLogout = confirm('Are you sure you want to log out of your account?');
      if (confirmLogout) {
        // Step 1: Clear current logged-in user from storage
        window.store.setCurrentUser(null);

        // Step 2: Show confirmation toast
        showToast('Logged out successfully! Redirecting...', 'info');

        // Step 3: Redirect to login page
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 500);
      }
    });
  });
}

// ------------------------------------------------------------------------------
// 3. HEADER PROFILE DETAILS (Display current student/admin name)
// ------------------------------------------------------------------------------
function initHeaderProfile() {
  const user = window.store ? window.store.getCurrentUser() : null;
  if (!user) return;

  const nameEl = document.getElementById('headerUserName');
  const emailEl = document.getElementById('headerUserEmail');
  const avatarEl = document.getElementById('headerUserAvatar');

  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (avatarEl) {
    const initials = user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    avatarEl.textContent = initials;
  }
}

// ------------------------------------------------------------------------------
// 4. THEME SWITCHER (Dark & Light Mode)
// ------------------------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem('pet_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonIcon(savedTheme);

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('pet_theme', newTheme);
      updateThemeButtonIcon(newTheme);

      showToast(`Switched to ${newTheme} mode`, 'info');
      window.dispatchEvent(new Event('themeChanged'));
    });
  }
}

function updateThemeButtonIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  btn.innerHTML = theme === 'dark' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}

// ------------------------------------------------------------------------------
// 5. MOBILE SIDEBAR MENU TOGGLE
// ------------------------------------------------------------------------------
function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.querySelector('.sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });
  }
}

// ------------------------------------------------------------------------------
// 6. UNIVERSAL ADD / EDIT TRANSACTION MODAL
// ------------------------------------------------------------------------------
function initTransactionModal() {
  // Close buttons
  const closeButtons = document.querySelectorAll('.modal-close, [data-modal-close]');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  // Modal form submit
  const form = document.getElementById('transactionForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Read form input values
      const id = document.getElementById('txnId').value;
      const type = document.getElementById('txnType').value;
      const category = document.getElementById('txnCategory').value;
      const amount = parseFloat(document.getElementById('txnAmount').value);
      const date = document.getElementById('txnDate').value;
      const description = document.getElementById('txnDescription').value.trim();

      // Simple Form Validation
      if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount greater than 0', 'error');
        return;
      }
      if (!date) {
        showToast('Please select a valid date', 'error');
        return;
      }

      // Save or Update in LocalStorage
      if (id) {
        window.store.updateTransaction(id, { type, category, amount, date, description });
        showToast('Transaction updated successfully!', 'success');
      } else {
        window.store.addTransaction({ type, category, amount, date, description });
        showToast('Transaction added successfully!', 'success');
      }

      // Close modal & reset form
      closeTransactionModal();
      form.reset();

      // Notify open pages (dashboard, transactions, etc.) to refresh
      window.dispatchEvent(new Event('transactionDataChanged'));
    });
  }
}

function openTransactionModal(txn = null) {
  const modal = document.getElementById('transactionModal');
  if (!modal) return;

  const title = document.getElementById('modalTxnTitle');
  const idInput = document.getElementById('txnId');
  const typeInput = document.getElementById('txnType');
  const categoryInput = document.getElementById('txnCategory');
  const amountInput = document.getElementById('txnAmount');
  const dateInput = document.getElementById('txnDate');
  const descInput = document.getElementById('txnDescription');

  // Populate category options
  if (categoryInput && window.store) {
    const cats = window.store.getCategories();
    categoryInput.innerHTML = cats.map(c => `<option value="${c.name}">${c.icon || ''} ${c.name}</option>`).join('');
  }

  // If editing an existing transaction
  if (txn) {
    if (title) title.textContent = 'Edit Transaction';
    if (idInput) idInput.value = txn.id;
    if (typeInput) typeInput.value = txn.type;
    if (categoryInput) categoryInput.value = txn.category;
    if (amountInput) amountInput.value = txn.amount;
    if (dateInput) dateInput.value = txn.date;
    if (descInput) descInput.value = txn.description || '';
  } else {
    // If adding a new transaction
    if (title) title.textContent = 'Add Transaction';
    if (idInput) idInput.value = '';
    if (typeInput) typeInput.value = 'expense';
    if (amountInput) amountInput.value = '';
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    if (descInput) descInput.value = '';
  }

  modal.classList.add('active');
}

function closeTransactionModal() {
  const modal = document.getElementById('transactionModal');
  if (modal) modal.classList.remove('active');
}

// ------------------------------------------------------------------------------
// 7. TOAST NOTIFICATION ALERTS
// ------------------------------------------------------------------------------
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  toast.innerHTML = `
    <span style="font-size:1.1rem;">${icon}</span>
    <span style="flex:1; font-size:0.875rem; font-weight:500;">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
