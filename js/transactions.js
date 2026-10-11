/**
 * ==============================================================================
 * TRANSACTIONS PAGE CONTROLLER (js/transactions.js)
 * ==============================================================================
 * Course: Web Application Development (Bahria University Karachi Campus)
 * Purpose:
 * 1. Filter transactions by keyword search, category, and type.
 * 2. Display all user transactions in a clean table with Edit & Delete actions.
 * 3. Export transaction table records to downloadable CSV file.
 * ==============================================================================
 */

let userTransactions = [];

document.addEventListener('DOMContentLoaded', () => {
  // Step 1: Initialize category dropdown options
  initCategoryFilterOptions();

  // Step 2: Load user transactions and render table
  loadAndFilterTransactions();

  // Step 3: Setup event listeners for search and filter inputs
  const searchInput = document.getElementById('searchDescription');
  const catFilter = document.getElementById('filterCategory');
  const typeFilter = document.getElementById('filterType');
  const clearBtn = document.getElementById('btnClearFilters');
  const addBtn = document.getElementById('btnAddTxnBtn');
  const exportBtn = document.getElementById('btnExportCSV');

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (catFilter) catFilter.addEventListener('change', applyFilters);
  if (typeFilter) typeFilter.addEventListener('change', applyFilters);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      catFilter.value = '';
      typeFilter.value = '';
      applyFilters();
    });
  }

  if (addBtn) addBtn.addEventListener('click', () => openTransactionModal());
  if (exportBtn) exportBtn.addEventListener('click', exportToCSV);

  // Listen for storage changes from the modal popup
  window.addEventListener('transactionDataChanged', () => {
    loadAndFilterTransactions();
  });
});

/**
 * Populates the category filter dropdown from the categories database
 */
function initCategoryFilterOptions() {
  const catSelect = document.getElementById('filterCategory');
  if (!catSelect || !window.store) return;

  const categories = window.store.getCategories();
  catSelect.innerHTML = `<option value="">All Categories</option>` + 
    categories.map(c => `<option value="${c.name}">${c.icon || ''} ${c.name}</option>`).join('');
}

/**
 * Loads current user's transactions from LocalStorage
 */
function loadAndFilterTransactions() {
  userTransactions = window.store.getTransactions();
  applyFilters();
}

/**
 * Applies search text, category filter, and type filter
 */
function applyFilters() {
  const searchKeyword = (document.getElementById('searchDescription')?.value || '').toLowerCase().trim();
  const selectedCategory = document.getElementById('filterCategory')?.value || '';
  const selectedType = document.getElementById('filterType')?.value || '';

  const filtered = userTransactions.filter(txn => {
    // 1. Keyword search (matches description or category name)
    const matchesKeyword = !searchKeyword || 
      (txn.description || '').toLowerCase().includes(searchKeyword) ||
      (txn.category || '').toLowerCase().includes(searchKeyword);

    // 2. Category match
    const matchesCategory = !selectedCategory || txn.category === selectedCategory;

    // 3. Type match (income or expense)
    const matchesType = !selectedType || txn.type === selectedType;

    return matchesKeyword && matchesCategory && matchesType;
  });

  renderTableRows(filtered);
}

/**
 * Generates table HTML rows
 */
function renderTableRows(txns) {
  const tbody = document.getElementById('transactionsTableBody');
  const countEl = document.getElementById('recordsCount');
  if (!tbody) return;

  if (countEl) {
    countEl.textContent = `Showing ${txns.length} of ${userTransactions.length} records`;
  }

  if (txns.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div>No transactions found matching your current filter criteria.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = txns.map(txn => {
    const isIncome = txn.type === 'income';
    const sign = isIncome ? '+' : '-';
    const amountColorClass = isIncome ? 'text-income' : 'text-expense';
    const badgeClass = isIncome ? 'badge-income' : 'badge-expense';

    return `
      <tr>
        <td style="font-size:0.85rem; color:var(--text-muted);">${formatDate(txn.date)}</td>
        <td style="font-weight:600;">${escapeHTML(txn.description)}</td>
        <td>
          <span class="badge" style="background:var(--bg-card-subtle); border:1px solid var(--border-color);">
            ${escapeHTML(txn.category)}
          </span>
        </td>
        <td class="font-bold ${amountColorClass}">
          ${sign}${window.store.formatCurrency(txn.amount)}
        </td>
        <td>
          <span class="badge ${badgeClass}">${txn.type.toUpperCase()}</span>
        </td>
        <td style="text-align:right;">
          <button class="btn btn-secondary btn-sm" onclick="editTxn('${txn.id}')" title="Edit">
            ✏️ Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteTxn('${txn.id}')" title="Delete">
            🗑️ Del
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ------------------------------------------------------------------------------
// EDIT & DELETE ACTIONS
// ------------------------------------------------------------------------------
window.editTxn = function(id) {
  const txn = userTransactions.find(t => t.id === id);
  if (txn) {
    openTransactionModal(txn);
  }
};

window.deleteTxn = function(id) {
  const confirmDelete = confirm('Are you sure you want to delete this transaction record?');
  if (confirmDelete) {
    window.store.deleteTransaction(id);
    showToast('Transaction deleted successfully', 'success');
    loadAndFilterTransactions();
  }
};

// ------------------------------------------------------------------------------
// EXPORT TO CSV FEATURE
// ------------------------------------------------------------------------------
function exportToCSV() {
  if (userTransactions.length === 0) {
    showToast('No transaction data to export!', 'error');
    return;
  }

  // Define CSV header columns
  const csvHeaders = ['Transaction ID', 'Date', 'Type', 'Category', 'Amount', 'Description'];

  // Map transactions to CSV rows
  const csvRows = userTransactions.map(t => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.type}"`,
    `"${t.category}"`,
    `"${t.amount}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`
  ]);

  // Build CSV file content string
  const csvString = 'data:text/csv;charset=utf-8,' + 
    [csvHeaders.join(','), ...csvRows.map(r => r.join(','))].join('\n');

  // Trigger browser download
  const encodedUri = encodeURI(csvString);
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', encodedUri);
  downloadLink.setAttribute('download', `Expense_Report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  showToast('Downloaded transactions CSV report!', 'success');
}

// ------------------------------------------------------------------------------
// FORMATTING HELPERS
// ------------------------------------------------------------------------------
function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}
