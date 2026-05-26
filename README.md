# Expense Manager

A full-stack Expense Manager application built with Next.js 16, React 19, MongoDB, and Material UI. It helps users manage both personal expenses and loan records, with secure authentication and a modern dashboard experience.

## Features

- **User Authentication:** Secure registration, login, and change password with JWT-based authentication.
- **Expense Management:** Add, edit, delete, and list expenses with date and category support.
- **Loan Management:** Track both payable and receivable loans, including loan status and loan statistics.
- **Tabbed Dashboard:** Switch between Expense and Loan views using a modern tabbed interface.
- **Statistics:** View aggregated expense and loan metrics on the dashboard.
- **Responsive UI:** Built with Material UI and optimized for desktop and mobile screens.
- **Redux Toolkit State:** Client state management for expenses and loans via Redux Toolkit.
- **Secure Backend:** Next.js API routes protected by JWT, so each user only sees their own data.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Material UI, Emotion
- **State Management:** Redux Toolkit, React Redux
- **Backend:** Next.js API Routes
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (`jsonwebtoken`, `jose`), `bcryptjs`

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18.x or later)
- npm, yarn, or pnpm
- A MongoDB connection URI (e.g., MongoDB Atlas or a local instance)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd expense-manager
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root and add:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Run Locally

Start the Next.js development server:

```bash
npm run dev
```

The application runs at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `/src/app` - Next.js App Router pages and API route definitions.
- `/src/components` - UI components for expenses, loans, dashboards, and layout.
- `/src/lib` - Database utility helpers and connection setup.
- `/src/models` - Mongoose schemas for `User`, `Expense`, and `Loan`.
- `/src/store` - Redux Toolkit slices and store configuration.

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and issue JWT
- `POST /api/auth/change-password` - Change the authenticated user's password
- `GET /api/expenses` - Get authenticated user's expenses
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses` - Update an existing expense
- `DELETE /api/expenses` - Delete an expense
- `GET /api/expenses/stats` - Get aggregated expense statistics
- `GET /api/loans` - Get authenticated user's loans
- `POST /api/loans` - Create a new loan record
- `PUT /api/loans` - Update an existing loan record
- `DELETE /api/loans` - Delete a loan record
- `GET /api/loans/stats` - Get aggregated loan statistics

## License

This project is open-source and available under the MIT License.
