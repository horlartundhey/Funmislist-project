import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config/api.js';

// Fetch banners by position (public endpoint)
export const fetchBannersByPosition = createAsyncThunk(
  'banners/fetchByPosition',
  async (position, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/banners/position/${position}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch banners');
      }
      const data = await response.json();
      return data.banners || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all banners (admin only)
export const fetchAllBanners = createAsyncThunk(
  'banners/fetchAll',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token;
      
      if (!token) {
        throw new Error('No authentication token');
      }

      let url = `${API_BASE_URL}/banners`;
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
      
      if (searchParams.toString()) url += '?' + searchParams.toString();
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch banners');
      }
      
      const data = await response.json();
      return data.banners || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create banner (admin only)
export const createBanner = createAsyncThunk(
  'banners/create',
  async (bannerData, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token;
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const formData = new FormData();
      Object.entries(bannerData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/banners`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create banner');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update banner (admin only)
export const updateBanner = createAsyncThunk(
  'banners/update',
  async ({ id, bannerData }, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token;
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const formData = new FormData();
      Object.entries(bannerData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update banner');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete banner (admin only)
export const deleteBanner = createAsyncThunk(
  'banners/delete',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token;
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to delete banner');
      }
      
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Toggle banner status (admin only)
export const toggleBannerStatus = createAsyncThunk(
  'banners/toggleStatus',
  async ({ id, active }, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token;
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/banners/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active })
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to toggle banner status');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  banners: [],
  heroBanners: [],
  shopBanners: [],
  categoryBanners: [],
  footerBanners: [],
  loading: false,
  error: null
};

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch banners by position
      .addCase(fetchBannersByPosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannersByPosition.fulfilled, (state, action) => {
        state.loading = false;
        const position = action.meta.arg;
        switch (position) {
          case 'hero':
            state.heroBanners = action.payload;
            break;
          case 'shop':
            state.shopBanners = action.payload;
            break;
          case 'category':
            state.categoryBanners = action.payload;
            break;
          case 'footer':
            state.footerBanners = action.payload;
            break;
          default:
            break;
        }
        state.error = null;
      })
      .addCase(fetchBannersByPosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all banners
      .addCase(fetchAllBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
        state.error = null;
      })
      .addCase(fetchAllBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
        state.error = null;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(banner => banner._id === action.payload._id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(banner => banner._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle banner status
      .addCase(toggleBannerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleBannerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(banner => banner._id === action.payload._id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleBannerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = bannerSlice.actions;
export default bannerSlice.reducer;
