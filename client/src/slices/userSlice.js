import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getInitialUserState = () => {
  const userInfo = localStorage.getItem('userInfo');
  const token = localStorage.getItem('token');
  return {
    userInfo: userInfo ? JSON.parse(userInfo) : null,
    token: token || null,
  };
};

const initialState = getInitialUserState();

export const loginUser = createAsyncThunk('user/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const registerUser = createAsyncThunk('user/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const updateProfile = createAsyncThunk('user/updateProfile', async (profileData, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().user;
    const response = await fetch('/api/auth/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Profile update failed');
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        const userInfo = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role // Make sure role is included
        };
        state.userInfo = userInfo;
        state.token = action.payload.token;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const userInfo = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role // Make sure role is included
        };
        state.userInfo = userInfo;
        state.token = action.payload.token;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userInfo = { ...state.userInfo, ...action.payload };
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      });
  },
});

export const { login, logout } = userSlice.actions;
export { updateProfile };
export default userSlice.reducer;