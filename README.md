# StockWise — Smart Inventory Management System

StockWise is a full-stack inventory management application that helps users manage products, monitor stock levels, track inventory value, and maintain a history of stock movements through a simple dashboard.

## Features

- **User Authentication:** Register and log in securely using JWT authentication.
- **Dashboard:** View total products, units in stock, inventory value, and low-stock items.
- **Product Management:** Add, view, edit, search, filter, and delete products.
- **Stock Management:** Record stock-in and stock-out movements.
- **Transaction History:** Track stock movements with quantities, previous and updated stock levels, and notes.
- **Low-Stock Monitoring:** Identify products that have reached their low-stock threshold.
- **Input Validation:** Validate product details and stock movement quantities.
- **Protected Routes:** Restrict access to authenticated users.
- **User Data Isolation:** Ensure users access their own inventory data.

## Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

## Project Structure

```text
TaskFlow/
├── client/
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── ...
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── ...
└── README.md
```

## Prerequisites

Make sure the following are installed:

- Node.js and npm
- MongoDB, either locally or through MongoDB Atlas
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd TaskFlow
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the environment variables expected by your backend.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
```

Use the exact environment variable names referenced in your server code. Never commit real credentials or secrets to GitHub.

Start the backend:

```bash
npm run dev
```

If your `server/package.json` does not define a `dev` script, use the start command configured in that file.

### 3. Configure the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

The frontend API configuration should point to your running backend, which uses port `5000` in the current setup.

## API Endpoints

All endpoints are prefixed with `/api`. Protected endpoints require a valid JWT access token.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve the authenticated user's details |
| GET | `/api/products` | Retrieve products |
| POST | `/api/products` | Create a product |
| GET | `/api/products/:id` | Retrieve a product by ID |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| POST | `/api/products/:id/stock-movements` | Record stock IN or OUT |
| GET | `/api/transactions` | Retrieve stock transaction history |

## Validation and Security

- Passwords are hashed before storage.
- JWT authentication protects private API routes.
- Product and transaction operations are scoped to the authenticated user.
- Duplicate product SKUs are rejected where applicable.
- Invalid product details and stock movement quantities are validated.
- Stock-out operations are rejected when the requested quantity exceeds available stock.
- Environment variables are used for sensitive configuration.

## Testing

The application has been tested for authentication, product CRUD operations, duplicate SKU handling, input validation, stock movements, transaction history, pagination, filtering, invalid tokens, and user data isolation.

Perform a final end-to-end check of the frontend before submitting the project.

## Future Improvements

- Export inventory and transaction reports.
- Add visual analytics for stock movement trends.
- Support configurable stock alerts.
- Add automated tests for frontend and backend workflows.

## Author

Developed as a full-stack web development project using React, Node.js, Express, and MongoDB.
