/**
 * ==============================================================================
 * DASHBOARD CONTROLLER (js/dashboard.js)
 * ==============================================================================
 * Course: Web Application Development (Bahria University Karachi Campus)
 * Purpose:
 * 1. Calculate & display Total Income, Total Expenses, and Remaining Balance.
 * 2. Display the 5 most recent transactions with edit/delete options.
 * 3. Render circular monthly budget utilization progress.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Step 1: Render all dashboard components on page load
  renderDashboard();

  // Step 2: Listen for updates (when a transaction is added/edited via modal)
  window.addEventListener('transactionDataChanged', () => {
    renderDashboard();
  });

  // Step 3: Wire up quick "+ Add Transaction" buttons
  const addHeaderBtn = document.getElementById('btnAddTxnHeader');
  const quickAddBtn = document.getElementById('btnQuickAddExpense');
  if (addHeaderBtn) addHeaderBtn.addEventListener('click', () => openTransactionModal());
  if (quickAddBtn) quickAddBtn.addEventListener('click', () => openTransactionModal());

  // Step 4: Demo Reset Button (restores wireframe sample numbers)
  const seedBtn = document.getElementById('btnSeedDemo');
  if (seedBtn) {
    seedBtn.addEventListener('click', () => {
      const confirmReset = confirm('Reset all transactions and categories back to proposal wireframe state?');
      if (confirmReset) {
        window.store.resetToDemo();
        showToast('Reset data back to initial proposal numbers!', 'info');
        renderDashboard();
      }
    });
  }
});

/**
 * Main render function that coordinates dashboard cards, tables, and gauges
 */
function renderDashboard() {
  // 1. Greet the logged-in user
  const user = window.store.getCurrentUser();
  if (user) {
    const greetingEl = document.getElementById('greetingUser');
    if (greetingEl) {
      greetingEl.textContent = `Welcome Back, ${user.name.split(' ')[0]}! 👋`;
    }
  }

  // 2. Calculate and display the 3 primary financial metrics
  // Matches Wireframe 4: Income $2,500, Expenses $1,200, Balance $1,300
  const summary = window.store.getFinancialSummary();

  const incomeEl = document.getElementById('statTotalIncome');
  const expenseEl = document.getElementById('statTotalExpenses');
  const balanceEl = document.getElementById('statRemainingBalance');

  if (incomeEl) incomeEl.textContent = window.store.formatCurrency(summary.totalIncome);
  if (expenseEl) expenseEl.textContent = window.store.formatCurrency(summary.totalExpenses);
  if (balanceEl) balanceEl.textContent = window.store.formatCurrency(summary.remainingBalance);

  // 3. Render recent transactions table
  renderRecentTransactions();

  // 4. Render circular budget status gauge
  renderBudgetWidget();
}

/**
 * Populates recent transactions table (latest 5 records)
 */
function renderRecentTransactions() {
  const tbody = document.getElementById('recentTransactionsBody');
  if (!tbody) return;

  // Get user's transactions and pick the top 5
  const transactions = window.store.getTransactions().slice(0, 5);

  // If no transactions exist
  if (transactions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div>No transactions recorded yet. Click "+ Add Transaction" to start!</div>
        </td>
      </tr>
    `;
    return;
  }

  // Generate table rows dynamically
  tbody.innerHTML = transactions.map(txn => {
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
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-secondary btn-sm" onclick="editTxnFromDashboard('${txn.id}')" title="Edit">
              ✏️
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteTxnFromDashboard('${txn.id}')" title="Delete">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Calculates budget consumption and animates circular SVG gauge
 */
function renderBudgetWidget() {
  const analysis = window.store.getBudgetAnalysis();

  const gaugeArc = document.getElementById('budgetGaugeArc');
  const percentText = document.getElementById('budgetPercentText');
  const spentVal = document.getElementById('budgetSpentVal');
  const totalVal = document.getElementById('budgetTotalVal');

  if (percentText) percentText.textContent = `${analysis.overallPercentage}%`;
  if (spentVal) spentVal.textContent = window.store.formatCurrency(analysis.totalSpent);
  if (totalVal) totalVal.textContent = window.store.formatCurrency(analysis.totalBudget);

  // Update SVG dasharray stroke to fill gauge circle
  if (gaugeArc) {
    const cappedPercent = Math.min(analysis.overallPercentage, 100);
    gaugeArc.setAttribute('stroke-dasharray', `${cappedPercent}, 100`);

    // Color code gauge: Red if >90%, Orange if >75%, Indigo if safe
    if (analysis.overallPercentage > 90) {
      gaugeArc.setAttribute('stroke', 'var(--accent-expense)');
    } else if (analysis.overallPercentage > 75) {
      gaugeArc.setAttribute('stroke', 'var(--accent-warning)');
    } else {
      gaugeArc.setAttribute('stroke', 'var(--primary)');
    }
  }
}

// ------------------------------------------------------------------------------
// ROW ACTION HANDLERS
// ------------------------------------------------------------------------------
window.editTxnFromDashboard = function(id) {
  const txns = window.store.getTransactions();
  const txn = txns.find(t => t.id === id);
  if (txn) {
    openTransactionModal(txn);
  }
};

window.deleteTxnFromDashboard = function(id) {
  const confirmDelete = confirm('Are you sure you want to delete this transaction?');
  if (confirmDelete) {
    window.store.deleteTransaction(id);
    showToast('Transaction deleted successfully', 'success');
    renderDashboard();
  }
};

// ------------------------------------------------------------------------------
// FORMATTING HELPERS
// ------------------------------------------------------------------------------
function formatDate(dateString) {
  if (!dateString) return '';
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return dateString;
  return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}
