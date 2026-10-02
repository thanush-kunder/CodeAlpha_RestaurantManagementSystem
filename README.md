# CodeAlpha Restaurant Management System

A comprehensive restaurant management backend service built with Node.js, Express.js, MongoDB, and JWT authentication.

## Features

- **Menu Management**: CRUD operations for menu items with categories
- **Table Management**: Manage restaurant tables with capacity and location
- **Reservation System**: Table reservations with conflict detection
- **Order Processing**: Complete order lifecycle with status tracking
- **Inventory Tracking**: Stock management with low stock alerts
- **Automatic Inventory Updates**: Inventory auto-updates after order placement
- **Sales Reporting**: Daily sales, date range reports, and popular items
- **User Authentication**: JWT-based authentication with role-based access
- **Payment Tracking**: Payment status and method management

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **dotenv** - Environment variable management

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd CodeAlpha_RestaurantManagementSystem
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in the root directory
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`
```
PORT=5002
MONGODB_URI=mongodb://localhost:27017/restaurant-management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start MongoDB server (if running locally)

6. Run the application
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### 1. Register User
**POST** `/api/auth/register`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "staff"
}
```

#### 2. Login User
**POST** `/api/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get Current User
**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer <token>
```

### Menu Items

#### 4. Get All Menu Items
**GET** `/api/menu`

Query Parameters:
- `category` - Filter by category (appetizer, main, dessert, beverage, special)
- `isAvailable` - Filter by availability (true/false)

#### 5. Get Menu Item by ID
**GET** `/api/menu/:id`

#### 6. Create Menu Item (Admin)
**POST** `/api/menu`

Headers:
```
Authorization: Bearer <admin_token>
```

Request Body:
```json
{
  "name": "Burger",
  "description": "Delicious beef burger",
  "category": "main",
  "price": 12.99,
  "preparationTime": 20,
  "ingredients": [
    { "name": "Beef Patty", "quantity": 1 },
    { "name": "Bun", "quantity": 1 }
  ]
}
```

#### 7. Update Menu Item (Admin)
**PUT** `/api/menu/:id`

#### 8. Delete Menu Item (Admin)
**DELETE** `/api/menu/:id`

### Tables

#### 9. Get All Tables
**GET** `/api/tables`

Query Parameters:
- `isAvailable` - Filter by availability (true/false)
- `location` - Filter by location (indoor, outdoor, patio, vip)

#### 10. Get Table by ID
**GET** `/api/tables/:id`

#### 11. Create Table (Admin)
**POST** `/api/tables`

Request Body:
```json
{
  "tableNumber": 1,
  "capacity": 4,
  "location": "indoor"
}
```

#### 12. Update Table (Admin)
**PUT** `/api/tables/:id`

#### 13. Delete Table (Admin)
**DELETE** `/api/tables/:id`

### Reservations

#### 14. Get All Reservations (Admin)
**GET** `/api/reservations`

Query Parameters:
- `status` - Filter by status (pending, confirmed, cancelled, completed)
- `date` - Filter by date (YYYY-MM-DD)

#### 15. Get Reservation by ID
**GET** `/api/reservations/:id`

#### 16. Create Reservation
**POST** `/api/reservations`

Request Body:
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "table": "65a1b2c3d4e5f6g7h8i9j0k",
  "date": "2024-03-15",
  "time": "19:00",
  "numberOfGuests": 4,
  "specialRequests": "Window seat preferred"
}
```

#### 17. Update Reservation
**PUT** `/api/reservations/:id`

#### 18. Cancel Reservation
**DELETE** `/api/reservations/:id`

### Orders

#### 19. Get All Orders
**GET** `/api/orders`

Query Parameters:
- `status` - Filter by status (pending, preparing, ready, served, cancelled)
- `paymentStatus` - Filter by payment status (pending, paid, refunded)

#### 20. Get Order by ID
**GET** `/api/orders/:id`

#### 21. Create Order
**POST** `/api/orders`

Request Body:
```json
{
  "customerName": "John Doe",
  "table": "65a1b2c3d4e5f6g7h8i9j0k",
  "items": [
    {
      "menuItem": "65a1b2c3d4e5f6g7h8i9j0k",
      "quantity": 2
    }
  ],
  "paymentMethod": "card",
  "specialInstructions": "No onions"
}
```

#### 22. Update Order Status
**PUT** `/api/orders/:id/status`

Request Body:
```json
{
  "status": "preparing"
}
```

#### 23. Update Payment Status
**PUT** `/api/orders/:id/payment`

Request Body:
```json
{
  "paymentStatus": "paid"
}
```

#### 24. Delete Order (Admin)
**DELETE** `/api/orders/:id`

### Inventory

#### 25. Get All Inventory
**GET** `/api/inventory`

Query Parameters:
- `category` - Filter by category (food, beverage, ingredient, supplies)
- `isLowStock` - Filter by low stock status (true/false)

#### 26. Get Low Stock Items
**GET** `/api/inventory/low-stock`

#### 27. Get Inventory Item by ID
**GET** `/api/inventory/:id`

#### 28. Create Inventory Item (Admin)
**POST** `/api/inventory`

Request Body:
```json
{
  "name": "Beef Patty",
  "category": "ingredient",
  "quantity": 50,
  "unit": "pieces",
  "minimumStock": 10,
  "costPerUnit": 2.50,
  "supplier": "Meat Supplier Inc"
}
```

