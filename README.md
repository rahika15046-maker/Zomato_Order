# Zomato Orders API

A backend REST API built with **Node.js, Express, and MySQL** that provides efficient, database-level pagination for restaurant orders using SQL `LIMIT` and `OFFSET`.

---

## Features

- **Database-Level Pagination**: Uses parameterized SQL queries (`SELECT * FROM orders LIMIT ? OFFSET ?`) to fetch only the requested slice of data.
- **Robust Parameter Validation**:
  - `limit`: Must be a positive integer (`> 0`, default: `10`).
  - `offset`: Must be a non-negative integer (`>= 0`, default: `0`).
  - Gracefully resets both parameters to defaults if invalid input (e.g. strings, floats, negative values) is supplied.
- **Layered Architecture**: Clean separation of concerns across controllers, services, database configuration, and route handlers.
- **Connection Pooling**: Utilizes `mysql2/promise` connection pooling for reliable and high-performance database communication.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL Server
- **Database Client**: `mysql2/promise`
- **Environment Management**: `dotenv`

---

## Project Structure

```
zomato-orders/
├── src/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool
│   ├── controllers/
│   │   └── orderController.js    # Query parsing & validation logic
│   ├── services/
│   │   └── orderService.js       # SQL query execution
│   ├── routes/
│   │   └── orderRoutes.js        # API route definitions
│   ├── middleware/
│   │   └── errorHandler.js       # Global error handling
│   └── app.js                    # Express application setup
├── server.js                     # HTTP server entrypoint
├── createdatabase.js             # Database setup and seed utility
├── .env.example                  # Environment configuration template
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL Server](https://www.mysql.com/) running locally

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/rahika15046-maker/Zomato_Order.git
cd Zomato_Order
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```env
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=zomato_orders
DB_PORT=3306
```

### 4. Database Initialization
Run the initialization script to create the `zomato_orders` database, the `orders` table, and seed initial records:
```bash
node createdatabase.js
```

### 5. Start the Server
```bash
npm start
```
The server will start listening at `http://localhost:8080`.

---

## API Documentation

### Get Orders

Retrieves a paginated list of restaurant orders.

```http
GET /api/orders
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|:---|:---|:---:|:---:|:---|
| `limit` | integer | No | `10` | Number of records to return (must be `> 0`). |
| `offset` | integer | No | `0` | Number of records to skip (must be `>= 0`). |

#### Examples

- Fetch default page (first 10 orders):
  ```http
  GET http://localhost:8080/api/orders
  ```
- Fetch 4 orders skipping the first order:
  ```http
  GET http://localhost:8080/api/orders?limit=4&offset=1
  ```
- Fetch next 5 orders:
  ```http
  GET http://localhost:8080/api/orders?limit=5&offset=5
  ```

#### Response (`200 OK`)

```json
[
  {
    "_id": "ebed34eb-7533-49f5-91cb-37c12f20d4b1",
    "title": "Triple Chocolate Enrobed Brownie Cake",
    "description": "This is the perfect cake for the true chocolate lover. Our dense, moist brownie cake is covered in not one, but three layers of decadent chocolate..."
  },
  {
    "_id": "fb79562d-e470-4445-990b-06aa875d3e97",
    "title": "Reddi Wip Dairy Whipped Topping Extra Creamy Aerosol Refrigerated",
    "description": "Reddi Wip® Extra Creamy Sweetened Dairy Whipped Topping. Milk from cows. Not treated with artificial growth hormone*. Made with real cream..."
  }
]
```

#### Health Check
```http
GET /health
```
Returns `{ "status": "ok" }` when the server is healthy.
