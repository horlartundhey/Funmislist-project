import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/properties');
      // Always return an array for properties
      if (response.data && Array.isArray(response.data.properties)) {
        return response.data.properties;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
    }
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState: {
    properties: [],
    loading: false,
    error: null,
    singleProperty: null,
  },
  reducers: {
    clearProperties: (state) => {
      state.properties = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = Array.isArray(action.payload) ? action.payload : [];
        console.log('Updated Properties State:', state.properties); // Debug log
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unknown error occurred';
        console.error('Properties Error State:', action.payload); // Debug log
      });
  },
});

export const { clearProperties } = propertySlice.actions;
export default propertySlice.reducer;