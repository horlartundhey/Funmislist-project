import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config/api.js';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, subcategory, condition } = {}, { rejectWithValue }) => {
    try {
      let url = `${API_BASE_URL}/products`;
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);
      if (condition) params.append('condition', condition);
      console.log(`Fetching products with params: category=${category}, subcategory=${subcategory}, condition=${condition}`);
      if (params.toString()) url += '?' + params.toString();
      
      const response = await fetch(url);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch products');
      }
      const data = await response.json();
      // Always return an array of products
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.products)) return data.products;
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Optimized fetch for shop/listing pages
export const fetchProductsLean = createAsyncThunk(
  'products/fetchProductsLean',
  async (params = {}, { rejectWithValue }) => {
    try {
      let url = `${API_BASE_URL}/products/lean`;
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
      
      if (searchParams.toString()) url += '?' + searchParams.toString();
      
      const response = await fetch(url);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch products');
      }
      const data = await response.json();
      return data; // Returns { products, total, page, totalPages }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Advanced search with relevance scoring
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      let url = `${API_BASE_URL}/products/search`;
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
      
      if (searchParams.toString()) url += '?' + searchParams.toString();
      
      const response = await fetch(url);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to search products');
      }
      const data = await response.json();
      return data; // Returns { products, total, page, totalPages, searchTerm }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch product');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  // Pagination and search state
  total: 0,
  currentPage: 1,
  totalPages: 0,
  searchTerm: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = '';
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsLean.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsLean.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.currentPage = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 0;
        state.error = null;
      })
      .addCase(fetchProductsLean.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.currentPage = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 0;
        state.searchTerm = action.payload.searchTerm || '';
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProduct, setCurrentPage, clearSearch } = productSlice.actions;
export default productSlice.reducer;