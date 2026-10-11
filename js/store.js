/**
 * ==============================================================================
 * PERSONAL EXPENSE TRACKER - DATA STORE (MOCK DATABASE)
 * ==============================================================================
 * Course: Web Application Development (Bahria University Karachi Campus)
 * Purpose: Simulates a backend database using browser LocalStorage.
 * Designed to be clean, readable, and easy to explain during project defense!
 * ==============================================================================
 */

// 1. STORAGE KEYS (Names used inside browser LocalStorage)
const DB_KEYS = {
  USERS: 'pet_users',
  CURRENT_USER: 'pet_current_user',
  TRANSACTIONS: 'pet_transactions',
  CATEGORIES: 'pet_categories',
  BUDGETS: 'pet_budgets',
  SETTINGS: 'pet_settings'
};

// 2. SEED USERS (Group members + Admin for testing)
const INITIAL_USERS = [
  {
    id: 'usr_1',
    name: 'Amna Yousaf',
    email: 'user@gmail.com',
    password: 'password123',
    role: 'user',
    joined: '2025-04-01'
  },
  {
    id: 'usr_2',
    name: 'Faraz Tariq',
    email: 'faraz@gmail.com',
    password: 'password123',
    role: 'user',
    joined: '2025-04-02'
  },
  {
    id: 'usr_3',
    name: 'Haseeb Zahid',
    email: 'haseeb@gmail.com',
    password: 'password123',
    role: 'user',
    joined: '2025-04-03'
  },
  {
    id: 'usr_admin',
    name: 'System Admin',
    email: 'admin@expensetracker.com',
    password: 'adminpassword',
    role: 'admin',
    joined: '2025-01-01'
  }
];

