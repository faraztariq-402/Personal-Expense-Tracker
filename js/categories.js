/**
 * ==============================================================================
 * CATEGORIES MANAGEMENT CONTROLLER (js/categories.js)
 * ==============================================================================
 * Course: Web Application Development (Bahria University Karachi Campus)
 * Purpose: Manage expense/income categories, icons, and accent colors.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();

  // Open Add Category Modal
  const addBtn = document.getElementById('btnOpenAddCategory');
  if (addBtn) {
    addBtn.addEventListener('click', () => openCategoryModal());
  }

  // Color input listener to update text code
  const colorInput = document.getElementById('catColor');
  if (colorInput) {
    colorInput.addEventListener('input', (e) => {
      document.getElementById('catColorCode').textContent = e.target.value;
    });
  }

  // Category Form Submit (Add or Edit)
  const categoryForm = document.getElementById('categoryForm');
  if (categoryForm) {
    categoryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = document.getElementById('catId').value;
      const name = document.getElementById('catName').value.trim();
      const type = document.getElementById('catType').value;
      const icon = document.getElementById('catIcon').value;
      const color = document.getElementById('catColor').value;

      if (!name) {
        showToast('Please enter category name', 'error');
        return;
      }

      if (id) {
        // Edit category
        window.store.updateCategory(id, { name, type, icon, color });
        showToast('Category updated successfully!', 'success');
      } else {
        // Add new category
        window.store.addCategory({ name, type, icon, color });
        showToast('Category created successfully!', 'success');
      }

      closeCategoryModal();
      categoryForm.reset();
      renderCategories();
    });
  }
});

// ------------------------------------------------------------------------------
// RENDER ALL CATEGORIES WITH ACCENT COLORS
// ------------------------------------------------------------------------------
function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if (!container || !window.store) return;

  const categories = window.store.getCategories();
  const txns = window.store.getTransactions();

  if (categories.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div>No custom categories found. Click "+ Add Category" to create one.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = categories.map(cat => {
    // Count transactions using this category
    const usageCount = txns.filter(t => t.category.toLowerCase() === cat.name.toLowerCase()).length;
    const isExpense = cat.type === 'expense';
    const badgeClass = isExpense ? 'badge-expense' : 'badge-income';
    const accentColor = cat.color || '#4f46e5';

    return `
      <div class="category-card">
        <!-- Colored Accent Left Line -->
        <div class="category-card-accent-line" style="background:${accentColor};"></div>

        <div style="display:flex; align-items:center; gap:1rem;">
          <!-- Category Icon Bubble with solid accent border -->
          <div class="category-icon-bubble" style="background:var(--bg-card-subtle); border: 2px solid ${accentColor};">
            ${cat.icon || '🏷️'}
          </div>

          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-weight:700; font-size:1rem; color:var(--text-main);">${escapeHTML(cat.name)}</span>
              <!-- Small color dot -->
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${accentColor};" title="Accent: ${accentColor}"></span>
            </div>

            <div style="display:flex; gap:0.5rem; align-items:center; margin-top:0.35rem;">
              <span class="badge ${badgeClass}" style="font-size:0.7rem;">${isExpense ? 'Expense' : 'Income'}</span>
              <span class="text-xs text-muted">${usageCount} records</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex; gap:0.4rem;">
          <button class="btn btn-secondary btn-sm" onclick="editCategory('${cat.id}')" title="Edit Category">
            ✏️
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteCategory('${cat.id}', '${escapeHTML(cat.name)}')" title="Delete Category">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ------------------------------------------------------------------------------
// MODAL & COLOR PICKER HELPERS
// ------------------------------------------------------------------------------
function openCategoryModal(cat = null) {
  const modal = document.getElementById('categoryModal');
  const title = document.getElementById('categoryModalTitle');
  const idInput = document.getElementById('catId');
  const nameInput = document.getElementById('catName');
  const typeInput = document.getElementById('catType');
  const iconInput = document.getElementById('catIcon');
  const colorInput = document.getElementById('catColor');
  const colorCode = document.getElementById('catColorCode');

  if (cat) {
    title.textContent = 'Edit Category';
    idInput.value = cat.id;
    nameInput.value = cat.name;
    typeInput.value = cat.type;
    iconInput.value = cat.icon || '🍔';
    colorInput.value = cat.color || '#4f46e5';
    if (colorCode) colorCode.textContent = cat.color || '#4f46e5';
  } else {
    title.textContent = 'Add New Category';
    idInput.value = '';
    nameInput.value = '';
    typeInput.value = 'expense';
    iconInput.value = '🍔';
    colorInput.value = '#4f46e5';
    if (colorCode) colorCode.textContent = '#4f46e5';
  }

  modal.classList.add('active');
}

function closeCategoryModal() {
  const modal = document.getElementById('categoryModal');
  if (modal) modal.classList.remove('active');
}

// Helper to click color swatches
window.selectColorSwatch = function(hexColor) {
  const colorInput = document.getElementById('catColor');
  const colorCode = document.getElementById('catColorCode');
  if (colorInput) colorInput.value = hexColor;
  if (colorCode) colorCode.textContent = hexColor;
};

window.editCategory = function(id) {
  const cats = window.store.getCategories();
  const cat = cats.find(c => c.id === id);
  if (cat) openCategoryModal(cat);
};

window.deleteCategory = function(id, name) {
  if (confirm(`Are you sure you want to delete category "${name}"?`)) {
    window.store.deleteCategory(id);
    showToast(`Deleted category ${name}`, 'success');
    renderCategories();
  }
};

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}
