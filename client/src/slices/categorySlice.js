import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await fetch('http://localhost:5000/api/categories');
    const data = await response.json();
    return data;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Filter out 'Real Estate' from categories
        state.categories = action.payload.filter(
          (cat) => cat.name.toLowerCase() !== 'real estate'
        );
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;