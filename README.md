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

## AI Development Experience

Code0 was used as an AI-assisted development tool during the development of StockWise. It provided assistance with selected development tasks, debugging, and exploring implementation improvements. AI-generated suggestions were reviewed and tested to verify their correctness.

### Tasks Supported by AI Assistance

1. **React Component Development:** Used AI assistance to explore improvements to frontend components and page structure.
2. **REST API Development:** Received assistance with reviewing API implementation, request handling, and input validation.
3. **MongoDB Integration:** Used AI assistance to troubleshoot database-related issues and verify data persistence.
4. **Debugging and Testing:** Received help investigating errors, validating edge cases, and improving error handling.
5. **Code Review and Refactoring:** Used AI suggestions to identify opportunities to improve code readability and maintainability.

AI assistance supported the development process, while implementation decisions, testing, and final validation remained the developer's responsibility.

### Code0 Workflow

Code0 was used as an AI-assisted development tool to support selected tasks during the project. Its suggestions were reviewed rather than automatically accepted, and the application was tested to validate the resulting behavior.

## Future Development

- Use Code0 for additional debugging, refactoring, and testing tasks.
- Expand automated test coverage for frontend and backend workflows.
- Improve inventory analytics and reporting capabilities.


## Author

Developed as a full-stack web development project using React, Node.js, Express, and MongoDB.
