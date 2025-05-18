# Backend API Documentation

## Authentication

### Register User
- **Method**: POST
- **Endpoint**: `/api/auth/register`
- **Headers**: None
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "id": "user_id",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "token": "jwt_token"
  }
  ```

### Login User
- **Method**: POST
- **Endpoint**: `/api/auth/login`
- **Headers**: None
- **Body**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "id": "user_id",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "token": "jwt_token"
  }
  ```

## Product Management

### List All Products
- **Method**: GET
- **Endpoint**: `/api/products`
- **Headers**: None
- **Response**:
  ```json
  [
    {
      "id": "product_id",
      "name": "Sample Product",
      "description": "This is a sample product.",
      "price": 100,
      "category": "category_id",
      "condition": "new",
      "images": ["image1.jpg", "image2.jpg"],
      "createdBy": "user_id"
    }
  ]
  ```

### Create a Product
- **Method**: POST
- **Endpoint**: `/api/products`
- **Headers**:
  - `Authorization`: Bearer `jwt_token`
- **Body** (Form-data):
  - `name`: Sample Product
  - `description`: This is a sample product.
  - `price`: 100
  - `category`: category_id
  - `condition`: new
  - `images`: [File Upload]
- **Response**:
  ```json
  {
    "id": "product_id",
    "name": "Sample Product",
    "description": "This is a sample product.",
    "price": 100,
    "category": "category_id",
    "condition": "new",
    "images": ["image1.jpg", "image2.jpg"],
    "createdBy": "user_id"
  }
  ```

## Category Management

### List All Categories
- **Method**: GET
- **Endpoint**: `/api/categories`
- **Headers**: None
- **Response**:
  ```json
  [
    {
      "id": "category_id",
      "name": "Electronics",
      "description": "Devices and gadgets"
    }
  ]
  ```

### Create a Category
- **Method**: POST
- **Endpoint**: `/api/categories`
- **Headers**:
  - `Authorization`: Bearer `jwt_token`
- **Body**:
  ```json
  {
    "name": "Electronics",
    "description": "Devices and gadgets"
  }
  ```
- **Response**:
  ```json
  {
    "id": "category_id",
    "name": "Electronics",
    "description": "Devices and gadgets"
  }
  ```

## Real Estate Module

### List All Properties
- **Method**: GET
- **Endpoint**: `/api/properties`
- **Headers**: None
- **Response**:
  ```json
  [
    {
      "id": "property_id",
      "title": "Sample Property",
      "description": "This is a sample property.",
      "price": 500000,
      "location": "Sample Location",
      "images": ["image1.jpg", "image2.jpg"],
      "availableTimeSlots": [
        {
          "date": "2025-05-10T10:00:00.000Z",
          "isBooked": false
        }
      ],
      "createdBy": "user_id"
    }
  ]
  ```

### Create a Property
- **Method**: POST
- **Endpoint**: `/api/properties`
- **Headers**:
  - `Authorization`: Bearer `jwt_token`
- **Body** (Form-data):
  - `title`: Sample Property
  - `description`: This is a sample property.
  - `price`: 500000
  - `location`: Sample Location
  - `availableTimeSlots`: [{"date": "2025-05-10T10:00:00.000Z"}]
  - `images`: [File Upload]
- **Response**:
  ```json
  {
    "id": "property_id",
    "title": "Sample Property",
    "description": "This is a sample property.",
    "price": 500000,
    "location": "Sample Location",
    "images": ["image1.jpg", "image2.jpg"],
    "availableTimeSlots": [
      {
        "date": "2025-05-10T10:00:00.000Z",
        "isBooked": false
      }
    ],
    "createdBy": "user_id"
  }
  ```

### Book an Appointment
- **Method**: POST
- **Endpoint**: `/api/properties/:id/book`
- **Headers**:
  - `Authorization`: Bearer `jwt_token`
- **Body**:
  ```json
  {
    "date": "2025-05-10T10:00:00.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Appointment booked successfully"
  }
  ```

## Payment Integration

### Initiate a Payment
- **Method**: POST
- **Endpoint**: `/api/payments/initiate`
- **Headers**:
  - `Authorization`: Bearer `jwt_token`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "amount": 5000
  }
  ```
- **Response**:
  ```json
  {
    "status": true,
    "message": "Authorization URL created",
    "data": {
      "authorization_url": "https://paystack.com/pay/xyz",
      "access_code": "access_code",
      "reference": "transaction_reference"
    }
  }
  ```

### Verify a Payment
- **Method**: GET
- **Endpoint**: `/api/payments/verify`
- **Headers**:
  - `Authorization`: Bearer `jwt_token`
- **Query Parameters**:
  - `reference`: transaction_reference
- **Response**:
  ```json
  {
    "status": true,
    "message": "Verification successful",
    "data": {
      "reference": "transaction_reference",
      "status": "success",
      "amount": 5000,
      "currency": "NGN",
      "customer": {
        "email": "user@example.com"
      }
    }
  }
  ```