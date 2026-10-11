# Personal Expense Tracker — Assignment 2 (Frontend)

**Institution:** Bahria University Karachi Campus  
**Course:** Web Application Development  
**Instructor:** Ms. Mahnoor Tariq  
**Group Members:**
- Amna Yousaf (`02-115242-091`)
- Hafsah Sabih (`02-115242-011`)
- Faraz Tariq (`02-115242-089`)
- Haseeb Zahid (`02-115242-130`)

---

## 🎯 Assignment 2 Rubric Compliance (5 Marks)

| Rubric Criteria | Status | Implementation Details |
| :--- | :---: | :--- |
| **HTML Structure** | ✅ 100% | Semantic HTML5 (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<table>`, `<form>`), accessible aria attributes, clean head metadata. |
| **CSS / Design** | ✅ 100% | Vanilla CSS design system (`css/style.css`), FinTech color palette, Dark & Light mode toggle, glassmorphic cards, custom pill badges, micro-animations. |
| **JavaScript** | ✅ 100% | Pure client-side JavaScript (`localStorage` mock database), real-time calculation of balances & budgets, dynamic table filters, Chart.js interactive reports. |
| **Responsive Pages** | ✅ 100% | Fully responsive on Desktop, Tablet, and Mobile devices (`css/responsive.css`) with collapsible mobile navigation sidebar. |
| **Forms & Validation**| ✅ 100% | Client-side validation for Email format, Password length/matching, required numeric amounts, and dynamic toast feedback alerts. |

---

## 🗺️ Wireframe & Sitemap Mapping (Figure 1 & Figure 2)

All 10 interfaces from the proposal wireframe and the admin module are fully developed:

1. **`index.html` (Home / Landing Page)**:
   - Hero banner: *"Take Control of Your Money"*
   - Live balance preview card, feature highlights, navigation links, and university credit banner.
2. **`register.html` (Register Page)**:
   - Full Name, Email, Password, Confirm Password validation.
3. **`login.html` (Login Page)**:
   - Email, Password, Remember Me, and 1-click **Quick Fill Demo Logins** (User & Admin).
4. **`dashboard.html` (Dashboard Overview)**:
   - **Total Income:** `$2,500.00`
   - **Total Expenses:** `$1,200.00`
   - **Remaining Balance:** `$1,300.00`
   - Recent Transactions table with type badges & quick delete/edit actions.
   - Circular monthly budget utilization gauge.
5. **Add Transaction Modal**:
   - Universal modal: Type (Income/Expense), Category select, Amount, Date, and Description.
6. **`transactions.html` (Transactions Page)**:
   - Search by description filter.
   - Filter by Category dropdown & Filter by Type dropdown.
   - **Export to CSV** button and full CRUD operations.
7. **`categories.html` (Categories Page)**:
   - Category cards with emoji icons, color tags, record counter, and Add/Edit Category modal.
8. **`reports.html` (Reports & Analytics)**:
   - Month/Year selector (`April 2025`).
   - Category Breakdown Doughnut Chart.
   - Monthly Cash Flow Bar Chart (Income vs Expense vs Net Balance).
   - Spending proportion table with relative progress bars.
9. **`budget.html` (Budget Planner)**:
   - Set Category Budget Limit form.
   - Budget Overview circular gauge (`70% Spent: $700, Total: $1,000`).
   - Category-wise limit consumption progress bars with color warnings.
10. **`profile.html` (Profile & Settings)**:
    - User Details update, Currency selector (`$`, `Rs.`, `€`, `£`), Password changer, and 1-click Demo Data reset.
11. **`admin.html` (Admin Management Portal)**:
    - Fulfills **Functional Requirement 16** and Figure 1 Admin sitemap: Manage Users, Manage Categories, and Global Transaction Audit Log.

---

## 📁 Project Directory Structure

```
PersonalExpenseTracker/
├── index.html              # Landing Page
├── login.html              # User & Admin Login
├── register.html           # Account Registration
├── dashboard.html          # Main Dashboard
├── transactions.html       # Transactions Management & CSV Export
├── categories.html         # Categories Management
├── reports.html            # Charts & Visual Analytics
├── budget.html             # Budget Planner & Gauges
├── profile.html            # Profile & Account Settings
├── admin.html              # Admin Management Portal
├── css/
│   ├── style.css           # Design system, themes & UI tokens
│   └── responsive.css      # Mobile & Tablet responsive rules
└── js/
    ├── store.js            # Pure client-side LocalStorage DB
    ├── app.js              # Theme switcher, toasts & modals
    ├── dashboard.js        # Dashboard calculations
    ├── transactions.js     # Search, filter & CSV export
    ├── categories.js       # Category CRUD
    ├── reports.js          # Chart.js visualization logic
    ├── budget.js           # Budget analysis & calculations
    └── admin.js            # Admin user & audit controls
```

> **Zero Backend Requirement**: This project is built 100% on pure static frontend technologies (HTML, CSS, JavaScript). You can open any HTML file directly in Google Chrome, Microsoft Edge, or Mozilla Firefox without needing any server, PHP, Node, or database installation.