#### 29. Update Inventory Item (Admin)
**PUT** `/api/inventory/:id`

#### 30. Restock Inventory (Admin)
**PUT** `/api/inventory/:id/restock`

Request Body:
```json
{
  "quantity": 20
}
```

#### 31. Delete Inventory Item (Admin)
**DELETE** `/api/inventory/:id`

### Reports

#### 32. Get Daily Sales Report (Admin)
**GET** `/api/reports/daily-sales`

Query Parameters:
- `date` - Date for report (YYYY-MM-DD, defaults to today)

#### 33. Get Sales Range Report (Admin)
**GET** `/api/reports/sales-range`

Query Parameters:
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

#### 34. Get Popular Items (Admin)
**GET** `/api/reports/popular-items`

Query Parameters:
- `limit` - Number of items to return (default: 10)

#### 35. Get Order Status Summary (Admin)
**GET** `/api/reports/order-status`

## Project Structure

```
RestaurantManagementSystem/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── menuController.js        # Menu management logic
│   │   ├── tableController.js       # Table management logic
│   │   ├── reservationController.js # Reservation logic
│   │   ├── orderController.js       # Order processing logic
│   │   ├── inventoryController.js   # Inventory management logic
│   │   └── reportController.js      # Reporting logic
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── MenuItem.js              # Menu item schema
│   │   ├── Table.js                 # Table schema
│   │   ├── Reservation.js           # Reservation schema
│   │   ├── Order.js                 # Order schema
│   │   └── Inventory.js             # Inventory schema
│   ├── routes/
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── menuRoutes.js            # Menu routes
│   │   ├── tableRoutes.js           # Table routes
│   │   ├── reservationRoutes.js     # Reservation routes
│   │   ├── orderRoutes.js           # Order routes
│   │   ├── inventoryRoutes.js       # Inventory routes
│   │   └── reportRoutes.js          # Report routes
│   ├── middleware/
│   │   ├── auth.js                  # Authentication middleware
│   │   └── errorHandler.js          # Error handling
│   └── server.js                    # App entry point
├── .env.example                     # Environment variables template
├── package.json                     # Dependencies
└── README.md                        # Documentation
```

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['staff', 'admin'], default: 'staff'),
  createdAt: Date
}
```

### MenuItem Model
```javascript
{
  name: String (required),
  description: String (required),
  category: String (enum: ['appetizer', 'main', 'dessert', 'beverage', 'special']),
  price: Number (required, min: 0),
  image: String,
  isAvailable: Boolean (default: true),
  preparationTime: Number (default: 15),
  ingredients: [{ name: String, quantity: Number }],
  createdAt: Date
}
```

### Table Model
```javascript
{
  tableNumber: Number (required, unique),
  capacity: Number (required, min: 1),
  location: String (enum: ['indoor', 'outdoor', 'patio', 'vip']),
  isAvailable: Boolean (default: true),
  createdAt: Date
}
```

### Reservation Model
```javascript
{
  customerName: String (required),
  customerEmail: String (required),
  customerPhone: String (required),
  table: ObjectId (ref: Table, required),
  date: Date (required),
  time: String (required),
  numberOfGuests: Number (required, min: 1),
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  specialRequests: String,
  createdAt: Date
}
```

### Order Model
```javascript
{
  orderNumber: String (required, unique),
  customerName: String (required),
  table: ObjectId (ref: Table),
  items: [{
    menuItem: ObjectId (ref: MenuItem),
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number (required),
  status: String (enum: ['pending', 'preparing', 'ready', 'served', 'cancelled']),
  paymentStatus: String (enum: ['pending', 'paid', 'refunded']),
  paymentMethod: String (enum: ['cash', 'card', 'online']),
  specialInstructions: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Model
```javascript
{
  name: String (required),
  category: String (enum: ['food', 'beverage', 'ingredient', 'supplies']),
  quantity: Number (required, min: 0),
  unit: String (enum: ['kg', 'g', 'l', 'ml', 'pieces', 'dozen', 'pack']),
  minimumStock: Number (required),
  costPerUnit: Number (required),
  supplier: String,
  lastRestocked: Date,
  isLowStock: Boolean (auto-calculated),
  createdAt: Date
}
```

## Key Features

### Automatic Inventory Updates
When an order is placed, the system automatically deducts the required ingredients from inventory based on the menu item's ingredient list. If inventory is insufficient, the order will be rejected.

### Low Stock Alerts
The system automatically flags inventory items as low stock when the quantity falls below the minimum stock threshold. These items can be filtered using the `/api/inventory/low-stock` endpoint.

### Reservation Conflict Detection
The system prevents double-booking by checking for existing reservations at the same table, date, and time before creating a new reservation.

### Order Lifecycle
Orders progress through status stages: pending → preparing → ready → served. Each status update is tracked and can be monitored through the reporting endpoints.

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Admin-only routes require the user to have the 'admin' role.

## Testing with Postman

Import the provided Postman collection to test all endpoints:

1. Open Postman
2. Click Import
3. Select the `RestaurantManagementSystem.postman_collection.json` file
4. Update the `baseUrl` variable to match your server
5. Test each endpoint

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- Resource not found errors
- Inventory shortage errors
- Reservation conflict errors

All errors return a JSON response with:
```json
{
  "success": false,
  "error": "Error message"
}
```

## License

ISC

## Author

CodeAlpha Intern

## Acknowledgments

This project was developed as part of the CodeAlpha Backend Development Internship program.
