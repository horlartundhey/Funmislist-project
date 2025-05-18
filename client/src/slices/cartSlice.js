import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [], // Stores items in the cart
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      // Use item.id or item._id depending on what's available
      const itemId = item.id || item._id;
      const existingItem = state.cartItems.find((i) => (i.id || i._id) === itemId);

      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.cartItems.push({
          ...item,
          quantity: item.quantity || 1
        });
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((i) => (i.id || i._id) !== itemId);
    },
    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => (i.id || i._id) === id);

      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;