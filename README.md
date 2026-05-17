# Expense Manager

A full-stack Expense Manager application built with Next.js 15, React 19, MongoDB, and Material UI. It helps users manage their daily expenses securely, offering features to add, update, delete, and view statistics for personal expenses.

## Features

- **User Authentication:** Secure registration, login, and password management (Forgot/Reset/Change password) using JWT.
- **Expense Tracking:** Create, read, update, and delete expenses effortlessly.
- **Dashboard & Statistics:** View comprehensive expense statistics and a categorized breakdown of your spending.
- **Responsive UI:** A beautiful and modern user interface built with Material UI (`@mui/material`), optimized for both desktop and mobile devices.
- **Secure Backend:** API routes protected by JSON Web Tokens (JWT) ensuring that users only access their own data.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Material UI, Emotion
- **Backend:** Next.js API Routes
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (jsonwebtoken, jose), bcryptjs

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18.x or later)
- npm, yarn, or pnpm
- A MongoDB database connection URI (e.g., MongoDB Atlas or a local instance)

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

Create a `.env` file in the root of the project and add the following environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Additional environment variables as required by the application
```

### Run Locally

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `/src/app` - Contains the Next.js App Router pages (`dashboard`, `login`, `register`, etc.) and API routes (`/api`).
- `/src/components` - Reusable UI components (Expense form, tables, statistics, etc.).
- `/src/lib` - Utility functions, including database connection setup.
- `/src/models` - Mongoose database schemas (`User.js`, `Expense.js`).

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and issue JWT
- `POST /api/auth/change-password` - Change the authenticated user's password
- `GET /api/expenses` - Get user's expenses
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses` - Update an expense
- `DELETE /api/expenses` - Delete an expense
- `GET /api/expenses/stats` - Get aggregated expense statistics

## License

This project is open-source and available under the MIT License.
