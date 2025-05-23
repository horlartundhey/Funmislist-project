# Funmislist App – Tester Documentation

## Overview
Funmislist is a React + Redux web application for discovering, listing, and managing products and properties. It features a user-facing UI and an admin dashboard for CRUD operations, analytics, and category management.

---

## User-Facing Features

### 1. Home Page & Hero Section
- **Slideshow:** Rotating banner images at the top.
- **Dynamic Categories:** Up to 5 real categories are shown with intuitive icons (e.g., electronics, furniture, apparel, books, etc.).
- **Search Bar:** Search for listings by keyword.

### 2. Browsing
- **Categories:** Click a category icon to view all listings in that category.
- **Featured Listings:** See highlighted products and properties.
- **Product/Property Details:** Click any listing to view details, images, and price (formatted in Naira ₦).

### 3. Cart & Checkout
- **Add to Cart:** Add products to your cart.
- **Cart Page:** View, update, or remove items.
- **Checkout:** Proceed to payment (test payment flow).

### 4. User Account
- **Register/Login:** Create an account or log in.
- **User Dashboard:** View your orders, properties, and profile.

---

## Admin Dashboard

### 1. Access
- Log in as an admin to access the dashboard.

### 2. Sidebar Navigation
- Switch between Products, Properties, Categories, Users, and Analytics.

### 3. CRUD Operations
- **Products:** Add, edit, delete, publish/unpublish, and view products.
- **Properties:** Add, edit, delete, publish/unpublish, and view properties.
- **Categories:** Add, edit, or delete categories.
- **Properties/Products:** Upload images and set all required fields.

### 4. Analytics
- **Charts:** View payment and revenue analytics (powered by Chart.js).

### 5. Logout
- Use the logout button to securely end your session (clears user state and redirects to login).

---

## Special Features

- **Naira Formatting:** All prices are displayed in ₦ using a consistent format.
- **Dynamic Icons:** Category icons are automatically matched to the most intuitive icon based on the category name.
- **Responsive UI:** Works well on desktop and mobile.

---

## Notes for Testers

- Try adding, editing, and deleting products, properties, and categories as an admin.
- Test the search and category navigation as a regular user.
- Check that prices always show in ₦.
- Verify that category icons match the category type.
- Test the publish/unpublish toggles and “View” buttons.
- Try logging out and logging back in.

---

If you encounter any issues or have suggestions, please note the steps to reproduce and share screenshots if possible.
