/**
 * ==============================================================================
 * REPORTS & ANALYTICS CONTROLLER (js/reports.js)
 * ==============================================================================
 * Course: Web Application Development (Bahria University Karachi Campus)
 * Purpose:
 * 1. Calculate monthly financial summaries for selected time periods.
 * 2. Render Doughnut Chart for spending distribution across categories.
 * 3. Render Bar Chart comparing Total Income vs Total Expenses.
 * 4. Display tabular percentage breakdown of each expense category.
 * ==============================================================================
 */

let categoryChartInstance = null;
let cashflowChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  // Step 1: Render reports and charts
  renderReports();

  // Step 2: Handle Month/Period selector change
  const monthPicker = document.getElementById('reportMonthPicker');
  if (monthPicker) {
    monthPicker.addEventListener('change', () => {
      renderReports();
    });
  }

  // Step 3: Refresh when transactions are updated
  window.addEventListener('transactionDataChanged', () => {
    renderReports();
  });

  // Step 4: Redraw charts on theme switch for dark/light mode contrast
  window.addEventListener('themeChanged', () => {
    renderReports();
  });
});

/**
 * Main calculation and rendering function
 */
function renderReports() {
  const monthPicker = document.getElementById('reportMonthPicker');
  const selectedPeriod = monthPicker ? monthPicker.value : '2025-04';

  // 1. Fetch user transactions
  let txns = window.store.getTransactions();

  // 2. Filter by selected period (e.g. April 2025 or All Time)
  if (selectedPeriod !== 'all') {
    txns = txns.filter(t => (t.date || '').startsWith(selectedPeriod));
  }

  // 3. Calculate financial totals and group expenses by category
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryExpenses = {};

  txns.forEach(t => {
    const amt = parseFloat(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += amt;
    } else if (t.type === 'expense') {
      totalExpense += amt;
      const cat = t.category || 'Other';
      categoryExpenses[cat] = (categoryExpenses[cat] || 0) + amt;
    }
  });

  const netBalance = totalIncome - totalExpense;

  // 4. Update Summary Cards
  const incEl = document.getElementById('repIncome');
  const expEl = document.getElementById('repExpense');
  const balEl = document.getElementById('repBalance');

  if (incEl) incEl.textContent = window.store.formatCurrency(totalIncome);
  if (expEl) expEl.textContent = window.store.formatCurrency(totalExpense);
  if (balEl) balEl.textContent = window.store.formatCurrency(netBalance);

  // 5. Render Chart.js Visualizations
  renderCategoryDoughnut(categoryExpenses, totalExpense);
  renderCashflowBar(totalIncome, totalExpense);

  // 6. Render Table Breakdown
  renderCategoryBreakdownTable(categoryExpenses, totalExpense);
}

/**
 * Creates or updates the Doughnut Chart for category shares
 */
function renderCategoryDoughnut(categoryExpenses, totalExpense) {
  const ctx = document.getElementById('categoryChart')?.getContext('2d');
  if (!ctx) return;

  const labels = Object.keys(categoryExpenses);
  const data = Object.values(categoryExpenses);

  const colors = [
    '#f59e0b', '#3b82f6', '#ef4444', '#ec4899', 
    '#8b5cf6', '#10b981', '#06b6d4', '#6366f1'
  ];

  // Destroy previous chart instance before drawing a new one
  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  if (labels.length === 0) {
    labels.push('No Expenses');
    data.push(1);
    colors.splice(0, colors.length, '#94a3b8');
  }

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#f8fafc' : '#0f172a';

  if (typeof Chart !== 'undefined') {
    categoryChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: isDark ? '#111827' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: { family: 'Outfit', size: 12 },
              padding: 14
            }
          },
          tooltip: {
            callbacks: {
              label: function(item) {
                const val = item.raw;
                const pct = totalExpense > 0 ? ((val / totalExpense) * 100).toFixed(1) : 0;
                return ` ${item.label}: $${val} (${pct}%)`;
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  }
}

/**
 * Creates or updates the Bar Chart comparing Income vs Expenses
 */
function renderCashflowBar(income, expense) {
  const ctx = document.getElementById('cashflowBarChart')?.getContext('2d');
  if (!ctx) return;

  if (cashflowChartInstance) {
    cashflowChartInstance.destroy();
  }

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';

  if (typeof Chart !== 'undefined') {
    cashflowChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Income', 'Total Expenses', 'Net Balance'],
        datasets: [{
          label: 'Amount ($)',
          data: [income, expense, Math.max(0, income - expense)],
          backgroundColor: [
            '#10b981', // Green
            '#f43f5e', // Red
            '#4f46e5'  // Indigo
          ],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              callback: function(v) { return '$' + v; }
            },
            grid: { color: gridColor }
          },
          x: {
            ticks: { color: textColor, font: { family: 'Outfit', weight: '600' } },
            grid: { display: false }
          }
        }
      }
    });
  }
}

/**
 * Generates table rows for category percentages
 */
function renderCategoryBreakdownTable(categoryExpenses, totalExpense) {
  const tbody = document.getElementById('categoryDetailTableBody');
  if (!tbody) return;

  const entries = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state">No expense breakdown available for this month.</td></tr>`;
    return;
  }

  tbody.innerHTML = entries.map(([category, amount]) => {
    const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
    return `
      <tr>
        <td style="font-weight:600;">${category}</td>
        <td class="font-bold text-expense">${window.store.formatCurrency(amount)}</td>
        <td>
          <span class="badge badge-warning">${pct}% of total</span>
        </td>
        <td style="width:30%;">
          <div style="background:var(--bg-card-subtle); height:8px; border-radius:999px; overflow:hidden;">
            <div style="background:var(--primary); width:${pct}%; height:100%; border-radius:999px;"></div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}
