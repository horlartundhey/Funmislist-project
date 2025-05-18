# Funmislist Application

## Overview
Funmislist is an e-commerce and real estate platform that allows users to:
- Browse and purchase products.
- Book property inspections.
- Manage their cart and checkout securely using Paystack.

## Features
1. **Authentication**:
   - User registration and login.
   - Admin access for managing products, categories, and properties.

2. **Product Management**:
   - Browse products by category.
   - View product details.
   - Add products to the cart.

3. **Cart Management**:
   - View items in the cart.
   - Update quantities or remove items.
   - Proceed to checkout.

4. **Checkout**:
   - Collect shipping details.
   - Process payments securely using Paystack.

5. **Real Estate Module**:
   - Browse properties.
   - Book property inspection slots.

## Backend Endpoints
Refer to the `server/backend-docs.md` file for detailed API documentation.

## Frontend Implementation

### Pages
1. **Home Page**:
   - Displays categories and featured products.
   - File: `src/pages/HomePage.jsx`

2. **Category Page**:
   - Displays products within a selected category.
   - File: `src/pages/CategoryPage.jsx`

3. **Product Details Page**:
   - Displays detailed information about a product.
   - Includes an "Add to Cart" button.
   - File: `src/pages/ProductDetailsPage.jsx`

4. **Cart Page**:
   - Displays items in the cart.
   - Allows updating quantities or removing items.
   - File: `src/pages/CartPage.jsx`

5. **Checkout Page**:
   - Collects shipping details and processes payments.
   - File: `src/pages/CheckoutPage.jsx`

### Components
1. **Header**:
   - Navigation bar with links to the home page, cart, and login.
   - File: `src/components/Header.jsx`

2. **Footer**:
   - Footer with copyright information.
   - File: `src/components/Footer.jsx`

### State Management
- **Redux** is used for global state management.
- Store setup: `src/store.js`
- Slices:
  1. **User Slice**: Manages user authentication state.
     - File: `src/slices/userSlice.js`
  2. **Cart Slice**: Manages cart items and quantities.
     - File: `src/slices/cartSlice.js`
  3. **Product Slice**: Manages product data and loading states.
     - File: `src/slices/productSlice.js`

## How to Run the Application

### Prerequisites
- Node.js and npm installed.
- MongoDB instance running.

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database with test data:
   ```bash
   node seed.js
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Testing the Application
1. Open the application in your browser at `http://localhost:5173`.
2. Test the following workflows:
   - User registration and login.
   - Browsing products and categories.
   - Adding products to the cart and proceeding to checkout.
   - Booking property inspection slots.

## Insomnia API Testing
- Import the `server/insomnia.json` file into Insomnia to test backend endpoints.

## License
This project is licensed under the MIT License.