// 3. SEED CATEGORIES (Standard student & personal categories)
const INITIAL_CATEGORIES = [
  { id: 'cat_1', name: 'Food', icon: '🍔', color: '#f59e0b', type: 'expense' },
  { id: 'cat_2', name: 'Transport', icon: '🚗', color: '#3b82f6', type: 'expense' },
  { id: 'cat_3', name: 'Bills', icon: '💡', color: '#ef4444', type: 'expense' },
  { id: 'cat_4', name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
  { id: 'cat_5', name: 'Education', icon: '🎓', color: '#8b5cf6', type: 'expense' },
  { id: 'cat_6', name: 'Health', icon: '🏥', color: '#10b981', type: 'expense' },
  { id: 'cat_7', name: 'Salary', icon: '💼', color: '#10b981', type: 'income' },
  { id: 'cat_8', name: 'Freelance', icon: '💻', color: '#06b6d4', type: 'income' },
  { id: 'cat_9', name: 'Allowance', icon: '🎁', color: '#6366f1', type: 'income' }
];

// 4. SEED TRANSACTIONS ACROSS DIFFERENT USERS
// Amna's transactions match Proposal Figure 2: Total Income $2,500, Expenses $1,200, Balance $1,300!
// Other transactions belong to Faraz and Haseeb so Admin sees transactions from ALL users!
const INITIAL_TRANSACTIONS = [
  // --- Amna Yousaf's records (usr_1) ---
  {
    id: 'txn_101',
    userId: 'usr_1',
    userName: 'Amna Yousaf',
    type: 'income',
    category: 'Salary',
    amount: 2500,
    date: '2025-04-10',
    description: 'Monthly Salary'
  },
  {
    id: 'txn_102',
    userId: 'usr_1',
    userName: 'Amna Yousaf',
    type: 'expense',
    category: 'Food',
    amount: 50,
    date: '2025-04-12',
    description: 'Grocery & Snacks'
  },
  {
    id: 'txn_103',
    userId: 'usr_1',
    userName: 'Amna Yousaf',
    type: 'expense',
    category: 'Transport',
    amount: 50,
    date: '2025-04-08',
    description: 'Fuel & Uber rides'
  },
  {
    id: 'txn_104',
    userId: 'usr_1',
    userName: 'Amna Yousaf',
    type: 'expense',
    category: 'Bills',
    amount: 200,
    date: '2025-04-05',
    description: 'Electricity & Internet'
  },
  {
    id: 'txn_105',
    userId: 'usr_1',
    userName: 'Amna Yousaf',
    type: 'expense',
    category: 'Shopping',
    amount: 450,
    date: '2025-04-04',
    description: 'Clothing & accessories'
  },
  {
    id: 'txn_106',
    userId: 'usr_1',
    userName: 'Amna Yousaf',
    type: 'expense',
    category: 'Education',
    amount: 450,
    date: '2025-04-02',
    description: 'University Semester Books'
  },

  // --- Faraz Tariq's records (usr_2) ---
  {
    id: 'txn_201',
    userId: 'usr_2',
    userName: 'Faraz Tariq',
    type: 'income',
    category: 'Freelance',
    amount: 1200,
    date: '2025-04-09',
    description: 'Web Design Project Payment'
  },
  {
    id: 'txn_202',
    userId: 'usr_2',
    userName: 'Faraz Tariq',
    type: 'expense',
    category: 'Food',
    amount: 75,
    date: '2025-04-11',
    description: 'Dinner with friends'
  },

  // --- Haseeb Zahid's records (usr_3) ---
  {
    id: 'txn_301',
    userId: 'usr_3',
    userName: 'Haseeb Zahid',
    type: 'income',
    category: 'Allowance',
    amount: 500,
    date: '2025-04-01',
    description: 'Monthly Pocket Allowance'
  },
  {
    id: 'txn_302',
    userId: 'usr_3',
    userName: 'Haseeb Zahid',
    type: 'expense',
    category: 'Transport',
    amount: 60,
    date: '2025-04-07',
    description: 'Bus & Van Pass'
  }
];

// 5. SEED BUDGET LIMITS FOR AMNA (usr_1)
const INITIAL_BUDGETS = [
  { id: 'bdg_1', userId: 'usr_1', category: 'Food', amount: 200, month: '2025-04' },
  { id: 'bdg_2', userId: 'usr_1', category: 'Transport', amount: 150, month: '2025-04' },
  { id: 'bdg_3', userId: 'usr_1', category: 'Shopping', amount: 500, month: '2025-04' },
  { id: 'bdg_4', userId: 'usr_1', category: 'Bills', amount: 300, month: '2025-04' },
  { id: 'bdg_5', userId: 'usr_1', category: 'Education', amount: 500, month: '2025-04' }
];

const INITIAL_SETTINGS = {
  currency: '$',
  dateFormat: 'YYYY-MM-DD'
};

/**
 * Main DataStore Class
 * Handles all reads and writes to LocalStorage.
 */
class DataStore {
  constructor() {
    this.initDatabase();
  }

  // First-time setup: load seed data into LocalStorage if empty
  initDatabase() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(DB_KEYS.CURRENT_USER)) {
      // Default logged in user is Amna Yousaf
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    }
    if (!localStorage.getItem(DB_KEYS.CATEGORIES)) {
      localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(DB_KEYS.TRANSACTIONS)) {
      localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    }
    if (!localStorage.getItem(DB_KEYS.BUDGETS)) {
      localStorage.setItem(DB_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
    }
    if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
      localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATION & SESSION MANAGEMENT
  // --------------------------------------------------------------------------
  getCurrentUser() {
    const data = localStorage.getItem(DB_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(DB_KEYS.CURRENT_USER);
    }
  }

  logout() {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
    window.location.href = 'login.html';
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
  }

  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  }

  updateUser(id, updatedFields) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedFields };
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
      
      // Update session if it's the currently logged-in user
      const current = this.getCurrentUser();
      if (current && current.id === id) {
        this.setCurrentUser(users[index]);
      }
      return users[index];
    }
    return null;
  }

  deleteUser(id) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== id);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  }

  // --------------------------------------------------------------------------
  // TRANSACTIONS MANAGEMENT
  // --------------------------------------------------------------------------
  /**
   * Get transactions.
   * - If an admin asks or fetchAll=true: returns ALL transactions across ALL users.
   * - If a regular student asks: returns ONLY their own transactions!
   */
  getTransactions(forceAll = false) {
    const all = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
    if (forceAll) return all;

    const current = this.getCurrentUser();
    if (!current) return [];

    // If logged-in user is an admin, they can see everything
    if (current.role === 'admin') {
      return all;
    }

    // Regular user sees ONLY their own records
    return all.filter(t => t.userId === current.id);
  }

  addTransaction(txn) {
    const txns = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
    const current = this.getCurrentUser();

    const newTxn = {
      id: 'txn_' + Date.now(),
      userId: current ? current.id : 'usr_1',
      userName: current ? current.name : 'Amna Yousaf',
      type: txn.type,
      category: txn.category,
      amount: parseFloat(txn.amount),
      date: txn.date,
      description: txn.description || txn.category
    };

    txns.unshift(newTxn);
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(txns));
    return newTxn;
  }

  updateTransaction(id, updated) {
    const txns = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
    const index = txns.findIndex(t => t.id === id);
    if (index !== -1) {
      txns[index] = {
        ...txns[index],
        ...updated,
        amount: parseFloat(updated.amount || txns[index].amount)
      };
      localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(txns));
      return txns[index];
    }
    return null;
  }

  deleteTransaction(id) {
    let txns = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
    txns = txns.filter(t => t.id !== id);
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(txns));
  }

  // --------------------------------------------------------------------------
  // FINANCIAL METRICS CALCULATION (Income, Expenses, Remaining Balance)
  // --------------------------------------------------------------------------
  getFinancialSummary() {
    const txns = this.getTransactions();
    let totalIncome = 0;
    let totalExpenses = 0;

    txns.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      if (t.type === 'income') {
        totalIncome += amt;
      } else if (t.type === 'expense') {
        totalExpenses += amt;
      }
    });

    return {
      totalIncome,
      totalExpenses,
      remainingBalance: totalIncome - totalExpenses
    };
  }

  // --------------------------------------------------------------------------
  // CATEGORIES MANAGEMENT
  // --------------------------------------------------------------------------
  getCategories() {
    return JSON.parse(localStorage.getItem(DB_KEYS.CATEGORIES) || '[]');
  }

  addCategory(category) {
    const cats = this.getCategories();
    const newCat = {
      id: 'cat_' + Date.now(),
      name: category.name,
      type: category.type,
      icon: category.icon || '🏷️',
      color: category.color || '#4f46e5'
    };
    cats.push(newCat);
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(cats));
    return newCat;
  }

  updateCategory(id, updated) {
    const cats = this.getCategories();
    const index = cats.findIndex(c => c.id === id);
    if (index !== -1) {
      cats[index] = { ...cats[index], ...updated };
      localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(cats));
      return cats[index];
    }
    return null;
  }

  deleteCategory(id) {
    let cats = this.getCategories();
    cats = cats.filter(c => c.id !== id);
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(cats));
  }

  // --------------------------------------------------------------------------
  // BUDGET MANAGEMENT
  // --------------------------------------------------------------------------
  getBudgets() {
    const all = JSON.parse(localStorage.getItem(DB_KEYS.BUDGETS) || '[]');
    const current = this.getCurrentUser();
    if (!current) return [];
    return all.filter(b => b.userId === current.id);
  }

  saveBudget(category, amount) {
    const budgets = JSON.parse(localStorage.getItem(DB_KEYS.BUDGETS) || '[]');
    const current = this.getCurrentUser();
    const userId = current ? current.id : 'usr_1';

    const index = budgets.findIndex(b => b.userId === userId && b.category === category);
    if (index !== -1) {
      budgets[index].amount = parseFloat(amount);
    } else {
      budgets.push({
        id: 'bdg_' + Date.now(),
        userId,
        category,
        amount: parseFloat(amount),
        month: '2025-04'
      });
    }
    localStorage.setItem(DB_KEYS.BUDGETS, JSON.stringify(budgets));
  }

  deleteBudget(id) {
    let budgets = JSON.parse(localStorage.getItem(DB_KEYS.BUDGETS) || '[]');
    budgets = budgets.filter(b => b.id !== id);
    localStorage.setItem(DB_KEYS.BUDGETS, JSON.stringify(budgets));
  }

  getBudgetAnalysis() {
    const budgets = this.getBudgets();
    const txns = this.getTransactions();

    let totalBudget = 0;
    let totalSpent = 0;

    const items = budgets.map(b => {
      totalBudget += b.amount;
      const spent = txns
        .filter(t => t.type === 'expense' && t.category === b.category)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      totalSpent += spent;
      const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;

      return {
        ...b,
        spent,
        remaining: b.amount - spent,
        percentage
      };
    });

    const overallPercentage = totalBudget > 0 
      ? Math.round((totalSpent / totalBudget) * 100) 
      : 0;

    return {
      items,
      totalBudget,
      totalSpent,
      overallPercentage
    };
  }

  // --------------------------------------------------------------------------
  // FORMATTING & RESET HELPERS
  // --------------------------------------------------------------------------
  getSettings() {
    return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || JSON.stringify(INITIAL_SETTINGS));
  }

  saveSettings(settings) {
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings));
  }

  formatCurrency(amount) {
    const settings = this.getSettings();
    const symbol = settings.currency || '$';
    return `${symbol}${Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }

  resetToDemo() {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(DB_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
}

// Attach store instance globally to window
window.store = new DataStore();
