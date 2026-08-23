# 💸 Expense & Loan Manager

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/Material_UI-v7-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

A modern, production-ready, full-stack financial management platform built with **Next.js 16 (App Router)**, **React 19**, **MongoDB**, and **Material UI**. Effortlessly track daily expenses, monitor personal loans (payable & receivable), visualize spending analytics with interactive charts, and manage your financial health securely in one unified dashboard.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Folder Structure](#-architecture--folder-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [Available Scripts](#-available-scripts)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [Security & Authentication](#-security--authentication)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Key Features

### 📊 Expense Tracking & Analytics
- **Full CRUD Support:** Add, view, edit, and delete personal expense records.
- **Categorization & Metadata:** Organize expenses by category, amount, custom notes, and transaction dates.
- **Interactive Visualizations:** Dynamic bar charts and monthly breakdown analytics powered by **Recharts**.
- **Data Filtering & Pagination:** Search, sort, and filter expenses effortlessly across large data sets.

### 🤝 Comprehensive Loan Management
- **Dual Loan Tracking:** Manage both **Receivable** (money you lent) and **Payable** (debts you owe) records.
- **Status Lifecycles:** Track loans with granular statuses (*Pending, Active, Partially Paid, Settled*).
- **Metric Summaries:** Instant calculations of total lent, total borrowed, and net balance.

### 🛡️ Authentication & User Isolation
- **Secure JWT Auth:** Token-based authentication using `jose` and `jsonwebtoken`.
- **Password Protection:** Industry-standard password hashing using `bcryptjs`.
- **User-Isolated Storage:** Multi-tenant architecture ensuring complete data privacy—users only access their own records.
- **Credential Management:** Dedicated password change workflows with session verification.

### 🎨 Modern UI / UX Design
- **Sleek Dark Theme:** Carefully crafted Material UI theme with custom glassmorphism, modern typography (`Inter`), and purple accent palettes.
- **Unified Tabbed Interface:** Seamlessly switch between Expenses and Loans without full page reloads.
- **Toast Notifications:** Instant feedback for operations via `notistack`.
- **Responsive Layout:** Optimized for mobile, tablet, and widescreen desktop displays.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Route Handlers) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Styling & UI** | [Material UI v7](https://mui.com/), [Emotion](https://emotion.sh/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/), [React Redux](https://react-redux.js.org/) |
| **Data Visualizations** | [Recharts](https://recharts.org/) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/) |
| **Authentication** | [JWT (`jsonwebtoken`, `jose`)](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| **Notifications** | [Notistack](https://notistack.com/) |

---

## 📁 Architecture & Folder Structure

```text
expense-manager/
├── public/                  # Static assets & public icons
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # RESTful backend API routes
│   │   │   ├── auth/        # /login, /register, /change-password
│   │   │   ├── expenses/    # CRUD & /stats endpoints
│   │   │   └── loans/       # CRUD & /stats endpoints
│   │   ├── change-password/ # Change password page
│   │   ├── login/           # User sign-in page
│   │   ├── register/        # User sign-up page
│   │   ├── layout.js        # Root layout with providers
│   │   └── page.js          # Main dashboard page
│   ├── components/          # Modular React components
│   │   ├── Expense/         # Forms, tables, charts, & modals
│   │   ├── Loan/            # Loan tables, forms, & stat cards
│   │   ├── ThemeRegistry/   # Custom MUI dark theme provider
│   │   └── UI/              # Skeletons, loaders, and shared UI
│   ├── lib/                 # Database connection helpers & utilities
│   ├── models/              # Mongoose schemas (User, Expense, Loan)
│   └── store/               # Redux Toolkit store and slices
├── .env                     # Environment variables (local)
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies and npm scripts
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local development machine:
- **Node.js**: `v18.17.0` or later (Node.js 20+ recommended)
- **Package Manager**: `npm`, `yarn`, or `pnpm`
- **MongoDB**: A running MongoDB instance (e.g., [MongoDB Atlas](https://www.mongodb.com/atlas) or local MongoDB server)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/expense-manager.git
   cd expense-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/expense_manager?retryWrites=true&w=majority

# JSON Web Token Secret Key
JWT_SECRET=your_super_secret_jwt_signing_key_here
```

> ⚠️ **Important:** Never commit your `.env` file to version control.

### Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launches the Next.js development server with hot reloading |
| `npm run build` | Builds the optimized production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to inspect code quality and adherence |

---

## 🔌 API Reference

All protected endpoints require an active JWT session.

### Authentication Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT cookie |
| `POST` | `/api/auth/change-password` | Update current user password |

### Expense Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | Fetch user expenses with query filters |
| `POST` | `/api/expenses` | Create a new expense record |
| `PUT` | `/api/expenses` | Update an existing expense record |
| `DELETE` | `/api/expenses` | Remove an expense record |
| `GET` | `/api/expenses/stats` | Retrieve monthly aggregated expense metrics |

### Loan Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/loans` | Fetch user loan records |
| `POST` | `/api/loans` | Create a new loan entry (payable/receivable) |
| `PUT` | `/api/loans` | Update an existing loan entry |
| `DELETE` | `/api/loans` | Delete a loan entry |
| `GET` | `/api/loans/stats` | Retrieve loan statistics (total lent, borrowed, net) |

---

## 🗄️ Data Models

- **`User`**: Manages credentials (`email`, hashed `password`, `name`, timestamps).
- **`Expense`**: Stores financial records (`userId`, `title`, `amount`, `category`, `date`, `description`).
- **`Loan`**: Tracks debts & receivables (`userId`, `personName`, `amount`, `type`, `status`, `dueDate`, `notes`).

---

## 🔒 Security & Authentication

- **Token Validation**: API routes utilize JWT validation middleware to ensure requests originate from authenticated sessions.
- **Data Scoping**: Every query filters by `userId` to strictly isolate user data.
- **Password Salting**: Passwords are encrypted before database persistence using `bcryptjs` with salt rounds.

---

## 🤝 Contributing

Contributions are always welcome! If you'd like to improve this project:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
