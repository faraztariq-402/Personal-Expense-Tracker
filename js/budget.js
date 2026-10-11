/**
 * ==============================================================================
 * BUDGET PLANNER CONTROLLER (js/budget.js)
 * ==============================================================================
 * Course: Web Application Development (Bahria University Karachi Campus)
 * Purpose:
 * 1. Allow user to set and update monthly budget limits for each category.
 * 2. Calculate spending percentage against budget targets.
 * 3. Render circular gauge & progress bars with warning colors.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Step 1: Populate category dropdown for setting budgets
  initBudgetCategoryDropdown();

  // Step 2: Render budget overview gauge and category limits table
  renderBudgetPlanner();

  // Step 3: Handle Budget form submit
  const budgetForm = document.getElementById('setBudgetForm');
  if (budgetForm) {
    budgetForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const category = document.getElementById('budgetCategory').value;
      const amount = parseFloat(document.getElementById('budgetAmount').value);

      if (!category || isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid budget amount', 'error');
        return;
      }

      // Save budget to LocalStorage
      window.store.saveBudget(category, amount);
      showToast(`Budget limit for ${category} saved ($${amount})`, 'success');

      budgetForm.reset();
      initBudgetCategoryDropdown();
      renderBudgetPlanner();
    });
  }

  // Step 4: Refresh budget when transactions change
  window.addEventListener('transactionDataChanged', () => {
    renderBudgetPlanner();
  });
});

/**
 * Fills category dropdown with expense categories
 */
function initBudgetCategoryDropdown() {
  const select = document.getElementById('budgetCategory');
  if (!select || !window.store) return;

  const expenseCategories = window.store.getCategories().filter(c => c.type === 'expense');
  select.innerHTML = expenseCategories.map(c => `<option value="${c.name}">${c.icon || ''} ${c.name}</option>`).join('');
}

/**
 * Calculates budget consumption and renders the gauge & category table
 */
function renderBudgetPlanner() {
  // 1. Get calculations from store helper
  const analysis = window.store.getBudgetAnalysis();

  // 2. Update Overview Gauge & Text
  const percentText = document.getElementById('budgetLargePercent');
  const spentText = document.getElementById('budgetLargeSpent');
  const totalText = document.getElementById('budgetLargeTotal');
  const gaugeArc = document.getElementById('budgetGaugeArcBig');
  const badge = document.getElementById('overallBudgetBadge');

  if (percentText) percentText.textContent = `${analysis.overallPercentage}%`;
  if (spentText) spentText.textContent = window.store.formatCurrency(analysis.totalSpent);
  if (totalText) totalText.textContent = window.store.formatCurrency(analysis.totalBudget);

  // Status badge (Healthy, Warning, or Exceeded)
  if (badge) {
    if (analysis.overallPercentage > 100) {
      badge.textContent = `Exceeded (${analysis.overallPercentage}%)`;
      badge.className = 'badge badge-expense';
    } else if (analysis.overallPercentage >= 75) {
      badge.textContent = `Warning (${analysis.overallPercentage}%)`;
      badge.className = 'badge badge-warning';
    } else {
      badge.textContent = `Healthy (${analysis.overallPercentage}%)`;
      badge.className = 'badge badge-income';
    }
  }

  // Update circular SVG gauge stroke
  if (gaugeArc) {
    const cappedPercent = Math.min(analysis.overallPercentage, 100);
    gaugeArc.setAttribute('stroke-dasharray', `${cappedPercent}, 100`);

    if (analysis.overallPercentage > 100) {
      gaugeArc.setAttribute('stroke', 'var(--accent-expense)');
    } else if (analysis.overallPercentage >= 75) {
      gaugeArc.setAttribute('stroke', 'var(--accent-warning)');
    } else {
      gaugeArc.setAttribute('stroke', 'var(--primary)');
    }
  }

  // 3. Render Category Limits Table
  renderBudgetCategoryTable(analysis.items);
}

/**
 * Generates table rows for category progress
 */
function renderBudgetCategoryTable(items) {
  const tbody = document.getElementById('budgetCategoryTableBody');
  const countEl = document.getElementById('categoryLimitsCount');
  if (!tbody) return;

  if (countEl) countEl.textContent = `${items.length} Active Limits`;

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No category budget limits set yet. Use the form above to add your first limit.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    // Choose progress bar color based on percentage
    let barColor = 'var(--accent-income)'; // Green
    if (item.percentage > 100) barColor = 'var(--accent-expense)'; // Red
    else if (item.percentage >= 75) barColor = 'var(--accent-warning)'; // Orange

    const remainingClass = item.remaining < 0 ? 'text-expense font-bold' : 'text-income';

    return `
      <tr>
        <td style="font-weight:600;">${item.category}</td>
        <td class="font-bold">${window.store.formatCurrency(item.amount)}</td>
        <td class="text-expense">${window.store.formatCurrency(item.spent)}</td>
        <td class="${remainingClass}">${window.store.formatCurrency(item.remaining)}</td>
        <td style="width:28%;">
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.25rem;">
            <span>${item.percentage}% used</span>
            <span>${item.remaining < 0 ? 'Exceeded' : 'Under Limit'}</span>
          </div>
          <div class="budget-progress-track">
            <div class="budget-progress-fill" style="width:${Math.min(item.percentage, 100)}%; background:${barColor};"></div>
          </div>
        </td>
        <td style="text-align:right;">
          <button class="btn btn-danger btn-sm" onclick="deleteCategoryBudget('${item.id}')" title="Remove Limit">
            🗑️
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ------------------------------------------------------------------------------
// REMOVE BUDGET LIMIT ACTION
// ------------------------------------------------------------------------------
window.deleteCategoryBudget = function(id) {
  const confirmDelete = confirm('Remove this category budget target?');
  if (confirmDelete) {
    window.store.deleteBudget(id);
    showToast('Budget limit removed', 'info');
    renderBudgetPlanner();
  }
};
