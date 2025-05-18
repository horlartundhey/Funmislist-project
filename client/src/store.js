import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import paymentReducer from './slices/paymentSlice';
import propertyReducer from './slices/propertySlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    payment: paymentReducer,
    properties: propertyReducer,
  },
});

export default store;