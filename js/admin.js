/**
 * ==============================================================================
 * ADMIN MANAGEMENT CONTROLLER (js/admin.js)
 * ==============================================================================
 * Course: Web Application Development (Bahria University Karachi Campus)
 * Purpose: Allows the Administrator to:
 * 1. View all transactions logged across ALL users in the system
 * 2. Filter transactions by individual student
 * 3. Manage student user accounts (change roles, add/delete users)
 * 4. Audit categories
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  renderAdminOverview();
  initAdminUserFilter();
  renderAdminTransactions();
  renderAdminUsers();
  renderAdminCategories();

  // Admin User Filter change listener
  const userFilter = document.getElementById('adminUserFilter');
  if (userFilter) {
    userFilter.addEventListener('change', () => {
      renderAdminTransactions();
    });
  }

  // Add User Modal
  const addUserBtn = document.getElementById('btnAddUserModalBtn');
  const modal = document.getElementById('addUserModal');
  if (addUserBtn && modal) {
    addUserBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  // Create User Form Submit
  const form = document.getElementById('adminAddUserForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('admUserName').value.trim();
      const email = document.getElementById('admUserEmail').value.trim();
      const role = document.getElementById('admUserRole').value;
      const password = document.getElementById('admUserPassword').value;

      if (!name || !email) {
        showToast('Please enter both name and email', 'error');
        return;
      }

      const existing = window.store.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        showToast('A user with this email already exists', 'error');
        return;
      }

      window.store.addUser({
        id: 'usr_' + Date.now(),
        name,
        email,
        role,
        password,
        joined: new Date().toISOString().split('T')[0]
      });

      showToast('Student user created successfully!', 'success');
      modal.classList.remove('active');
      form.reset();

      renderAdminOverview();
      initAdminUserFilter();
      renderAdminUsers();
    });
  }
});

// ------------------------------------------------------------------------------
// 1. OVERVIEW STATS (Global across entire platform)
// ------------------------------------------------------------------------------
function renderAdminOverview() {
  const users = window.store.getUsers();
  // Fetch ALL transactions across all users
  const allTxns = window.store.getTransactions(true);
  const categories = window.store.getCategories();

  const totalInflow = allTxns
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  document.getElementById('adminTotalUsers').textContent = users.length;
  document.getElementById('adminTotalTxns').textContent = allTxns.length;
  document.getElementById('adminTotalCats').textContent = categories.length;
  document.getElementById('adminGrossVolume').textContent = window.store.formatCurrency(totalInflow);
}

// ------------------------------------------------------------------------------
// 2. USER FILTER (Populate dropdown with all registered students)
// ------------------------------------------------------------------------------
function initAdminUserFilter() {
  const select = document.getElementById('adminUserFilter');
  if (!select || !window.store) return;

  const users = window.store.getUsers().filter(u => u.role !== 'admin');
  const currentVal = select.value;

  select.innerHTML = `<option value="all">👥 All Users (Combined)</option>` +
    users.map(u => `<option value="${u.id}">👤 ${escapeHTML(u.name)} (${escapeHTML(u.email)})</option>`).join('');

  if (currentVal) select.value = currentVal;
}

// ------------------------------------------------------------------------------
// 3. RENDER ALL TRANSACTIONS ACROSS ALL USERS
// ------------------------------------------------------------------------------
function renderAdminTransactions() {
  const tbody = document.getElementById('adminTransactionsTableBody');
  if (!tbody) return;

  const selectedUserId = document.getElementById('adminUserFilter')?.value || 'all';

  // Force fetch all transactions across the entire system
  let txns = window.store.getTransactions(true);

  // If a specific student is selected in the filter
  if (selectedUserId !== 'all') {
    txns = txns.filter(t => t.userId === selectedUserId);
  }

  if (txns.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No transactions recorded for this user.</td></tr>`;
    return;
  }

  tbody.innerHTML = txns.map(t => {
    const isIncome = t.type === 'income';
    const userName = t.userName || 'Student User';

    return `
      <tr>
        <td style="font-family:monospace; font-size:0.75rem; color:var(--text-muted);">${t.id}</td>
        <td>
          <span class="user-pill">
            <span>👤</span>
            <span>${escapeHTML(userName)}</span>
          </span>
        </td>
        <td style="font-size:0.85rem; color:var(--text-muted);">${t.date}</td>
        <td style="font-weight:600;">${escapeHTML(t.description)}</td>
        <td><span class="badge" style="background:var(--bg-card-subtle);">${escapeHTML(t.category)}</span></td>
        <td><span class="badge ${isIncome ? 'badge-income' : 'badge-expense'}">${t.type}</span></td>
        <td class="font-bold ${isIncome ? 'text-income' : 'text-expense'}">
          ${isIncome ? '+' : '-'}${window.store.formatCurrency(t.amount)}
        </td>
        <td style="text-align:right;">
          <button class="btn btn-danger btn-sm" onclick="adminDeleteTxn('${t.id}')" title="Delete record">
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ------------------------------------------------------------------------------
// 4. MANAGE USERS TABLE
// ------------------------------------------------------------------------------
function renderAdminUsers() {
  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;

  const users = window.store.getUsers();
  const current = window.store.getCurrentUser();

  tbody.innerHTML = users.map(u => {
    const isAdmin = u.role === 'admin';
    const isSelf = current && current.id === u.id;

    return `
      <tr>
        <td style="font-family:monospace; font-size:0.8rem; color:var(--text-muted);">${u.id}</td>
        <td style="font-weight:600;">${escapeHTML(u.name)}</td>
        <td>${escapeHTML(u.email)}</td>
        <td>
          <span class="badge ${isAdmin ? 'badge-primary' : 'badge-income'}">
            ${isAdmin ? '🛡️ Administrator' : '👤 Student'}
          </span>
        </td>
        <td style="font-size:0.85rem; color:var(--text-muted);">${u.joined || '2025-04-01'}</td>
        <td style="text-align:right;">
          ${!isSelf ? `
            <button class="btn btn-secondary btn-sm" onclick="toggleUserRole('${u.id}')">
              Make ${isAdmin ? 'User' : 'Admin'}
            </button>
            <button class="btn btn-danger btn-sm" onclick="removeUserAdmin('${u.id}', '${escapeHTML(u.name)}')">
              Remove
            </button>
          ` : `<span class="badge badge-warning">Current Session</span>`}
        </td>
      </tr>
    `;
  }).join('');
}

// ------------------------------------------------------------------------------
// 5. MANAGE CATEGORIES TABLE
// ------------------------------------------------------------------------------
function renderAdminCategories() {
  const tbody = document.getElementById('adminCategoriesTableBody');
  if (!tbody) return;

  const categories = window.store.getCategories();

  tbody.innerHTML = categories.map(c => {
    return `
      <tr>
        <td style="font-weight:600;">${c.icon || ''} ${escapeHTML(c.name)}</td>
        <td>
          <span class="badge ${c.type === 'expense' ? 'badge-expense' : 'badge-income'}">
            ${c.type.toUpperCase()}
          </span>
        </td>
        <td style="font-size:1.2rem;">${c.icon || '🏷️'}</td>
        <td>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="display:inline-block; width:14px; height:14px; border-radius:50%; background:${c.color};"></span>
            <code>${c.color}</code>
          </div>
        </td>
        <td style="text-align:right;">
          <a href="categories.html" class="btn btn-secondary btn-sm">Edit in Manager</a>
        </td>
      </tr>
    `;
  }).join('');
}

// ------------------------------------------------------------------------------
// TAB SWITCHING & ACTIONS
// ------------------------------------------------------------------------------
window.switchAdminTab = function(tabName) {
  const sections = {
    transactions: document.getElementById('sectionTransactions'),
    users: document.getElementById('sectionUsers'),
    categories: document.getElementById('sectionCategories')
  };

  const navs = {
    transactions: document.getElementById('navTabTransactions'),
    users: document.getElementById('navTabUsers'),
    categories: document.getElementById('navTabCategories')
  };

  Object.keys(sections).forEach(k => {
    if (sections[k]) sections[k].style.display = k === tabName ? 'block' : 'none';
    if (navs[k]) navs[k].classList.toggle('active', k === tabName);
  });
};

window.toggleUserRole = function(id) {
  const users = window.store.getUsers();
  const u = users.find(x => x.id === id);
  if (!u) return;

  const newRole = u.role === 'admin' ? 'user' : 'admin';
  window.store.updateUser(id, { role: newRole });
  showToast(`Updated ${u.name}'s role to ${newRole}`, 'info');
  renderAdminUsers();
};

window.removeUserAdmin = function(id, name) {
  if (confirm(`Are you sure you want to delete user ${name}?`)) {
    window.store.deleteUser(id);
    showToast('User removed from system', 'success');
    renderAdminOverview();
    initAdminUserFilter();
    renderAdminUsers();
    renderAdminTransactions();
  }
};

window.adminDeleteTxn = function(id) {
  if (confirm('Delete this transaction record?')) {
    window.store.deleteTransaction(id);
    showToast('Transaction record deleted by admin', 'success');
    renderAdminOverview();
    renderAdminTransactions();
  }
};

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}
