import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config/api.js';

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    return data;
  }
);

const categorySlice = createSlice({
  name: 'categories',  initialState: {
    categories: [], // deprecated, use filteredCategories or allCategories instead
    allCategories: [], // includes all categories including Real Estate
    filteredCategories: [], // excludes Real Estate category
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
        state.allCategories = action.payload; // Keep all categories including Real Estate
        // For general use, filter out Real Estate
        state.filteredCategories = action.payload.filter(
          cat => cat.name.toLowerCase() !== 'real estate'
        );
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;