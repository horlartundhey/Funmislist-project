import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import paymentReducer from './slices/paymentSlice';
import propertyReducer from './slices/propertySlice';
import transactionReducer from './slices/transactionSlice';

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  products: productReducer,
  categories: categoryReducer,
  payment: paymentReducer,
  properties: propertyReducer,
  transactions: transactionReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // only cart will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;