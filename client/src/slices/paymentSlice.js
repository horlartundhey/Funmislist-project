import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const initiatePayment = createAsyncThunk(
  'payment/initiate',
  async (paymentData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      const response = await axios.post(
        'https://funmislist-project.vercel.app/api/payments/initiate',
        {
          email: paymentData.userEmail,
          amount: paymentData.total,
          itemType: paymentData.itemType, // 'product' or 'property'
          itemId: paymentData.itemId,     // the actual product or property ID
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Payment failed' });
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: { loading: false, success: false, error: null, authorizationUrl: null },
  reducers: {
    resetPayment(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.authorizationUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Paystack returns the authorization_url in data object
        state.authorizationUrl = action.payload.data.authorization_url;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Payment initiation failed';
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;